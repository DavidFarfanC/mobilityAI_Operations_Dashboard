import { motion } from 'framer-motion';
import { Incident } from '../types';
import { ClockIcon, FlameIcon, MapIcon } from './ui/icons';

type Props = {
  incident: Incident;
  onClose: () => void;
};

const statusColor: Record<string, string> = {
  abierto: 'bg-red-500/15 text-red-100 border-red-500/30',
  'en camino': 'bg-amber-500/15 text-amber-100 border-amber-500/30',
  resuelto: 'bg-emerald-500/15 text-emerald-100 border-emerald-500/30',
};

const severityColor: Record<string, string> = {
  baja: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/30',
  media: 'bg-amber-500/15 text-amber-100 border-amber-500/30',
  alta: 'bg-orange-500/15 text-orange-100 border-orange-500/30',
  critica: 'bg-red-500/15 text-red-100 border-red-500/30',
};

function IncidentDetailModal({ incident, onClose }: Props) {
  const showPhoto = Boolean(
    incident.fotoUrl &&
      Number.isFinite(incident.posicion?.lat) &&
      Number.isFinite(incident.posicion?.lng)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        className="w-full max-w-5xl rounded-2xl bg-slate border border-slate/60 shadow-2xl shadow-black/30 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`grid gap-6 ${showPhoto ? 'md:grid-cols-[1.6fr_1fr]' : ''}`}>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/40 grid place-items-center text-accent">
                  <FlameIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">
                    {incident.linea}
                  </p>
                  <p className="text-xl font-display font-semibold text-white">{incident.tipo}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-sm text-muted hover:text-white transition-colors px-3 py-1 rounded-lg border border-slate/60 hover:border-accent/60"
              >
                Cerrar
              </button>
            </div>

            <p className="text-sm leading-relaxed text-white/90">{incident.descripcion}</p>

            <div className="grid grid-cols-2 gap-3 text-sm text-white/90">
              <DetailPill label="ID" value={incident.id} />
              <DetailPill label="Línea" value={incident.linea} />
              <DetailPill
                label="Hora"
                value={
                  <span className="inline-flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-accent" />
                    {incident.hora}
                  </span>
                }
              />
              <DetailPill
                label="Ubicación"
                value={
                  <span className="inline-flex items-center gap-2">
                    <MapIcon className="h-4 w-4 text-accent" />
                    {incident.posicion.lat.toFixed(4)}, {incident.posicion.lng.toFixed(4)}
                  </span>
                }
              />
              <Tag
                label={`Severidad ${incident.severidad}`}
                className={severityColor[incident.severidad]}
              />
              <Tag label={`Estado ${incident.estado}`} className={statusColor[incident.estado]} />
            </div>

            {incident.detalles?.length ? (
              <Section title="Qué pasó">
                <ul className="list-disc list-inside space-y-1 text-sm text-white/85">
                  {incident.detalles.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {incident.accionesSugeridas?.length ? (
              <Section title="Acciones sugeridas">
                <ul className="list-disc list-inside space-y-1 text-sm text-white/85">
                  {incident.accionesSugeridas.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Section>
            ) : null}
          </div>

          {showPhoto && (
            <div className="h-full">
              <div className="overflow-hidden rounded-xl border border-slate/60 bg-charcoal/50 h-full">
                <img
                  src={incident.fotoUrl}
                  alt={`Evidencia del incidente ${incident.tipo}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const DetailPill = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate/60 bg-charcoal/60">
    <span className="text-muted text-[11px] uppercase tracking-[0.18em]">{label}</span>
    <span className="font-semibold text-white/90">{value}</span>
  </div>
);

const Tag = ({ label, className }: { label: string; className: string }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${className}`}
  >
    {label}
  </span>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-slate/60 bg-charcoal/60 p-3 space-y-2">
    <p className="text-xs uppercase tracking-[0.18em] text-muted">{title}</p>
    {children}
  </div>
);

export default IncidentDetailModal;
