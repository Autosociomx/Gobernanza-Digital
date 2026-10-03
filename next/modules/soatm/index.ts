/**
 * SOATM — Sistema Operativo de Atención de Trámites Mexicanos.
 * Punto de entrada público del agente de enrutamiento y de su registro.
 * Detalle: docs/marco/COMPONENTES.md y data/dependencias/README.md.
 */
export {
  SOATM_ROUTING_VERSION,
  SoatmRoutingAgent,
  type LegalBasis,
  type RouteStatus,
  type RoutingData,
} from './agent';
export {
  DEPENDENCIAS,
  RUTAS_TEPIC,
  buscarDependencias,
  buscarRuta,
  dependenciaPorId,
  normalizar,
  type Dependencia,
  type FundamentoDependencia,
  type NivelGobierno,
  type RegistroRutas,
  type RutaServicio,
} from './registry';
