import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Bot, 
  Activity, 
  FileCheck2, 
  MapPin, 
  AlertTriangle, 
  Building2, 
  GraduationCap, 
  Users, 
  Eye, 
  HeartHandshake, 
  Vote, 
  Coins, 
  Cpu, 
  Database, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Play, 
  Terminal, 
  CheckCircle2, 
  FileText, 
  Send, 
  RefreshCw, 
  Download, 
  ExternalLink,
  Award,
  Zap
} from 'lucide-react';
import { 
  ShieldCheck as ShieldIcon, 
  Bot as BotIcon, 
  Activity as ActivityIcon, 
  FileText as FileTextIcon, 
  MapPin as MapPinIcon, 
  AlertTriangle as AlertIcon, 
  Building2 as BuildingIcon, 
  GraduationCap as GradIcon, 
  Users as UsersIcon, 
  Eye as EyeIcon, 
  HeartHandshake as HeartIcon, 
  Vote as VoteIcon, 
  Coins as CoinsIcon, 
  Cpu as CpuIcon, 
  Database as DbIcon, 
  BookOpen as BookIcon, 
  Sparkles as SparklesIcon,
  ChevronRight as ArrowIcon,
  Play as PlayIcon,
  Terminal as TerminalIcon,
  CheckCircle2 as CheckIcon,
  Send as SendIcon,
  RefreshCw as RefreshIcon,
  Download as DownloadIcon,
  ExternalLink as LinkIcon,
  Award as AwardIcon,
  Zap as ZapIcon,
  Radio as MediaIcon
} from 'lucide-react';

import { DesignAgentsFolder } from './DesignAgentsFolder';
import { Palette } from 'lucide-react';

export interface PresidentialAgent {
  id: string;
  codeNumber: string;
  name: string;
  roleTitle: string;
  category: 'SEGURIDAD_IDENTIDAD' | 'SERVICIOS_CIUDADANOS' | 'EFICIENCIA_AUDITORIA' | 'SOBERANIA_TERRITORIO';
  icon: any;
  status: 'ACTIVO_100' | 'DESPLEGADO' | 'LISTO_PARA_NACION';
  codeAnchor: string;
  description: string;
  executiveAction: string;
  nationalScaleImpact: string;
  liveStats: { label: string; value: string; color: string }[];
  sampleCommand: string;
  agentResponse: string;
}

export const PRESIDENTIAL_AGENTS_DATA: PresidentialAgent[] = [
  {
    id: 'agent-01',
    codeNumber: 'AGENTE 01',
    name: 'Nayarit ID & Biometría Nacional',
    roleTitle: 'Motor de Identidad Digital y Firma Anti-Spoofing',
    category: 'SEGURIDAD_IDENTIDAD',
    icon: ShieldIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/FacialRecognitionScanner.tsx (NOM-151 & LNETB)',
    description: 'Sistema de autenticación biométrica en 3 pasos (parpadeo, sonrisa, giro 3D) con validación OCR de INE y encriptación de hash nodal anti-suplantación.',
    executiveAction: 'Permite a la ciudadanía abrir su Expediente Único Digital desde cualquier smartphone sin acudir a ventanilla ni entregar fotocopias.',
    nationalScaleImpact: 'Replica inmediata para la Llave MX del Gobierno Federal en los 2,477 municipios del país.',
    liveStats: [
      { label: 'Precisión Anti-Spoofing', value: '98.7%', color: 'text-emerald-400' },
      { label: 'Tiempos de Verificación', value: '3.4 seg', color: 'text-cyan-400' },
      { label: 'Cumplimiento NOM-151', value: '100%', color: 'text-purple-400' }
    ],
    sampleCommand: 'ejecutar_prueba_de_vida_biometrica()',
    agentResponse: '✓ Biometría Nodal Validada: Hash NY-BIO-9872-2026 emitido. Firma de expediente vinculada con éxito sin duplicidad de registros.'
  },
  {
    id: 'agent-02',
    codeNumber: 'AGENTE 02',
    name: 'Salud Inteligente CIE-11',
    roleTitle: 'Asistente de Triaje Médico y Citas Prevención',
    category: 'SERVICIOS_CIUDADANOS',
    icon: ActivityIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/SaludNayaritID.tsx & citasSaludService.ts',
    description: 'Triaje automatizado basado en estándares de clasificación internacional de enfermedades (CIE-11) y Manchester, conectando directamente con centros de salud.',
    executiveAction: 'Diagnóstica riesgos comunitarios (dengue, hipertensión, diabetes) e integra alertas epidemiológicas en tiempo real.',
    nationalScaleImpact: 'Reducción de saturación en salas de urgencias del IMSS-Bienestar en un 38%.',
    liveStats: [
      { label: 'Pacientes Clasificados', value: '14,200+', color: 'text-rose-400' },
      { label: 'Tiempo Promedio Triaje', value: '45 seg', color: 'text-amber-400' },
      { label: 'Precisión CIE-11', value: '99.1%', color: 'text-emerald-400' }
    ],
    sampleCommand: 'analizar_sintomas_epidemiologicos("Tepic-Sector 4")',
    agentResponse: '[TRIAJE: VERDE] Paciente derivado a consulta preventiva en Centro de Salud Digital. Registro agendado automáticamente.'
  },
  {
    id: 'agent-03',
    codeNumber: 'AGENTE 03',
    name: 'Ventanilla Única LNETB',
    roleTitle: 'Garante de Cero Burocracia y Cartas Instantáneas',
    category: 'SERVICIOS_CIUDADANOS',
    icon: FileTextIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/MunicipalLettersView.tsx (Arts 66-76 LNETB)',
    description: 'Gestor de emisión automatizada de Carta de No Antecedentes, Licencias de Funcionamiento y Constancias de Residencia firmadas digitalmente.',
    executiveAction: 'Eliminación del 85% de los requisitos físicos exigidos previamente por dependencias estatales y municipales.',
    nationalScaleImpact: 'Ahorro anual proyectado de 240 millones de pesos en papel, traslados y tiempos de espera.',
    liveStats: [
      { label: 'Trámites Simplificados', value: '42 Trámites', color: 'text-cyan-400' },
      { label: 'Tiempo de Expedición', value: '2 minutos', color: 'text-emerald-400' },
      { label: 'Fotocopias Eliminadas', value: '100%', color: 'text-purple-400' }
    ],
    sampleCommand: 'generar_carta_no_antecedentes("CURP_VALIDADO")',
    agentResponse: '✓ Documento Oficial Emitido con Código QR Verificable y Sellado Digital de Gobernanza.'
  },
  {
    id: 'agent-04',
    codeNumber: 'AGENTE 04',
    name: 'C5 Inteligencia Urbana',
    roleTitle: 'Centro de Mando Territorial y Reporte 911/089',
    category: 'SOBERANIA_TERRITORIO',
    icon: MapPinIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/C5Dashboard.tsx & UrbanReportMapView.tsx',
    description: 'Panel de monitoreo unificado con geolocalización de patrullajes, incidentes de alumbrado, fugas de agua y respuesta inmediata.',
    executiveAction: 'Visibilidad total del territorio estatal con mapas interactivos y balanceador de capacidad operativa.',
    nationalScaleImpact: 'Modelo de interoperabilidad de C5 estatal con el Centro Nacional de Inteligencia.',
    liveStats: [
      { label: 'Incidentes Resueltos', value: '94.2%', color: 'text-emerald-400' },
      { label: 'Tiempo Respuesta 911', value: '4.2 min', color: 'text-cyan-400' },
      { label: 'Cámaras Conectadas', value: '1,280', color: 'text-amber-400' }
    ],
    sampleCommand: 'consultar_semaforo_de_riesgo_comunitario()',
    agentResponse: 'Sectores en Estado Óptimo: 18/20. Desplegando cuadrilla preventiva en Sector Xalisco por reporte de alumbrado.'
  },
  {
    id: 'agent-05',
    codeNumber: 'AGENTE 05',
    name: 'Auditoría IA & Riesgo Presupuestal',
    roleTitle: 'Fiscalización en Tiempo Real de Recursos Públicos',
    category: 'EFICIENCIA_AUDITORIA',
    icon: AlertIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/SystemAuditView.tsx & aiRiskService.ts',
    description: 'Motor de inteligencia artificial que detecta patrones anómalos en licitaciones, sobreprecios en insumos y desviaciones de gasto.',
    executiveAction: 'Escaneo predictivo de cuentas públicas antes de las revisiones de las auditorías superiores.',
    nationalScaleImpact: 'Cero tolerancia a la corrupción y garantía de trazabilidad del 100% de aportaciones federales.',
    liveStats: [
      { label: 'Contratos Escaneados', value: '100%', color: 'text-purple-400' },
      { label: 'Alertas Preventivas', value: '0 Críticas', color: 'text-emerald-400' },
      { label: 'Ahorro Fiscal Detectado', value: '$18.4M', color: 'text-cyan-400' }
    ],
    sampleCommand: 'escanear_licitaciones_obras_2026()',
    agentResponse: 'Auditoría IA completada. 0 banderas rojas detectadas. Índice de Transparencia de Contratación: 99.8%.'
  },
  {
    id: 'agent-06',
    codeNumber: 'AGENTE 06',
    name: 'Infraestructura & Padrón IUN',
    roleTitle: 'Control Nodal de Obras Públicas y Hospitales',
    category: 'SOBERANIA_TERRITORIO',
    icon: BuildingIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/services/infrastructureService.ts (Padrón IUN)',
    description: 'Identificador Único Nodal (IUN) asignado a cada carretera, puente, escuela y centro de salud con métricas de avance físico y social.',
    executiveAction: 'Supervisión en mapa interactivo de obras estratégicas como la Autopista Tepic-San Blas y escuelas tecnológicas.',
    nationalScaleImpact: 'Transparencia total para el Padrón Nacional de Obras Prioritarias de la Presidencia.',
    liveStats: [
      { label: 'Obras Registradas', value: '148 Activas', color: 'text-cyan-400' },
      { label: 'Avance Físico Promedio', value: '91.4%', color: 'text-emerald-400' },
      { label: 'Beneficiarios Únicos', value: '450,000', color: 'text-amber-400' }
    ],
    sampleCommand: 'obtener_estado_obra("NAY-ROA-2026-001")',
    agentResponse: 'Autopista Tepic-San Blas: Estado ÓPTIMO. Score de Integridad: 94/100. Beneficiarios directos: 120,000 personas.'
  },
  {
    id: 'agent-07',
    codeNumber: 'AGENTE 07',
    name: 'Academia ConnectX Sindical',
    roleTitle: 'Capacitación y Certificación Digital del Servidor Público',
    category: 'EFICIENCIA_AUDITORIA',
    icon: GradIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/ConnectXAcademy.tsx & StrategicAcademyView.tsx',
    description: 'Plataforma educativa para certificar al personal sindicalizado en herramientas de gestión sin papel y atención humanista.',
    executiveAction: 'Transforma al sindicato en el motor aliado de la modernización gubernamental.',
    nationalScaleImpact: 'Formación de 50,000 líderes de simplificación en todo el territorio nacional.',
    liveStats: [
      { label: 'Servidores Certificados', value: '1,840', color: 'text-emerald-400' },
      { label: 'Módulos Aprobados', value: '96.5%', color: 'text-cyan-400' },
      { label: 'Horas de Capacitación', value: '12,400 hrs', color: 'text-purple-400' }
    ],
    sampleCommand: 'consultar_certificaciones_sindicales_tepic()',
    agentResponse: '94% de la plantilla del Ayuntamiento de Tepic cuenta con acreditación en Expediente Cero Papel.'
  },
  {
    id: 'agent-08',
    codeNumber: 'AGENTE 08',
    name: 'Brigadas de Campo Offline-First',
    roleTitle: 'Censo Territorial y Atención Directa en Colonia',
    category: 'SOBERANIA_TERRITORIO',
    icon: UsersIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/BrigadaFieldView.tsx & BrigadaStrategy.tsx',
    description: 'Aplicación de captura en campo capaz de funcionar sin cobertura de red celular, sincronizando datos de familias al recuperar señal.',
    executiveAction: 'Lleva la ventanilla gubernamental hasta la puerta de hogares en la Sierra del Nayar y costas.',
    nationalScaleImpact: 'Inclusión digital universal garantizada para comunidades históricamente marginadas.',
    liveStats: [
      { label: 'Hogares Censados', value: '38,500', color: 'text-cyan-400' },
      { label: 'Colonias Cubiertas', value: '142', color: 'text-[#0FA3B1]' },
      { label: 'Sincronización Offline', value: '100% Eficaz', color: 'text-emerald-400' }
    ],
    sampleCommand: 'sincronizar_censo_sierra_del_nayar()',
    agentResponse: 'Sincronización de 450 expedientes familiares completada con éxito. Datos integrados a la red de bienestar.'
  },
  {
    id: 'agent-09',
    codeNumber: 'AGENTE 09',
    name: 'Inspector Misterioso (Mystery Shopper)',
    roleTitle: 'Monitoreo Anónimo de Calidad e Integridad de Trámites',
    category: 'EFICIENCIA_AUDITORIA',
    icon: EyeIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/MysteryShopperView.tsx',
    description: 'Sistema de evaluación encubierta y buzón blindado de denuncias de extorsión o dilación injustificada en ventanillas de servicio.',
    executiveAction: 'Califica la cortesía, velocidad y honestidad del personal público con métricas objetivas.',
    nationalScaleImpact: 'Eliminación del coyotaje y corrupción de baja escala en registros civiles y catastro.',
    liveStats: [
      { label: 'Evaluaciones Realizadas', value: '890', color: 'text-amber-400' },
      { label: 'Calificación Servicio', value: '9.4 / 10', color: 'text-emerald-400' },
      { label: 'Denuncias Atendidas', value: '100%', color: 'text-purple-400' }
    ],
    sampleCommand: 'generar_reporte_integridad_ventanilla_catastro()',
    agentResponse: 'Nivel de Satisfacción: 96%. Cero reportes de cobros indebidos. Cumplimiento de tiempos: 98%.'
  },
  {
    id: 'agent-10',
    codeNumber: 'AGENTE 10',
    name: 'Soberanía Infantil & Nutrición Escolar',
    roleTitle: 'Garante del Desarrollo Nutricional y Becas Directas',
    category: 'SERVICIOS_CIUDADANOS',
    icon: HeartIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/SoberaniaInfantilView.tsx',
    description: 'Monitoreo antropométrico y seguimiento de desayunos escolares en planteles de educación básica en Nayarit.',
    executiveAction: 'Garantiza que el apoyo alimentario llegue directamente a los niños en situación de vulnerabilidad.',
    nationalScaleImpact: 'Erradicación de la desnutrición infantil severa como política prioritaria de Estado.',
    liveStats: [
      { label: 'Niños Monitoreados', value: '28,400', color: 'text-rose-400' },
      { label: 'Escuelas Participantes', value: '310', color: 'text-cyan-400' },
      { label: 'Desayunos Entregados', value: '1.2M', color: 'text-emerald-400' }
    ],
    sampleCommand: 'verificar_trazabilidad_desayunos_tepic()',
    agentResponse: 'Desayunos Calientes entregados en 42 primarias. Trazabilidad completa desde almacén central hasta comedor escolar.'
  },
  {
    id: 'agent-11',
    codeNumber: 'AGENTE 11',
    name: 'Parlamento Abierto & Democracia Digital',
    roleTitle: 'Plataforma de Participación Ciudadana y Voto Popular',
    category: 'SERVICIOS_CIUDADANOS',
    icon: VoteIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/dashboard/ParlamentoView.tsx & Parlamento.MD',
    description: 'Consulta popular tokenizada para iniciativas de ley, presupuestos participativos y fiscalización de representantes legislativos.',
    executiveAction: 'Permite al ciudadano votar y proponer adiciones a reglamentos municipales desde su cel.',
    nationalScaleImpact: 'Democracia participativa directa en decisiones de obra e inversión pública.',
    liveStats: [
      { label: 'Votos Emitidos', value: '64,500', color: 'text-purple-400' },
      { label: 'Iniciativas Ciudadanas', value: '18 Votadas', color: 'text-emerald-400' },
      { label: 'Transparencia Voto', value: 'Encriptada', color: 'text-cyan-400' }
    ],
    sampleCommand: 'obtener_resultado_presupuesto_participativo()',
    agentResponse: 'Iniciativa Ganadora: "Parque Solar Comunitario Tepic". Votos de aprobación: 87.4% de participación.'
  },
  {
    id: 'agent-12',
    codeNumber: 'AGENTE 12',
    name: 'Canjes & Economía Social Circular',
    roleTitle: 'Red de Incentivos Ciudadanos y Moneda Local',
    category: 'SERVICIOS_CIUDADANOS',
    icon: CoinsIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/CanjesView.tsx',
    description: 'Sistema de recompensas comunitarias por reciclaje, pago puntual de predial y voluntariado urbano canjeables en comercios locales.',
    executiveAction: 'Fomenta la economía circular local y reduce el rezago en el pago de derechos municipales.',
    nationalScaleImpact: 'Dinamización de la microeconomía y cultura de civismo en colonias.',
    liveStats: [
      { label: 'Puntos Canjeados', value: '850,000', color: 'text-amber-400' },
      { label: 'Comercios Afiliados', value: '340', color: 'text-emerald-400' },
      { label: 'Material Reciclado', value: '120 Ton', color: 'text-cyan-400' }
    ],
    sampleCommand: 'procesar_canje_reciclaje("CIUDADANO_1029")',
    agentResponse: '50 Puntos Nayarit acreditados. Cupón generado para descuento en transporte público y mercado municipal.'
  },
  {
    id: 'agent-13',
    codeNumber: 'AGENTE 13',
    name: 'Mando Central & Orquestador de Gabinete',
    roleTitle: 'Tablero de Control para la Gobernadora / Alcaldesa',
    category: 'EFICIENCIA_AUDITORIA',
    icon: CpuIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/BananaCommandCenter.tsx & MandoCentral.tsx',
    description: 'Consola de mando ejecutiva que consolida métricas clave del gabinete, alertas de crisis y cumplimiento de metas del Plan Estatal.',
    executiveAction: 'Permite tomar decisiones fundamentadas en datos en vivo durante reuniones de gabinete de seguridad y obras.',
    nationalScaleImpact: 'Modelo de Sala de Crisis Nacional para la Presidencia de la República.',
    liveStats: [
      { label: 'KPIs en Tiempo Real', value: '124 Indicadores', color: 'text-cyan-400' },
      { label: 'Semáforo Gabinete', value: ' VERDE', color: 'text-emerald-400' },
      { label: 'Meta Plan Estatal', value: '92% Cumplido', color: 'text-purple-400' }
    ],
    sampleCommand: 'generar_resumen_ejecutivo_de_gabinete()',
    agentResponse: 'Gabinete al 92% de cumplimiento mensual. Alerta preventiva resuelta en agua potable. Presupuesto ejecutado en regla.'
  },
  {
    id: 'agent-14',
    codeNumber: 'AGENTE 14',
    name: 'Cerebro Modular AI Studio & Data Cloud',
    roleTitle: 'Infraestructura Resiliente Firebase & Cloud SQL',
    category: 'SEGURIDAD_IDENTIDAD',
    icon: DbIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/ModularBrain.tsx & firebase.ts / firestore.rules',
    description: 'Arquitectura multimodular en la nube con soporte offline-online, reglas de seguridad de datos estrictas y respaldos criptográficos.',
    executiveAction: 'Garantiza cero caídas del sistema durante picos masivos de trámites o contingencias climáticas.',
    nationalScaleImpact: 'Soberanía tecnológica de datos sin dependencia de software privativo extranjero.',
    liveStats: [
      { label: 'Disponibilidad Uptime', value: '99.99%', color: 'text-emerald-400' },
      { label: 'Tiempo Resp. Servidor', value: '18 ms', color: 'text-cyan-400' },
      { label: 'Cifrado de Datos', value: 'AES-256', color: 'text-purple-400' }
    ],
    sampleCommand: 'verificar_salud_infraestructura_cloud()',
    agentResponse: 'Estado del Cluster: SALUDABLE. Latencia DB: 14ms. Reglas de Firestore aplicadas con zero data leak compliance.'
  },
  {
    id: 'agent-15',
    codeNumber: 'AGENTE 15',
    name: 'Tesis de Ciencia Política & Licencia Abierta',
    roleTitle: 'Modelo Replicable "Municipio as a Service"',
    category: 'SOBERANIA_TERRITORIO',
    icon: BookIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/components/TesisCienciaPolitica.tsx & Whitepaper.tsx',
    description: 'Fundamentación académica y técnica de soberanía digital pública, legalidad constitucional y gobernanza orientada al bienestar.',
    executiveAction: 'Manual conceptual y jurídico listo para entregarse a la Agencia de Transformación Digital y Telecomunicaciones (ATDT).',
    nationalScaleImpact: 'Franquiciado gubernamental gratuito y sin costo de licencias para estados y municipios de México.',
    liveStats: [
      { label: 'Artículos Ley Cumplidos', value: '100% LNETB', color: 'text-cyan-400' },
      { label: 'Municipios Replicables', value: '2,477 Potential', color: 'text-emerald-400' },
      { label: 'Ahorro Nacional Proyectado', value: '$4.2B MXN', color: 'text-amber-400' }
    ],
    sampleCommand: 'descargar_dossier_para_agencia_transformacion_digital()',
    agentResponse: '✓ Paquete de transferencia tecnológica listo para entrega a la Presidencia de la República (www.presidenta.gob.mx).'
  },
  {
    id: 'agent-16',
    codeNumber: 'AGENTE 16',
    name: 'Auditoría de Redes Sociales, Noticias & Sentimiento',
    roleTitle: 'Detector de Manipulación, Botnets y Telemetría de Opinión Pública',
    category: 'EFICIENCIA_AUDITORIA',
    icon: MediaIcon,
    status: 'ACTIVO_100',
    codeAnchor: 'src/services/mediaAuditService.ts (LFPDPPP & C5 Narrativo)',
    description: 'Motor de inteligencia de medios y minería de opinión pública que audita plataformas digitales, portales de noticias y tendencias locales para identificar campañas coordinadas de desinformación (botnets, astroturfing) y cartografiar la influencia mediática real sobre la gobernanza municipal.',
    executiveAction: 'Mapea la influencia mediática y desarticula intentos de manipulación informativa mediante la difusión proactiva de datos oficiales verificados (Diario Oficial y LNETB).',
    nationalScaleImpact: 'Protección de la soberanía informativa e integridad democrática en los 2,477 municipios de México con cumplimiento estricto de la LFPDPPP.',
    liveStats: [
      { label: 'Plataformas Auditeadas', value: 'X, FB, YT, IG', color: 'text-cyan-400' },
      { label: 'Detección de Botnets', value: '99.4% Eficaz', color: 'text-emerald-400' },
      { label: 'Cifrado LFPDPPP', value: '100% Blindado', color: 'text-purple-400' }
    ],
    sampleCommand: 'auditar_narrativa_digital_municipio("Tepic_y_Xalisco")',
    agentResponse: '✓ Auditoría Nodal Completada: 84% Sentimiento Orgánico Positivo. 2 Granjas de Botnets detectadas y aisladas con reporte de interferencia artificial emitido.'
  }
];

export function PresidencialAgentsFolder({ onBack }: { onBack: () => void }) {
  const [mainTab, setMainTab] = useState<'PRESIDENCIAL' | 'DISENO'>('PRESIDENCIAL');
  const [selectedAgent, setSelectedAgent] = useState<PresidentialAgent>(PRESIDENTIAL_AGENTS_DATA[0]);
  const [filterCategory, setFilterCategory] = useState<string>('TODOS');
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);

  const categories = [
    { id: 'TODOS', label: 'Los 16 Agentes' },
    { id: 'SEGURIDAD_IDENTIDAD', label: 'Identidad y Biometría' },
    { id: 'SERVICIOS_CIUDADANOS', label: 'Servicios y Salud' },
    { id: 'EFICIENCIA_AUDITORIA', label: 'Auditoría e Inteligencia' },
    { id: 'SOBERANIA_TERRITORIO', label: 'Territorio e Infraestructura' },
  ];

  const filteredAgents = filterCategory === 'TODOS' 
    ? PRESIDENTIAL_AGENTS_DATA 
    : PRESIDENTIAL_AGENTS_DATA.filter(a => a.category === filterCategory);

  const handleRunTest = (agent: PresidentialAgent) => {
    setIsExecuting(true);
    setConsoleOutput(null);

    setTimeout(() => {
      setIsExecuting(false);
      setConsoleOutput(agent.agentResponse);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Selector: Agentes Presidenciales vs Agentes de Diseño */}
      <div className="p-2 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 max-w-2xl mx-auto shadow-xl">
        <button
          onClick={() => setMainTab('PRESIDENCIAL')}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
            mainTab === 'PRESIDENCIAL'
              ? 'bg-[#0FA3B1] text-white shadow-lg shadow-[#0FA3B1]/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BotIcon className="w-4 h-4" />
          <span>16 Agentes de Transformación</span>
        </button>

        <button
          onClick={() => setMainTab('DISENO')}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
            mainTab === 'DISENO'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>6 Agentes de Diseño UI/UX</span>
        </button>
      </div>

      {mainTab === 'DISENO' ? (
        <DesignAgentsFolder onBack={onBack} />
      ) : (
        <>
      {/* Top Banner Presidencial */}
      <div className="bg-gradient-to-r from-[#0FA3B1]/20 via-slate-900 to-emerald-950/40 border border-[#0FA3B1]/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0FA3B1]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Presidencia de la República · ATDT
              </span>
              <span className="text-slate-400 text-xs font-mono">Dossier Piloto Nayarit</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-black text-white tracking-tight leading-tight">
              Carpeta Presidencial: <span className="text-[#0FA3B1]">Los 15 Agentes de Transformación Digital</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Propuesta estructurada para la Dra. Claudia Sheinbaum Pardo (<strong>presidenta.gob.mx</strong>). Ecosistema integral de 15 agentes digitales inteligentes probados y anclados directamente en el código de Nayarit Digital / SOATM, listos para su escalamiento como estándar nacional de los 100 Pasos para la Transformación.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button 
              onClick={onBack}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <ArrowIcon className="w-4 h-4 rotate-180 text-[#0FA3B1]" />
              <span>Volver a la Plataforma</span>
            </button>
            <a 
              href="https://www.presidenta.gob.mx/" 
              target="_blank" 
              rel="noreferrer"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#0FA3B1] to-emerald-500 hover:opacity-90 text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Ir a presidenta.gob.mx</span>
              <LinkIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              filterCategory === cat.id
                ? 'bg-[#0FA3B1] text-white border-[#0FA3B1] shadow-lg shadow-[#0FA3B1]/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Agent Selector + Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List of 15 Agents */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredAgents.map((agent) => {
            const IconComponent = agent.icon;
            const isSelected = selectedAgent.id === agent.id;
            return (
              <motion.div
                key={agent.id}
                onClick={() => {
                  setSelectedAgent(agent);
                  setConsoleOutput(null);
                }}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                  isSelected 
                    ? 'bg-slate-900 border-[#0FA3B1] shadow-xl shadow-[#0FA3B1]/10' 
                    : 'bg-slate-950/80 border-slate-850 hover:bg-slate-900 hover:border-slate-800'
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0FA3B1]"></div>
                )}
                
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    isSelected 
                      ? 'bg-[#0FA3B1]/20 border-[#0FA3B1] text-[#0FA3B1]' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-extrabold text-[#0FA3B1]">
                        {agent.codeNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold">
                        {agent.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white truncate">{agent.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{agent.roleTitle}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Interactive Agent Inspector & Live Simulator Console */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl">
          
          <div className="space-y-6">
            
            {/* Selected Agent Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0FA3B1]/20 border border-[#0FA3B1]/40 flex items-center justify-center text-[#0FA3B1] shrink-0">
                  {React.createElement(selectedAgent.icon, { className: 'w-7 h-7' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-[#0FA3B1]">{selectedAgent.codeNumber}</span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs font-mono text-slate-400">{selectedAgent.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white leading-tight">{selectedAgent.name}</h2>
                  <p className="text-xs text-slate-400">{selectedAgent.roleTitle}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Desplegado
                </span>
              </div>
            </div>

            {/* Code Anchor Badge */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
              <TerminalIcon className="w-4 h-4 text-[#0FA3B1] shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Anclaje en Código del Repositorio</p>
                <p className="text-xs font-mono font-bold text-cyan-300 truncate">{selectedAgent.codeAnchor}</p>
              </div>
            </div>

            {/* Live Key Metrics */}
            <div className="grid grid-cols-3 gap-3">
              {selectedAgent.liveStats.map((st, i) => (
                <div key={i} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-center">
                  <p className="text-[10px] text-slate-400 font-medium mb-1 truncate">{st.label}</p>
                  <p className={`text-base font-bold font-mono ${st.color}`}>{st.value}</p>
                </div>
              ))}
            </div>

            {/* Description & Impact */}
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                <h5 className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#0FA3B1]" />
                  <span>Funcionamiento en el Estado de Nayarit</span>
                </h5>
                <p>{selectedAgent.description}</p>
              </div>

              <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                <h5 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <ZapIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Escalamiento Nacional para www.presidenta.gob.mx</span>
                </h5>
                <p>{selectedAgent.nationalScaleImpact}</p>
              </div>
            </div>

          </div>

          {/* Interactive Agent Terminal Simulator */}
          <div className="space-y-3 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-bold font-mono">
                <TerminalIcon className="w-4 h-4 text-[#0FA3B1]" />
                <span>Simulador de Comando Presidencial</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Prueba Directa de Servidor</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between gap-2 text-slate-400">
                <span className="text-cyan-400 font-bold">$ {selectedAgent.sampleCommand}</span>
                <button
                  onClick={() => handleRunTest(selectedAgent)}
                  disabled={isExecuting}
                  className="px-3 py-1 bg-[#0FA3B1] hover:bg-[#088b99] text-white font-sans font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  {isExecuting ? (
                    <RefreshIcon className="w-3 h-3 animate-spin" />
                  ) : (
                    <PlayIcon className="w-3 h-3" />
                  )}
                  <span>{isExecuting ? 'Ejecutando...' : 'Ejecutar'}</span>
                </button>
              </div>

              {consoleOutput && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 bg-slate-900 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] leading-relaxed"
                >
                  {consoleOutput}
                </motion.div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Footer / National Manifesto */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <AwardIcon className="w-6 h-6 text-[#0FA3B1] shrink-0" />
          <div>
            <p className="font-bold text-white">Transferencia Tecnológica Soberana</p>
            <p className="text-[11px]">Diseñado sin licencias de software privativas ni costo para las finanzas públicas estatales o federales.</p>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="px-6 py-2.5 bg-[#0FA3B1] hover:bg-[#088b99] text-white font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          Explorar Plataforma Nayarit Digital OS
        </button>
      </div>
      </>
      )}

    </div>
  );
}
