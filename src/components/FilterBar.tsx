import { IncidentStatus, Severity } from '../types';

type Props = {
  severity: Severity | 'all';
  status: IncidentStatus | 'all';
  onSeverityChange: (val: Severity | 'all') => void;
  onStatusChange: (val: IncidentStatus | 'all') => void;
};

const severityLabels: Record<Severity, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
};

const statusLabels: Record<IncidentStatus, string> = {
  abierto: 'Abierto',
  'en camino': 'En camino',
  resuelto: 'Resuelto',
};

function FilterBar({ severity, status, onSeverityChange, onStatusChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-slate/60 bg-charcoal/70 p-3 shadow-glass">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span>Filtrar por severidad:</span>
        <div className="flex gap-2 flex-wrap">
          <FilterPill
            active={severity === 'all'}
            label="Todas"
            onClick={() => onSeverityChange('all')}
          />
          {(Object.keys(severityLabels) as Severity[]).map((sev) => (
            <FilterPill
              key={sev}
              active={severity === sev}
              label={severityLabels[sev]}
              onClick={() => onSeverityChange(sev)}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-muted">
        <span>Estado:</span>
        <div className="flex gap-2 flex-wrap">
          <FilterPill active={status === 'all'} label="Todos" onClick={() => onStatusChange('all')} />
          {(Object.keys(statusLabels) as IncidentStatus[]).map((st) => (
            <FilterPill
              key={st}
              active={status === st}
              label={statusLabels[st]}
              onClick={() => onStatusChange(st)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;

const FilterPill = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full border text-xs transition ${
      active
        ? 'border-accent/70 bg-accent/15 text-white'
        : 'border-slate/60 bg-slate/40 text-muted hover:border-accent/50'
    }`}
  >
    {label}
  </button>
);
