import React, { useState, lazy, Suspense } from 'react';
import { PlatformLanding } from './components/PlatformLanding';
import { ErrorBoundary } from './components/ErrorBoundary';

// Las vistas pesadas se cargan bajo demanda: el visitante de la landing
// no descarga el dashboard, la app ciudadana ni sus librerías (recharts,
// tesseract, jspdf…) hasta que navega a ellas.
const C5Dashboard = lazy(() =>
  import('./components/C5Dashboard').then((m) => ({ default: m.C5Dashboard }))
);
const CitizenApp = lazy(() =>
  import('./components/CitizenApp').then((m) => ({ default: m.CitizenApp }))
);
const OrbeContextPilot = lazy(() =>
  import('./components/orbe/OrbeContextPilot').then((m) => ({ default: m.OrbeContextPilot }))
);
const DeveloperChecklist = lazy(() =>
  import('./components/DeveloperChecklist').then((m) => ({ default: m.DeveloperChecklist }))
);
const ExecutiveFolder = lazy(() =>
  import('./components/ExecutiveFolder').then((m) => ({ default: m.ExecutiveFolder }))
);

function ViewFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F1]" role="status" aria-live="polite">
      <span className="text-[#5A6478] text-sm tracking-widest uppercase">Cargando módulo…</span>
    </div>
  );
}

const VALID_VIEWS = ['landing', 'c5', 'citizen', 'dev', 'executive'] as const;
type ViewType = (typeof VALID_VIEWS)[number];

// Enlace profundo: ?view=c5&modulo=agrovision o ?view=citizen&tab=services
// permite que herramientas externas (p. ej. docs/orbe/*.html) manden a un
// ciudadano o a un operador directo al módulo correcto, en vez de siempre
// aterrizar en la landing. Solo se lee una vez, al cargar la página.
function getInitialStateFromUrl() {
  if (typeof window === 'undefined') {
    return { view: 'landing' as ViewType, tab: 'home', modulo: undefined as string | undefined };
  }
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  return {
    view: (VALID_VIEWS as readonly string[]).includes(view || '') ? (view as ViewType) : ('landing' as ViewType),
    tab: params.get('tab') || 'home',
    modulo: params.get('modulo') || undefined,
  };
}
const initialUrlState = getInitialStateFromUrl();

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>(initialUrlState.view);
  const [citizenTab, setCitizenTab] = useState<any>(initialUrlState.tab);
  const [citizenAction, setCitizenAction] = useState<any>(null);

  if (currentView === 'c5') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <C5Dashboard onLogout={() => setCurrentView('landing')} initialModule={initialUrlState.modulo as any} />
      </Suspense>
    );
  }

  if (currentView === 'citizen') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <CitizenApp onLogout={() => setCurrentView('landing')} initialTab={citizenTab} initialAction={citizenAction} />
        <OrbeContextPilot />
      </Suspense>
    );
  }

  if (currentView === 'dev') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <DeveloperChecklist onLogout={() => setCurrentView('landing')} />
      </Suspense>
    );
  }

  if (currentView === 'executive') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <ExecutiveFolder onBack={() => setCurrentView('landing')} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <PlatformLanding onNavigate={(view, subView, action) => {
        if (view === 'citizen') {
          setCitizenTab(subView || 'home');
          setCitizenAction(action || null);
        }
        setCurrentView(view);
      }} />
    </div>
  );
}

// Un fallo en una vista muestra la pantalla de "Interrupción de Sistema"
// en vez de dejar la aplicación en blanco.
function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
