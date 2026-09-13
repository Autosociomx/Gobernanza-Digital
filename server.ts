import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import Database from "better-sqlite3";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import Stripe from "stripe";
import { componerPromptDelSistema } from "./shared/traduccion/asistente";

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY no configurada. Por favor, añádela en Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Initialize Stripe
let stripeClient: Stripe | null = null;
function getStripe() {
    if (!stripeClient && process.env.STRIPE_SECRET_KEY) {
        stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripeClient;
}

// Initialize Database
const db = new Database("government_data.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    contact_email TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Load System Prompt from public/CONNECTX_SYSTEM_PROMPT.md
  let systemPrompt = "Eres ConnectX. Experto en administración municipal y gobernanza digital de Tepic. Tono: Institucional, extremadamente breve y directo. Objetivo: Soluciones pragmáticas de infraestructura y transparencia. Siempre incluye un 'Siguiente paso'.";

  try {
    const promptPath = path.join(process.cwd(), 'public', 'CONNECTX_SYSTEM_PROMPT.md');
    const fileContent = await fs.readFile(promptPath, 'utf-8');
    if (fileContent.trim()) {
      systemPrompt = fileContent;
    }
  } catch (error) {
    console.warn("Could not read CONNECTX_SYSTEM_PROMPT.md, using default fallback.", error);
  }

  // La restricción de lenguas se compone aquí, no en el .md: ese archivo puede
  // reemplazarse por completo y la regla no debe poder borrarse editándolo.
  systemPrompt = componerPromptDelSistema(systemPrompt);

  // API routes
  app.get("/api/departments", (req, res) => {
    const stmt = db.prepare("SELECT * FROM departments");
    res.json(stmt.all());
  });

  app.post("/api/departments", (req, res) => {
    const { name, description, contact_email } = req.body;
    const stmt = db.prepare("INSERT INTO departments (name, description, contact_email) VALUES (?, ?, ?)");
    const info = stmt.run(name, description, contact_email);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/departments/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM departments WHERE id = ?");
    stmt.run(id);
    res.json({ success: true });
  });

  app.put("/api/departments/:id", (req, res) => {
    const { id } = req.params;
    const { name, description, contact_email } = req.body;
    const stmt = db.prepare("UPDATE departments SET name = ?, description = ?, contact_email = ? WHERE id = ?");
    stmt.run(name, description, contact_email, id);
    res.json({ success: true });
  });

  // AI Assistant Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    const { message, context, useThinking, useMaps, useSearch } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: "GEMINI_API_KEY no configurada. Por favor, añádela en Settings > Secrets." 
      });
    }

    try {
      const finalPrompt = context ? `${context}\n\nPregunta del usuario: ${message}` : message;
      const ai = getAI();
      
      let model = "gemini-3.5-flash";
      let config: any = {
        systemInstruction: systemPrompt,
      };

      if (useThinking) {
        model = "gemini-3.1-pro-preview";
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH }; 
      } else if (useMaps) {
        config.tools = [{ googleMaps: {} }];
      } else if (useSearch) {
        config.tools = [{ googleSearch: {} }];
      }
      
      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        config: config,
      });
      
      res.json({ response: response.text });
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      res.status(500).json({ error: error.message || "Error procesando la solicitud de IA" });
    }
  });

  // Análisis de riesgos: se ejecuta aquí para que GEMINI_API_KEY nunca
  // viaje al navegador (antes el cliente creaba su propio GoogleGenAI)
  app.post("/api/ai/risk-analysis", async (req, res) => {
    const { departments, logs } = req.body;
    try {
      const ai = getAI();
      const prompt = `
      IDENTIDAD: Actúa como el G-Agente CX, el Oráculo de Gobernanza Digital de Élite y Auditor Forense de Grado Industrial.
      MISIÓN: Realizar un análisis exhaustivo de la infraestructura de datos gubernamentales para garantizar la soberanía digital y la integridad sistémica.

      CONTEXTO OPERATIVO:
      - 48 Dependencias Gubernamentales bajo monitoreo.
      - Registros de auditoría inmutables.

      DATOS DE ENTRADA (DEPENDENCIAS):
      ${JSON.stringify(departments ?? [], null, 2)}

      DATOS DE ENTRADA (LOGS DE AUDITORÍA):
      ${JSON.stringify(logs ?? [], null, 2)}

      DIRECTIVAS DE ANÁLISIS:
      1. Evaluar la coherencia estratégica de las misiones de las dependencias.
      2. Detectar anomalías en la frecuencia y tipo de operaciones (CREATE, UPDATE, DELETE).
      3. Identificar riesgos de colusión o manipulación de datos mediante patrones de acceso.
      4. Calcular el Índice de Soberanía Digital basado en la integridad y trazabilidad de los datos.
      5. Determinar la Madurez de Gobernanza (INITIAL, DEVELOPING, OPTIMIZED, ELITE).

      REQUERIMIENTOS DE SALIDA:
      Responde estrictamente en formato JSON.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              level: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
              findings: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              anomaliesDetected: { type: Type.BOOLEAN },
              summary: { type: Type.STRING },
              strategicOutlook: { type: Type.STRING },
              sovereigntyIndex: { type: Type.NUMBER },
              governanceMaturity: { type: Type.STRING, enum: ["INITIAL", "DEVELOPING", "OPTIMIZED", "ELITE"] }
            },
            required: ["score", "level", "findings", "recommendations", "anomaliesDetected", "summary", "strategicOutlook", "sovereigntyIndex", "governanceMaturity"]
          }
        }
      });

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("AI Risk Analysis Error:", error);
      res.status(500).json({ error: error.message || "Error en el análisis de riesgos" });
    }
  });

  // Payment Intent Route
  app.post("/api/create-payment-intent", async (req, res) => {
    const { amount, currency } = req.body;

    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: "Monto inválido. Debe ser un número entero positivo." });
    }

    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ error: "Stripe no configurado." });
    }
    
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // amount in cents
        currency: currency || 'mxn',
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
