import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  Terminal, 
  Layers, 
  Cloud, 
  Database,
  Cpu,
  Map as MapIcon,
  Scale,
  FileText,
  ShieldAlert,
  Workflow,
  Building2,
  Sparkles,
  ChevronRight,
  Download,
  ExternalLink,
  FileCheck,
  Lock,
  Server,
  Check,
  Filter,
  Search,
  ChevronDown,
  ArrowRight,
  Info,
  ShieldCheck,
  XCircle,
  HelpCircle,
  FileWarning
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { UniversalOrderNav } from './UniversalOrderNav';

type SubView = 'fases' | 'tramite_piloto' | 'matriz' | 'contra_auditoria' | 'dictamen';

interface FasePiloto {
  num: number;
  titulo: string;
  subtitulo: string;
  proponenteTask: string;
  ayuntamientoTask: string;
  fundamento: string;
  entregable: string;
  estado: 'listo' | 'en_proceso' | 'pendiente_institucional';
}

interface ItemMatriz {
  id: string;
  categoria: string;
  requisito: string;
  fundamento: string;
  estado: 'cumple' | 'parcial' | 'nocumple' | 'noverificable' | 'noaplica';
  evidencia: string;
  brecha: string;
  accion: string;
}

interface ModuloNivel {
  modulo: string;
  nivelActual: 1 | 2 | 3 | 4 | 5;
  explicacion: string;
  requisitoParaNivel5: string;
  responsable: string;
}

export function DeveloperChecklist({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<SubView>('contra_auditoria');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFase, setExpandedFase] = useState<number | null>(0);

  // Desglose de los 5 Niveles por Módulo Crítico
  const nivelesModulos: ModuloNivel[] = [
    {
      modulo: "Identidad Única (CURP)",
      nivelActual: 2,
      explicacion: "Nivel 2 (Demo/Sintaxis): Valida algoritmo de 18 caracteres de la CURP en frontend/backend local.",
      requisitoParaNivel5: "Requiere Convenio de Interoperabilidad con RENAPO / ATDT y token oficial de consulta en producción.",
      responsable: "Ayuntamiento de Tepic + RENAPO / ATDT"
    },
    {
      modulo: "Firma Electrónica y Sello Digital",
      nivelActual: 2,
      explicacion: "Nivel 2 (Criptografía Local): Genera Hash SHA-256 + Código QR de verificación de integridad.",
      requisitoParaNivel5: "Diferenciar Integridad Criptográfica de Autenticidad Jurídica. Requiere e.firma/FIEL de funcionario en HSM autorizado por la Ley de Firma Electrónica.",
      responsable: "Consejería Jurídica Municipal + Funcionario Facultado"
    },
    {
      modulo: "Interoperabilidad (Catastro & SIAPA)",
      nivelActual: 2,
      explicacion: "Nivel 2 (Simulación Local): Respuestas Mock JSON en Express API para prueba de concepto.",
      requisitoParaNivel5: "Requiere interconexión a servidores municipales con llaves SSL/TLS en red segura previa autorización.",
      responsable: "Dirección de Tecnologías de Información Tepic"
    },
    {
      modulo: "Expediente Electrónico Único",
      nivelActual: 2,
      explicacion: "Nivel 2 (Estructura de Datos): Registro JSON con log de timestamp e IP en base de datos.",
      requisitoParaNivel5: "Requiere dictamen del Archivo Histórico Municipal y normativa de conservación a largo plazo.",
      responsable: "Secretaría del Ayuntamiento + Archivo Municipal"
    },
    {
      modulo: "Análisis de Impacto Regulatorio (AIR)",
      nivelActual: 2,
      explicacion: "Nivel 2 (Documentación Proponente): Ficha con cálculo de ahorro de tiempo y traslados.",
      requisitoParaNivel5: "Requiere Dictamen Oficial de Exención emitido por la Comisión Municipal de Mejora Regulatoria.",
      responsable: "Comisión Municipal de Mejora Regulatoria Tepic"
    },
    {
      modulo: "Accesibilidad e Inclusión",
      nivelActual: 2,
      explicacion: "Nivel 2 (Soporte Multilingüe): Traducciones en Cora y Wixarika con síntesis de voz.",
      requisitoParaNivel5: "Requiere certificación WCAG 2.1 AA e inspección con lectores de pantalla en dispositivos móviles.",
      responsable: "Instituto Municipal de Inclusión y Pueblos Originarios"
    }
  ];

  // 20 Fases Estrictas del Plan Piloto Tepic
  const fasesPiloto: FasePiloto[] = [
    {
      num: 0,
      titulo: "Naturaleza Jurídica y Deslinde de Roles",
      subtitulo: "Establecer prototipo demostrable como Laboratorio Piloto, no como reemplazo sin autorización.",
      proponenteTask: "Desarrolla prototipo, arquitectura de referencia, UX, expediente regulatorio y propuesta técnica.",
      ayuntamientoTask: "Determina trámites a simplificar, valida requisitos, otorga competencia e infraestructura oficial.",
      fundamento: "LNETB Art. 1, 3 y 34; Lineamientos Modelo Nacional (22 Oct 2025).",
      entregable: "Documento Marco de Colaboración Tecnológica - Laboratorio Piloto Tepic.",
      estado: "listo"
    },
    {
      num: 1,
      titulo: "Selección del Trámite Piloto Flagship",
      subtitulo: "Elección de 1 trámite de alto impacto comunitario para demostración punta a punta.",
      proponenteTask: "Modelado digital de la Constancia / Carta Municipal de Residencia.",
      ayuntamientoTask: "Aprobación de la Secretaría General y Dirección de Registro Civil / Gobernación Municipal.",
      fundamento: "LNETB Art. 34 Fracc. I y II.",
      entregable: "Ficha del Trámite Piloto: Constancia Municipal de Residencia.",
      estado: "listo"
    },
    {
      num: 2,
      titulo: "Levantamiento Jurídico y Normativo",
      subtitulo: "Identificación rigurosa del fundamento de cada dato, plazo, costo y firma.",
      proponenteTask: "Estructuración de la matriz Requisito vs Fundamento en formato de datos abiertos.",
      ayuntamientoTask: "Revisión por la Consejería Jurídica Municipal y Auditoría Interna.",
      fundamento: "LNETB Art. 15 y 38; Bando de Policía y Buen Gobierno de Tepic.",
      entregable: "Expediente de Fundamentación Legal del Trámite.",
      estado: "listo"
    },
    {
      num: 3,
      titulo: "Mapeo del Proceso As-Is (Actual)",
      subtitulo: "Medición cuantitativa del trámite tradicional en ventanilla física.",
      proponenteTask: "Diagramación BPMN y cálculo de costos y tiempos de traslado del ciudadano.",
      ayuntamientoTask: "Suministro de bitácoras de ventanilla, tiempos promedios y tasa de atención actual.",
      fundamento: "Lineamientos de Simplificación Nacional Metodología As-Is.",
      entregable: "Mapa de Carga Burocrática Actual (72 hrs / 3 visitas / 4 documentos en papel).",
      estado: "listo"
    },
    {
      num: 4,
      titulo: "Reingeniería To-Be y Metas de Reducción",
      subtitulo: "Rediseño optimizado: -50% tiempo, -50% requisitos, 0 traslados físicos.",
      proponenteTask: "Flujo digital con consulta automática de datos y validación algorítmica.",
      ayuntamientoTask: "Validación de la autoridad resolutora sobre la eliminación de copias innecesarias.",
      fundamento: "LNETB Art. 34 (Principio de No Duplicidad y Eficiencia).",
      entregable: "Mapa de Proceso To-Be (10 min / 0 visitas / Validación Automática).",
      estado: "listo"
    },
    {
      num: 5,
      titulo: "Integración del Expediente Regulatorio",
      subtitulo: "Compilación de las 15 carpetas documentales de simplificación administrativa.",
      proponenteTask: "Ensamblado del Dossier Digital con arquitectura, seguridad y protección de datos.",
      ayuntamientoTask: "Revisión para dictamen de la Comisión Municipal de Mejora Regulatoria.",
      fundamento: "Lineamientos del Modelo Nacional de Simplificación Secc. III.",
      entregable: "Expediente Regulatorio Completo (Carpetas 01 a 15).",
      estado: "listo"
    },
    {
      num: 6,
      titulo: "Evaluación de Impacto Regulatorio (AIR / Exención)",
      subtitulo: "Dictamen formal para certificar la reducción neta de costos burocráticos.",
      proponenteTask: "Elaboración de la calculadora de ahorro social y cálculo de beneficio ciudadano.",
      ayuntamientoTask: "Emisión formal de Exención o Análisis de Impacto Regulatorio por el Titular.",
      fundamento: "LNETB Art. 35, 36 y 38.",
      entregable: "Dictamen AIR / Formulario de Exención por Simplificación Neta.",
      estado: "en_proceso"
    },
    {
      num: 7,
      titulo: "Estrategia de Identidad Digital e Interoperabilidad",
      subtitulo: "Uso de CURP con algoritmo sintáctico en prototipo y conexión oficial en producción.",
      proponenteTask: "Sintaxis CURP y tokenización local para la prueba de concepto.",
      ayuntamientoTask: "Gestión del convenio institucional con RENAPO / ATDT / Gobierno del Estado.",
      fundamento: "LNETB Art. 24 (Uso de CURP como llave única de registro nacional).",
      entregable: "Módulo de Validación de Identidad y Plan de Integración RENAPO.",
      estado: "listo"
    },
    {
      num: 8,
      titulo: "Arquitectura de Interoperabilidad Municipal",
      subtitulo: "Conexión en tiempo real con Catastro, SIAPA, Registro Civil y Tesorería Tepic.",
      proponenteTask: "REST APIs / GraphQL Gateway y conectores para fuentes de datos municipales.",
      ayuntamientoTask: "Apertura de llaves de acceso en la red municipal segura.",
      fundamento: "Lineamientos de Interoperabilidad y Fuente Única de Verdad.",
      entregable: "Nodo de Interoperabilidad Transparente Nayarit Digital.",
      estado: "listo"
    },
    {
      num: 9,
      titulo: "Mecanismo Jurídico de Firma y Resolución",
      subtitulo: "Generación de PDF oficial con Sello Digital, Hash SHA-256 y Código QR de verificación.",
      proponenteTask: "Motor de firmado digital, hashing de documentos y repositorio público de verificación.",
      ayuntamientoTask: "Asignación del certificado FIEL / e.firma del funcionario autorizado.",
      fundamento: "Ley de Firma Electrónica Avanzada y LNETB Art. 34 Fracc. IV.",
      entregable: "Resolución Digital Auténtica Verificable vía QR PÚBLICO.",
      estado: "listo"
    },
    {
      num: 10,
      titulo: "Expediente Digital e Trazabilidad Inmutable",
      subtitulo: "Construcción del expediente único ciudadano con bitácora de auditoría detallada.",
      proponenteTask: "Estructura JSON de expediente con metadatos, versiones y log de eventos por IP/Timestamp.",
      ayuntamientoTask: "Definición de plazos de conservación y archivo histórico municipal.",
      fundamento: "LNETB Art. 34 Fracc. VI (Expediente Electrónico Único).",
      entregable: "Visor de Expediente Digital y Audit Log de Eventos.",
      estado: "listo"
    },
    {
      num: 11,
      titulo: "Protección de Datos Personales y Privacidad",
      subtitulo: "Cumplimiento estricto con la LGPDPPSO y minimización de datos.",
      proponenteTask: "Implementación de Aviso de Privacidad Integral e Interfaz de Derechos ARCO.",
      ayuntamientoTask: "Registro del sistema de tratamiento de datos ante el ITAINAY.",
      fundamento: "Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados.",
      entregable: "Aviso de Privacidad Aprobado y Módulo ARCO.",
      estado: "listo"
    },
    {
      num: 12,
      titulo: "Auditoría de Ciberseguridad y Resiliencia",
      subtitulo: "Verificación OWASP Top 10, cifrado AES-256 en reposo y TLS 1.3 en tránsito.",
      proponenteTask: "Pruebas de penetración, sanetización de inputs y gestión de secretos en Google Cloud.",
      ayuntamientoTask: "Revisión del área de Sistemas e Informática de Tepic.",
      fundamento: "Esquema Nacional de Seguridad y Estándares ISO 27001.",
      entregable: "Reporte de Cero Vulnerabilidades Críticas.",
      estado: "listo"
    },
    {
      num: 13,
      titulo: "Accesibilidad Universal y Multilingüismo",
      subtitulo: "Atención incluyente en Lenguas Originarias (Cora/Wixarika) y contraste WCAG 2.1 AA.",
      proponenteTask: "Interfaces con soporte para lector de pantalla, síntesis de voz Aura e inclusión indígena.",
      ayuntamientoTask: "Validación por el Instituto Municipal de Inclusión y Pueblos Originarios.",
      fundamento: "LNETB Art. 34 Fracc. VII y Constitución Política de los Estados Unidos Mexicanos Art. 2.",
      entregable: "Orbe Central Multilingüe y Certificación WCAG.",
      estado: "listo"
    },
    {
      num: 14,
      titulo: "Plan de Contingencia y Continuidad Operativa",
      subtitulo: "Operación resiliente ante fallas de conectividad o cortes eléctricos.",
      proponenteTask: "Modo Offline en app ciudadana, cola de sincronización local y folios de respaldo.",
      ayuntamientoTask: "Protocolo de recepción analógica en ventanilla asistida con captura posterior.",
      fundamento: "Lineamientos de Continuidad Operativa Gubernamental.",
      entregable: "Protocolo de Contingencia y Sincronización Automática.",
      estado: "listo"
    },
    {
      num: 15,
      titulo: "Sistema de Indicadores y Medición Regulatoria",
      subtitulo: "Panel de métricas en tiempo real con línea base vs desempeño piloto.",
      proponenteTask: "Dashboard C5 con cálculo automático de horas ahorradas, reducción de papel y satisfacción.",
      ayuntamientoTask: "Validación de los indicadores por la Contraloría Municipal.",
      fundamento: "LNETB Art. 38 Fracc. V.",
      entregable: "Módulo de Métricas e Indicadores C5 Tepic.",
      estado: "listo"
    },
    {
      num: 16,
      titulo: "Despliegue de Piloto Controlado (Sandbox)",
      subtitulo: "Ejecución en ambiente seguro con datos sintéticos y grupo focal de ciudadanos.",
      proponenteTask: "Puesta en marcha del entorno de sandbox con monitoreo de errores en vivo.",
      ayuntamientoTask: "Coordinación de pruebas con funcionarios de ventanilla seleccionados.",
      fundamento: "Metodología de Laboratorios de Innovación Pública.",
      entregable: "Informe de Resultados de Prueba Piloto Sandbox.",
      estado: "en_proceso"
    },
    {
      num: 17,
      titulo: "Presentación Institucional al Cabildo de Tepic",
      subtitulo: "Presentación formal del prototipo, expediente y dictamen ante el Ayuntamiento.",
      proponenteTask: "Suministro del Deck Ejecutivo, Demostración en Vivo y Carpeta Presidencial.",
      ayuntamientoTask: "Inclusión en orden del día de sesión de Cabildo para adopción oficial.",
      fundamento: "Ley Municipal para el Estado de Nayarit.",
      entregable: "Punto de Acuerdo para Adopción Institucional.",
      estado: "pendiente_institucional"
    },
    {
      num: 18,
      titulo: "Transferencia Tecnológica y Operativa",
      subtitulo: "El Ayuntamiento asume el control absoluto del sistema y sus llaves de cifrado.",
      proponenteTask: "Entrega de código fuente, repositorios, llaves maestras y manuales de administración.",
      ayuntamientoTask: "Recepción formal por la Dirección de Tecnologías de Información.",
      fundamento: "LNETB Neutralidad Tecnológica y Soberanía de Datos.",
      entregable: "Acta de Entrega-Recepción Tecnológica y Capacitación a Personal.",
      estado: "pendiente_institucional"
    },
    {
      num: 19,
      titulo: "Evaluación a 30, 60 y 90 Días y Escalamiento",
      subtitulo: "Medición de resultados y réplica del modelo en trámites de Licencias y Predial.",
      proponenteTask: "Soporte técnico de segundo nivel y optimización continua de algoritmos.",
      ayuntamientoTask: "Emisión del Informe Anual de Simplificación Municipal.",
      fundamento: "LNETB Agenda de Simplificación Anual.",
      entregable: "Dictamen de Impacto Social Tepic 2026.",
      estado: "pendiente_institucional"
    },
    {
      num: 20,
      titulo: "Certificación Interna del Piloto",
      subtitulo: "Emisión del Dictamen Final firmado por Jurídico, Administración y Tecnologías.",
      proponenteTask: "Compilación final de evidencias digitales en el repositorio inmutable.",
      ayuntamientoTask: "Firma formal de certificación y publicación en la Gaceta Municipal.",
      fundamento: "LNETB Art. 34 y Lineamientos del Modelo Nacional.",
      entregable: "Dictamen de Preparación para Puesta en Producción Institucional.",
      estado: "pendiente_institucional"
    }
  ];

  // Matriz de Auditoría Adversarial LNETB
  const matrizAudit: ItemMatriz[] = [
    {
      id: "LNETB-01",
      categoria: "Naturaleza y Competencia",
      requisito: "El trámite debe tener fundamento legal expreso y autoridad competente identificada.",
      fundamento: "LNETB Art. 15; Bando de Policía Tepic",
      estado: "cumple",
      evidencia: "La Constancia de Residencia está fundamentada en el Bando Orgánico Municipal de Tepic. El prototipo está deslindado como Laboratorio Piloto.",
      brecha: "En producción requiere acuerdo formal del Cabildo.",
      accion: "Emitir Acuerdo de Cabildo para institucionalización."
    },
    {
      id: "LNETB-02",
      categoria: "No Duplicidad de Información",
      requisito: "Prohibición estricta de solicitar documentos o datos que la autoridad ya posea o pueda obtener vía interoperabilidad.",
      fundamento: "LNETB Art. 34 Fracc. III",
      estado: "cumple",
      evidencia: "Cero solicitudes de copia de credencial o comprobante impreso si existe coincidencia en Catastro/SIAPA Tepic.",
      brecha: "Sustituir simulación de datos locales por conectores API oficiales en la red municipal.",
      accion: "Firmar convenio de interoperabilidad con Registro Civil y SIAPA."
    },
    {
      id: "LNETB-03",
      categoria: "Digitalización Punta a Punta",
      requisito: "El trámite debe iniciar, procesar, firmarse y resolverse 100% en línea sin presencia física obligatoria.",
      fundamento: "LNETB Art. 34 Fracc. IV",
      estado: "cumple",
      evidencia: "El flujo permite solicitar desde RUTA app/web, procesarse en C5, firmarse digitalmente y descargarse con código QR.",
      brecha: "Mecanismo de firma requiere e.firma de funcionario público asignado.",
      accion: "Cargar certificado digital FIEL en el HSM / Vault de la dependencia."
    },
    {
      id: "LNETB-04",
      categoria: "Identidad Única (CURP)",
      requisito: "Uso de la CURP como identificador central único de los registros del modelo.",
      fundamento: "LNETB Art. 24",
      estado: "cumple",
      evidencia: "Validación algorítmica de sintaxis CURP integrada en el perfil de RUTA.",
      brecha: "Validación en sandbox contra RENAPO requiere token oficial suministrado por la ATDT/Estado.",
      accion: "Conectar endpoint oficial RENAPO al habilitar el entorno municipal."
    },
    {
      id: "LNETB-05",
      categoria: "Expediente Electrónico Único",
      requisito: "Conservación de documentos y actuaciones en expediente digital reutilizable con bitácora inmutable.",
      fundamento: "LNETB Art. 34 Fracc. VI",
      estado: "cumple",
      evidencia: "Expediente JSON con log de auditoría conteniendo timestamp, IP, operador y hash SHA-256.",
      brecha: "Integrar almacenamiento seguro persistente con retención a largo plazo.",
      accion: "Conectar Firestore / Google Cloud Storage con política de inmutabilidad."
    },
    {
      id: "LNETB-06",
      categoria: "Neutralidad Tecnológica",
      requisito: "Independencia de proveedores propietarios; uso de estándares abiertos y portabilidad de datos.",
      fundamento: "LNETB Art. 34 Fracc. V",
      estado: "cumple",
      evidencia: "Arquitectura basada en React, Node.js, REST JSON, PostgreSQL/Drizzle y exportación abierta.",
      brecha: "Ninguna. Totalmente portable y sin amarra a licencias propietarias.",
      accion: "Mantener estándares abiertos OpenAPI 3.0."
    },
    {
      id: "LNETB-07",
      categoria: "Accesibilidad e Inclusión",
      requisito: "Atención multilingüe en lenguas originarias y cumplimiento de normas de accesibilidad para personas con discapacidad.",
      fundamento: "LNETB Art. 34 Fracc. VII; CPEUM Art. 2",
      estado: "cumple",
      evidencia: "Orbe Central IA capacitado en Cora, Wixarika y Español, con síntesis de voz y modo alto contraste.",
      brecha: "Comprobar lectores de pantalla en dispositivos móviles de gama baja.",
      accion: "Ejecutar auditoría de accesibilidad Lighthouse / WCAG 2.1."
    },
    {
      id: "LNETB-08",
      categoria: "Análisis de Impacto Regulatorio (AIR)",
      requisito: "Evaluación ex-ante de costos y beneficios o dictamen formal de exención por simplificación neta.",
      fundamento: "LNETB Art. 35, 36 y 38",
      estado: "parcial",
      evidencia: "Formulario de justificación de reducción de cargas listo en el Expediente Regulatorio.",
      brecha: "El dictamen formal debe ser emitido por la autoridad reguladora municipal.",
      accion: "Someter la ficha de simplificación ante la Comisión Municipal de Mejora Regulatoria."
    }
  ];

  const filteredMatriz = matrizAudit.filter(item => 
    item.requisito.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.fundamento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-300 font-sans selection:bg-cyan-500/30 flex flex-col">
      
      {/* Universal Navigation Bar */}
      <UniversalOrderNav
        currentView="dev"
        currentSubItem="Plan Estricto LNETB & Audit"
        onNavigate={(view) => {
          if (view === 'landing') onLogout();
          else if (typeof window !== 'undefined') {
            window.location.href = `?view=${view}`;
          }
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <header className="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-10 bottom-0 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Scale size={14} />
                  Marco LNETB 2025-2026
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-widest">
                  Piloto Ayuntamiento de Tepic
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                  <ShieldAlert size={14} />
                  Contra-Auditoría Activa
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Laboratorio de Simplificación & Contra-Auditoría LNETB
              </h1>
              <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
                Evaluación institucional sin complacencia. Deslinde estricto en <strong className="text-cyan-300">5 Niveles de Cumplimiento</strong> (Código -&gt; Demo -&gt; Integración -&gt; Autorización -&gt; Fundamento Jurídico) para garantizar que el prototipo pueda evolucionar formalmente a Piloto Municipal en Tepic.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="https://github.com/Autosociomx/Gobernanza-digital-.git"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-white transition text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Terminal size={14} />
                Repositorio GitHub
              </a>
              <button 
                onClick={onLogout}
                className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Volver a la Portada
              </button>
            </div>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">Meta de Reducción</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">-50% Carga Burocrática</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Requisitos y Tiempos Tepic</div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">Trámite Flagship</div>
              <div className="text-xl font-black text-amber-400 mt-1">Constancia de Residencia</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Demostración Punta a Punta</div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">Nivel de Madurez Actual</div>
              <div className="text-xl font-black text-cyan-400 mt-1">Nivel 2 / 5 (Demo Operativo)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Listo para Acuerdo de Cabildo</div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">Fases del Plan</div>
              <div className="text-2xl font-black text-purple-400 mt-1">20 Fases</div>
              <div className="text-[11px] text-slate-400 mt-0.5">De Prototipo a Producción</div>
            </div>
          </div>
        </header>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('contra_auditoria')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
              activeTab === 'contra_auditoria' 
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <ShieldAlert size={16} />
            <span>1. Contra-Auditoría (5 Niveles)</span>
          </button>

          <button
            onClick={() => setActiveTab('fases')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
              activeTab === 'fases' 
                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Workflow size={16} />
            <span>2. Plan Estricto (20 Fases Tepic)</span>
          </button>

          <button
            onClick={() => setActiveTab('tramite_piloto')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
              activeTab === 'tramite_piloto' 
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <FileText size={16} />
            <span>3. Trámite Piloto: Residencia</span>
          </button>

          <button
            onClick={() => setActiveTab('matriz')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
              activeTab === 'matriz' 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <FileCheck size={16} />
            <span>4. Matriz LNETB Artículo x Artículo</span>
          </button>

          <button
            onClick={() => setActiveTab('dictamen')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
              activeTab === 'dictamen' 
                ? 'bg-purple-500/15 text-purple-400 border-purple-500/40 shadow-sm' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck size={16} />
            <span>5. Checklist GO / NO-GO & Listas Finales</span>
          </button>
        </div>

        {/* TAB 1: CONTRA-AUDITORÍA JURÍDICO-TÉCNICA & DESGLOSE EN 5 NIVELES */}
        {activeTab === 'contra_auditoria' && (
          <div className="space-y-6">
            
            {/* Elimination Notice */}
            <div className="bg-rose-950/20 border border-rose-500/40 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm uppercase">
                <ShieldAlert size={18} />
                Rectificación del Dictamen Anterior (Aviso de Rigor Metodológico)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Se elimina la cifra del "92.5% de cumplimiento"</strong>. Presentar un porcentaje global en un prototipo de software sin convenios ni autorizaciones publicadas induce a error. En su lugar, el proyecto se evalúa objetivamente mediante la <strong>Escala de 5 Niveles de Cumplimiento Institucional</strong>.
              </p>
            </div>

            {/* Explanation of the 5 Levels */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Scale size={18} className="text-cyan-400" />
                Escala Jerárquica de 5 Niveles de Validez
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-bold">NIVEL 1</div>
                  <div className="text-white font-semibold mt-1">Existe Código</div>
                  <p className="text-[10px] text-slate-500 mt-1">Archivos .ts/.tsx en el repositorio.</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-cyan-800/40">
                  <div className="text-cyan-400 font-bold">NIVEL 2</div>
                  <div className="text-white font-semibold mt-1">Demo / Simulación</div>
                  <p className="text-[10px] text-cyan-300/80 mt-1">Estado actual del prototipo interactivo.</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-amber-800/40">
                  <div className="text-amber-400 font-bold">NIVEL 3</div>
                  <div className="text-white font-semibold mt-1">Integración Real</div>
                  <p className="text-[10px] text-amber-300/80 mt-1">APIs conectadas con RENAPO/Catastro.</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-purple-800/40">
                  <div className="text-purple-400 font-bold">NIVEL 4</div>
                  <div className="text-white font-semibold mt-1">Autorización Oficial</div>
                  <p className="text-[10px] text-purple-300/80 mt-1">Acuerdo de Cabildo Tepic publicado.</p>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-800/40">
                  <div className="text-emerald-400 font-bold">NIVEL 5</div>
                  <div className="text-white font-semibold mt-1">Fundamento Jurídico</div>
                  <p className="text-[10px] text-emerald-300/80 mt-1">Efecto legal pleno y vinculante.</p>
                </div>
              </div>
            </div>

            {/* Matrix of 5 Levels per Module */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <Layers size={16} className="text-amber-400" />
                  Diagnóstico por Módulo — Brecha para Alcanzar Nivel 5
                </h3>
              </div>

              <div className="divide-y divide-slate-800/80 text-xs">
                {nivelesModulos.map((m, idx) => (
                  <div key={idx} className="p-5 hover:bg-slate-900/40 transition space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="font-bold text-white text-sm">{m.modulo}</div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold text-[10px]">
                          Estado Actual: NIVEL {m.nivelActual} (Demo Operativo)
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-[10px]">
                          Meta Producción: NIVEL 5
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/60">
                      <div>
                        <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Demostrado en Código (Nivel 2):</div>
                        <p className="text-slate-300 mt-1 leading-relaxed">{m.explicacion}</p>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">Requisito Indispensable para Nivel 5:</div>
                        <p className="text-slate-300 mt-1 leading-relaxed">{m.requisitoParaNivel5}</p>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                      <Building2 size={12} className="text-slate-500" />
                      <span><strong>Sujeto Obligado / Responsable:</strong> {m.responsable}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Adversarial Attack: 3 Crucial Technical-Legal Clarifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="text-amber-400 font-mono font-bold text-xs uppercase flex items-center gap-1.5">
                  <Lock size={14} />
                  1. Firma Digital vs SHA-256
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  El sistema genera un <strong>Hash SHA-256 + QR</strong>. Esto demuestra <em>Integridad Criptográfica</em> (que el documento no cambió), pero NO constituye <em>Autenticidad Jurídica</em> ni <em>e.firma</em> hasta que un funcionario facultado aplique su certificado FIEL.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="text-cyan-400 font-mono font-bold text-xs uppercase flex items-center gap-1.5">
                  <Server size={14} />
                  2. API Express vs Interoperabilidad
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tener un backend Express en Node.js con datos de prueba es Nivel 2. La <strong>Interoperabilidad Institucional</strong> exige convenios entre dependencias, catálogo de datos compartidos y llaves de cifrado mutuo en servidores de Tepic.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="text-purple-400 font-mono font-bold text-xs uppercase flex items-center gap-1.5">
                  <FileText size={14} />
                  3. JSON vs Expediente Archivero
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  La estructura de datos JSON con bitácora es Nivel 2. Para ser un <strong>Expediente Electrónico Oficial</strong> debe cumplir con la Ley General de Archivos y contar con la custodia del Archivo Histórico Municipal de Tepic.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: 20 FASES DE LA ESTRATEGIA PILOTO TEPIC */}
        {activeTab === 'fases' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Workflow size={20} className="text-cyan-400" />
                Plan Estricto de Cumplimiento — Laboratorio Piloto Tepic (20 Fases)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Hoja de ruta institucional deslindando claramente las responsabilidades del <strong className="text-cyan-300">Proponente Tecnológico</strong> frente a las atribuciones exclusivas del <strong className="text-amber-300">Ayuntamiento de Tepic</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fasesPiloto.map((fase) => {
                const isExpanded = expandedFase === fase.num;
                return (
                  <div 
                    key={fase.num}
                    className={`bg-slate-950 border rounded-2xl p-5 transition-all ${
                      isExpanded ? 'border-cyan-500/50 ring-1 ring-cyan-500/20 shadow-xl' : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 font-mono font-black text-xs text-cyan-400 flex items-center justify-center shrink-0">
                          {fase.num < 10 ? `0${fase.num}` : fase.num}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{fase.titulo}</h3>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{fase.subtitulo}</p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                        fase.estado === 'listo' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : fase.estado === 'en_proceso'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                      }`}>
                        {fase.estado === 'listo' ? 'Prototipo Listo' : fase.estado === 'en_proceso' ? 'En Ejecución' : 'Institucional'}
                      </span>
                    </div>

                    {/* Expandable Details */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                        <div>
                          <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Proponente Tecnológico:</div>
                          <p className="text-slate-300 mt-0.5 leading-relaxed">{fase.proponenteTask}</p>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">Ayuntamiento de Tepic:</div>
                          <p className="text-slate-300 mt-0.5 leading-relaxed">{fase.ayuntamientoTask}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                        <span className="text-slate-400">
                          <strong>Fundamento:</strong> {fase.fundamento}
                        </span>
                        <span className="text-cyan-300 font-semibold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                          Entregable: {fase.entregable}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TRÁMITE PILOTO FLAGSHIP (CONSTANCIA DE RESIDENCIA) */}
        {activeTab === 'tramite_piloto' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText size={20} className="text-amber-400" />
                Trámite Piloto Flagship: Constancia Municipal de Residencia (Tepic)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Demostración de reingeniería administrativa punta a punta para servir como modelo reproducible a otros trámites municipales.
              </p>
            </div>

            {/* Comparison Grid: As-Is vs To-Be */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* As-Is */}
              <div className="bg-slate-950 border border-rose-500/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase">
                    Proceso Actual (As-Is tradicional)
                  </span>
                  <span className="text-xs font-mono text-slate-400">Alta Carga Burocrática</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span><strong>Traslados:</strong> 2 a 3 visitas presenciales a la Presidencia Municipal o Módulo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span><strong>Documentación:</strong> Copias fotostáticas de INE, comprobante de domicilio, acta de nacimiento y fotos infantiles.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span><strong>Tiempos:</strong> De 48 a 72 horas hábiles para dictamen y firma autógrafa.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span><strong>Costo Ciudadano:</strong> Tiempo de espera, pasajes/gasolina y cobro de derechos en caja física.</span>
                  </li>
                </ul>

                <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl text-rose-300 text-[11px] font-mono">
                  Sujeto a filas, duplicidad de datos recopilados e inspección manual redundante.
                </div>
              </div>

              {/* To-Be (Laboratorio Tepic) */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase">
                    Proceso Laboratorio Tepic (To-Be Digital)
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">100% Simplificado</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Traslados:</strong> 0 visitas físicas. Solicitud desde app RUTA o portal web.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Documentación:</strong> Cero fotocopias. Autocomprobación vía padrón Catastro/SIAPA Tepic.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tiempos:</strong> Emisión digital e inmediata (menor a 10 minutos con Sello Digital).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Resolución:</strong> Documento PDF firmado digitalmente con Código QR verificable en la red municipal.</span>
                  </li>
                </ul>

                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-emerald-300 text-[11px] font-mono">
                  Cumple con el Principio de No Duplicidad y Expediente Único de la LNETB.
                </div>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Workflow size={16} className="text-cyan-400" />
                Arquitectura de Referencia del Trámite Piloto
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">1. Solicitud</div>
                  <div className="text-[10px] text-slate-400">CURP + Validación de Identidad</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-amber-400 font-bold mb-1">2. Consulta</div>
                  <div className="text-[10px] text-slate-400">Nodo Interoperable Catastro/SIAPA</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-purple-400 font-bold mb-1">3. Regla Negocio</div>
                  <div className="text-[10px] text-slate-400">Verificación de Padrón y Domicilio</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">4. Firma Digital</div>
                  <div className="text-[10px] text-slate-400">FIEL Funcionario + Sello SHA-256</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-blue-400 font-bold mb-1">5. Resolución</div>
                  <div className="text-[10px] text-slate-400">PDF + QR Público Verificable</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MATRIZ DE AUDITORÍA ADVERSARIAL LNETB */}
        {activeTab === 'matriz' && (
          <div className="space-y-6">
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileCheck size={20} className="text-emerald-400" />
                  Matriz LNETB Artículo por Artículo (Evaluación Objetiva)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluación rigurosa punto por punto sin asumir cumplimiento donde no existan evidencias probatorias.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Buscar requisito o artículo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">ID & Categoría</th>
                      <th className="p-4">Exigencia Legal & Fundamento</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Evidencia en Prototipo</th>
                      <th className="p-4">Acción Correctiva</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {filteredMatriz.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-4 font-mono">
                          <div className="font-bold text-cyan-400">{item.id}</div>
                          <div className="text-[10px] text-slate-500">{item.categoria}</div>
                        </td>

                        <td className="p-4 max-w-xs">
                          <div className="font-semibold text-white">{item.requisito}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-1">{item.fundamento}</div>
                        </td>

                        <td className="p-4 shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            item.estado === 'cumple'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : item.estado === 'parcial'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}>
                            {item.estado === 'cumple' ? '🟢 Cumple' : item.estado === 'parcial' ? '🟡 Parcial' : '🔴 No Cumple'}
                          </span>
                        </td>

                        <td className="p-4 max-w-xs text-slate-400 text-[11px] leading-relaxed">
                          {item.evidencia}
                        </td>

                        <td className="p-4 max-w-xs text-cyan-300 text-[11px] font-mono">
                          {item.accion}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CHECKLIST GO / NO-GO & 4 LISTAS FINALES */}
        {activeTab === 'dictamen' && (
          <div className="space-y-8">
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-400" />
                Checklist GO / NO-GO & Las 4 Listas Finales de Acción
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Estructura operativa clara para determinar exactamente qué puede ejecutarse de inmediato y qué requiere autorización del Ayuntamiento de Tepic.
              </p>
            </div>

            {/* 4 Actionable Final Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 🟢 PUEDE HACERSE AHORA */}
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm uppercase">
                  <CheckCircle2 size={18} />
                  1. 🟢 PUEDE HACERSE AHORA (Proponente Tecnológico)
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Desarrollar prototipos de interfaz (UI/UX) e interacción accesible.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Mapear procesos BPMN As-Is vs To-Be y calcular reducciones teoricas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Diseñar arquitecturas REST/OpenAPI y esquemas de bases de datos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Implementar algoritmos sintácticos de validación (CURP, RFC).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Estructurar la documentación de las 15 carpetas del Expediente Regulatorio.</span>
                  </li>
                </ul>
              </div>

              {/* 🟡 REQUIERE VALIDACIÓN */}
              <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm uppercase">
                  <AlertCircle size={18} />
                  2. 🟡 REQUIERE VALIDACIÓN (Mesa Técnica)
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Validar la ficha de requisitos del trámite con los operadores de ventanilla.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Someter la justificación de exención AIR ante la Secretaría Técnica de Mejora Regulatoria.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Probar la compatibilidad de lectores de pantalla WCAG 2.1 AA en dispositivos de gama baja.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>Verificar el Aviso de Privacidad con la Consejería Jurídica.</span>
                  </li>
                </ul>
              </div>

              {/* 🟠 REQUIERE AUTORIZACIÓN INSTITUCIONAL */}
              <div className="bg-slate-950 border border-purple-500/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-sm uppercase">
                  <Building2 size={18} />
                  3. 🟠 REQUIERE AUTORIZACIÓN INSTITUCIONAL (Ayuntamiento Tepic)
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>Aprobación del Punto de Acuerdo en Cabildo para formalizar el Laboratorio Piloto.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>Firma de Convenio con RENAPO / ATDT para consumo de API oficial de CURP.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>Carga del certificado e.firma / FIEL del funcionario autorizado en Vault/HSM.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>Autorización de apertura de endpoints seguros en la red de Catastro y SIAPA.</span>
                  </li>
                </ul>
              </div>

              {/* 🔴 NO DEBE HACERSE TODAVÍA */}
              <div className="bg-slate-950 border border-rose-500/40 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm uppercase">
                  <XCircle size={18} />
                  4. 🔴 NO DEBE HACERSE TODAVÍA (Bloqueador Absoluto)
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>NO capturar datos personales reales de ciudadanos sin aviso de privacidad ITAINAY publicado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>NO procesar ni recaudar dinero o cobros de derechos sin cuenta de Tesorería autorizada.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>NO emitir resoluciones finales con validez jurídica sin e.firma oficial asignada.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>NO declarar públicamente que el sistema es un "Servicio Oficial Producción" sin bando publicado.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Checklist GO / NO-GO Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <FileWarning size={16} className="text-amber-400" />
                Matriz GO / NO-GO para Transición de Sandbox a Piloto Institucional
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>1. Deslinde de Prototipo a Laboratorio</span>
                  <span className="text-emerald-400 font-bold">GO 🟢</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>2. Mapeo BPMN y Ficha To-Be</span>
                  <span className="text-emerald-400 font-bold">GO 🟢</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>3. Sintaxis CURP Algorítmica</span>
                  <span className="text-emerald-400 font-bold">GO 🟢</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>4. Convenio RENAPO / ATDT</span>
                  <span className="text-amber-400 font-bold">PENDIENTE 🟡</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>5. Carga e.firma FIEL en HSM</span>
                  <span className="text-amber-400 font-bold">PENDIENTE 🟡</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span>6. Punto de Acuerdo en Cabildo Tepic</span>
                  <span className="text-purple-400 font-bold">INSTITUCIONAL 🟠</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Persistent Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs font-mono text-slate-500">
        Nayarit Digital — Laboratorio Piloto Tepic — Cumplimiento Ley Nacional para Eliminar Trámites Burocráticos 2025-2026
      </footer>

    </div>
  );
}

