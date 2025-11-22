import { AnimatePresence, motion } from 'framer-motion';
import { Incident } from '../types';
import { ArrowUpRight, BoltIcon, FlameIcon } from './ui/icons';

type Props = {
  incidents: Incident[];
  selectedIncident?: Incident;
  onSelect: (id?: string) => void;
  isLoading?: boolean;
  compact?: boolean;
};

const severityColor: Record<string, string> = {
  baja: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
  media: 'bg-amber-500/15 text-amber-100 border-amber-500/30',
  alta: 'bg-orange-500/15 text-orange-100 border-orange-500/30',
  critica: 'bg-red-500/15 text-red-100 border-red-500/30',
};

function IncidentSidebar({ incidents, selectedIncident, onSelect, isLoading, compact }: Props) {
  return (
    <div
      className={`glass rounded-2xl border border-slate/60 p-4 space-y-4 shadow-glass ${
        compact ? 'h-full' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Incidentes en tiempo real</p>
          <p className="text-lg font-display font-semibold">{incidents.length} reportes</p>
        </div>
        <button
          onClick={() => onSelect(undefined)}
          className="text-xs text-muted hover:text-white transition-colors"
        >
          Limpiar
        </button>
      </div>

      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {isLoading && <p className="text-muted text-sm">Cargando incidentes...</p>}
        {!isLoading &&
          incidents.map((incident) => (
            <motion.button
              key={incident.id}
              onClick={() => onSelect(incident.id)}
              className={`w-full text-left p-3 rounded-xl border transition hover:border-accent/60 hover:bg-accent/5 ${
                selectedIncident?.id === incident.id
                  ? 'border-accent/70 bg-accent/10'
                  : 'border-slate/60 bg-slate/40'
              }`}
              whileHover={{ y: -1 }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted">{incident.hora} · {incident.linea}</p>
                <span className={`text-[11px] px-2 py-1 rounded-lg border ${severityColor[incident.severidad]}`}>
                  {incident.severidad}
                </span>
              </div>
              <p className="mt-1 font-semibold text-white">{incident.tipo}</p>
              <p className="text-sm text-muted">{incident.descripcion}</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <StatusBadge status={incident.estado} />
                <ArrowUpRight className="h-4 w-4 text-accent" />
              </div>
            </motion.button>
          ))}
      </div>

      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl border border-slate/60 bg-slate/30 p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/40 grid place-items-center text-accent">
                <FlameIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted">{selectedIncident.hora}</p>
                <p className="font-display font-semibold text-lg">{selectedIncident.tipo}</p>
              </div>
            </div>
            <p className="text-sm text-white/90">{selectedIncident.descripcion}</p>
            <div className="flex items-center gap-3 text-sm text-muted">
              <StatusBadge status={selectedIncident.estado} />
              <span className={`text-[11px] px-2 py-1 rounded-lg border ${severityColor[selectedIncident.severidad]}`}>
                Severidad {selectedIncident.severidad}
              </span>
              <span className="px-2 py-1 rounded-lg border border-slate/50 text-xs">
                {selectedIncident.linea}
              </span>
            </div>
            <div className="bg-charcoal/60 rounded-xl p-3 border border-slate/60">
              <p className="text-xs uppercase tracking-[0.15em] text-muted mb-2">Acciones sugeridas</p>
              <ul className="text-sm space-y-2 text-white/90">
                <li className="flex items-center gap-2"><BoltIcon className="h-4 w-4 text-accent" />Notificar a puesto de control</li>
                <li className="flex items-center gap-2"><BoltIcon className="h-4 w-4 text-accent" />Coordinar equipo en sitio</li>
                <li className="flex items-center gap-2"><BoltIcon className="h-4 w-4 text-accent" />Actualizar ETA y mensaje a usuarios</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IncidentSidebar;

const statusColor: Record<string, string> = {
  abierto: 'bg-red-500/15 text-red-100 border-red-500/30',
  'en camino': 'bg-amber-500/15 text-amber-100 border-amber-500/30',
  resuelto: 'bg-emerald-500/15 text-emerald-100 border-emerald-500/30',
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-1 rounded-lg border text-xs ${statusColor[status]}`}>{status}</span>
);
