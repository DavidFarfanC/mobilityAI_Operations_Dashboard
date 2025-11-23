import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import KPIStats from './components/KPIStats'
import MapView from './components/MapView'
import IncidentSidebar from './components/IncidentSidebar'
import IncidentDetailModal from './components/IncidentDetailModal'
import Navbar from './components/layout/Navbar'
import Layout from './components/layout/Layout'
import {
  useIncidents,
  useKpis,
  useTrend,
  useFallDetections,
} from './services/hooks'
import {
  Incident,
  IncidentStatus,
  Severity,
  fallDetectionToIncident,
} from './types'
import { useUiStore } from './store/uiStore'
import FilterBar from './components/FilterBar'
import AnalyticsPanel from './components/AnalyticsPanel'

function App() {
  // Obtener fall detections reales del backend
  const { data: fallDetections = [], isLoading: loadingFallDetections } =
    useFallDetections(0, 50)

  // Transformar fall detections a incidents
  const backendIncidents = useMemo(
    () => fallDetections.map(fallDetectionToIncident),
    [fallDetections]
  )

  // Mantener los datos fake para KPIs y trend (por ahora)
  const { data: fakeIncidents = [] } = useIncidents()
  const { data: kpis, isLoading: loadingKpis } = useKpis()
  const { data: trend } = useTrend()

  // Combinar incidents reales con fake (o usar solo reales)
  const incidents =
    backendIncidents.length > 0 ? backendIncidents : fakeIncidents
  const loadingIncidents = loadingFallDetections
  const { selectedIncidentId, setSelectedIncident } = useUiStore()
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>(
    'all'
  )

  const filteredIncidents = useMemo(
    () =>
      incidents.filter(
        (inc) =>
          (severityFilter === 'all' || inc.severidad === severityFilter) &&
          (statusFilter === 'all' || inc.estado === statusFilter)
      ),
    [incidents, severityFilter, statusFilter]
  )

  const selectedIncident: Incident | undefined = useMemo(
    () =>
      filteredIncidents.find((incident) => incident.id === selectedIncidentId),
    [filteredIncidents, selectedIncidentId]
  )

  return (
    <Layout>
      <Navbar />
      <main className="p-6 lg:p-8 space-y-6">
        {/* KPIs arriba siempre visibles */}
        <KPIStats
          kpis={kpis}
          trend={trend}
          isLoading={loadingKpis || loadingIncidents}
        />
        <FilterBar
          severity={severityFilter}
          status={statusFilter}
          onSeverityChange={setSeverityFilter}
          onStatusChange={setStatusFilter}
        />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Mapa grande a la izquierda */}
          <section className="xl:col-span-8 bg-charcoal/70 border border-slate/50 rounded-2xl shadow-glass overflow-hidden">
            <MapView
              incidents={filteredIncidents}
              isLoading={loadingIncidents}
            />
          </section>
          {/* Listado y detalle al lado */}
          <section className="xl:col-span-4">
            <IncidentSidebar
              incidents={filteredIncidents}
              selectedIncident={selectedIncident}
              onSelect={setSelectedIncident}
              isLoading={loadingIncidents}
            />
          </section>
        </div>
        <AnalyticsPanel incidents={filteredIncidents} trend={trend} />
      </main>
      <AnimatePresence>
        {selectedIncident && (
          <IncidentDetailModal
            incident={selectedIncident}
            onClose={() => setSelectedIncident(undefined)}
          />
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default App
