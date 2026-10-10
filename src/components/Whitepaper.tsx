import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  ArrowRight,
  Landmark,
  Scale,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Whitepaper() {
  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-12 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-200">
        
        {/* Cover Page */}
        <header className="bg-slate-900 text-white p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-rose-400 mb-8">
              <FileText className="w-6 h-6" />
              <span className="text-sm font-black uppercase tracking-widest">Whitepaper Técnico-Institucional</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
              NAYARIT <span className="text-rose-400">DIGITAL</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-serif italic">
              Cumplimiento Integral de la Ley Nacional para Eliminar Trámites Burocráticos (LNETB) en Tepic, Nayarit — piloto replicable en los 2,470 municipios del país
            </p>
            
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs uppercase tracking-widest font-bold text-slate-400">
              <div>
                <span className="block text-slate-500 text-[10px] mb-1">Ecosistema</span>
                ConnectX / Portal Municipal
              </div>
              <div>
                <span className="block text-slate-500 text-[10px] mb-1">Clasificación</span>
                Dossier Institucional
              </div>
              <div>
                <span className="block text-slate-500 text-[10px] mb-1">Emisión</span>
                Julio 2026
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 md:p-12 space-y-16">
          
          {/* Section 1 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <Landmark className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">1. Resumen Ejecutivo</h2>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              La Ley Nacional para Eliminar Trámites Burocráticos (LNETB) constitucional exige a los municipios transicionar hacia ventanillas únicas eficientes, seguras y libres de papel. Esto impulsa a los ayuntamientos a adoptar herramientas de identidad digital, interoperabilidad gubernamental, y trazabilidad total en beneficio de la ciudadanía.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8 text-[15px]">
              El SOATM (Sistema Operativo de Administración Territorial) no es una invención del proyecto: es la implementación en software abierto de obligaciones que ya existen en los tres órdenes de gobierno — la LNETB federal (Arts. 2, 3, 66-76), la Ley de Gobierno Digital de Nayarit (Arts. 2, 5 y 6) y el marco normativo municipal de Tepic. La ley ya lo mandaba; nosotros lo descubrimos y lo programamos.
            </p>
            <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl">
              <p className="text-xl font-serif font-medium text-slate-800 italic">
                Tepic lidera este cambio histórico — y el código abierto lo lleva a todo México.
              </p>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              El ecosistema <strong>ConnectX / Nayarit Digital</strong> no es un software aislado. Es la <strong>infraestructura operativa completa</strong> que dignifica la labor de los servidores públicos sindicalizados y reduce drásticamente los tiempos de espera de la ciudadanía, logrando un servicio ágil y de excelencia.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <Scale className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">2. Marco de Derechos y Simplificación</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Lo que demanda el ciudadano</h3>
                <ul className="space-y-3">
                  {['Expediente Único Digital sin duplicar copias', 'Interoperabilidad real entre dependencias', 'Firma electrónica y acuses con validez oficial', 'Trazabilidad y estatus en tiempo real', 'Atención incluyente y libre de burocracia lenta'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-rose-900 mb-4">El Costo de la Inercia</h3>
                <ul className="space-y-3">
                  <li className="text-sm text-rose-700">❌ <strong>Largas filas de espera</strong> y pérdida de tiempo para los hogares.</li>
                  <li className="text-sm text-rose-700">❌ <strong>Fuga de recursos administrativos</strong> en consumibles y archivo físico.</li>
                  <li className="text-sm text-rose-700">❌ <strong>Discrecionalidad</strong> por falta de trazabilidad en las ventanillas.</li>
                  <li className="text-sm text-rose-700">❌ <strong>Incertidumbre legal</strong> en la validez de los trámites.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <Layers className="w-6 h-6 text-indigo-500" />
              <h2 className="text-2xl font-black uppercase tracking-tight">3. Pilares de la Transformación</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Expediente Único Digital', desc: 'Cada solicitud y validación de identidad se asocia de manera segura a un expediente digital para evitar la duplicación de requisitos.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { title: 'Trazabilidad y Transparencia', desc: 'Cada trámite genera un acuse digital firmado y auditable, permitiendo al ciudadano dar seguimiento en tiempo real.', icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { title: 'Interoperabilidad Real', desc: 'El sistema permite a tesorería, obras y catastro compartir información segura bajo estrictos estándares de soberanía tecnológica.', icon: Cpu, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                { title: 'Capacitación y Orgullo Sindical', desc: 'A través de la Academia Digital ConnectX, el personal del ayuntamiento se certifica y lidera activamente la digitalización de su área.', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50' },
              ].map((pilar, i) => (
                <div key={i} className={cn("p-6 rounded-2xl border border-slate-200", pilar.bg)}>
                  <div className="flex items-center gap-3 mb-3">
                    <pilar.icon className={cn("w-5 h-5", pilar.color)} />
                    <h3 className="font-bold text-slate-800 text-[15px]">{pilar.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{pilar.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to action */}
          <section className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4">El bienestar social comienza con un servicio público digno.</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                La digitalización con ConnectX no es un gasto, es la mayor inversión institucional para dignificar el trabajo público y garantizar un servicio ágil y libre de rezago para toda la ciudadanía.
              </p>
              <div className="inline-flex items-center gap-2 text-rose-400 font-bold uppercase tracking-widest text-sm bg-rose-500/10 px-6 py-3 rounded-full">
                Siguiente Paso: Coordinación y Pruebas en Pilotos <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
