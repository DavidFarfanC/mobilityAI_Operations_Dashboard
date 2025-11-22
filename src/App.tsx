import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import KPIStats from './components/KPIStats';
import MapView from './components/MapView';
import IncidentSidebar from './components/IncidentSidebar';
import Navbar from './components/layout/Navbar';
import Layout from './components/layout/Layout';
import { useIncidents, useKpis, useTrend } from './services/hooks';
import { Incident } from './types';
import { useUiStore } from './store/uiStore';

function App() {
  const { data: incidents = [], isLoading: loadingIncidents } = useIncidents();
  const { data: kpis, isLoading: loadingKpis } = useKpis();
  const { data: trend } = useTrend();
  const { selectedIncidentId, setSelectedIncident } = useUiStore();

  const selectedIncident: Incident | undefined = useMemo(
    () => incidents.find((incident) => incident.id === selectedIncidentId),
    [incidents, selectedIncidentId]
  );

  return (
    <Layout>
      <Navbar />
      <main className="p-6 lg:p-8 space-y-6">
        <KPIStats kpis={kpis} trend={trend} isLoading={loadingKpis || loadingIncidents} />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <section className="xl:col-span-8 bg-charcoal/70 border border-slate/50 rounded-2xl shadow-glass overflow-hidden">
            <MapView incidents={incidents} isLoading={loadingIncidents} />
          </section>
          <section className="xl:col-span-4">
            <IncidentSidebar
              incidents={incidents}
              selectedIncident={selectedIncident}
              onSelect={setSelectedIncident}
              isLoading={loadingIncidents}
            />
          </section>
        </div>
      </main>
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 xl:hidden"
            onClick={() => setSelectedIncident(undefined)}
          >
            <div
              className="absolute bottom-0 inset-x-0 bg-slate p-4 border-t border-slate/60 rounded-t-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <IncidentSidebar
                incidents={incidents}
                selectedIncident={selectedIncident}
                onSelect={setSelectedIncident}
                isLoading={loadingIncidents}
                compact
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
