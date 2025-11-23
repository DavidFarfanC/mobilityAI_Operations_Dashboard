import { motion } from 'framer-motion';
import { Incident } from '../types';
import { ArrowUpRight } from './ui/icons';

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
                {incident.fotoUrl && (
                  <span className="px-2 py-1 rounded-lg bg-blue-500/15 text-blue-200 border border-blue-500/30">
                    📷 Foto
                  </span>
                )}
                {incident.audioUrl && (
                  <span className="px-2 py-1 rounded-lg bg-purple-500/15 text-purple-200 border border-purple-500/30">
                    🎤 Audio
                  </span>
                )}
                <ArrowUpRight className="h-4 w-4 text-accent ml-auto" />
              </div>
            </motion.button>
          ))}
      </div>

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
