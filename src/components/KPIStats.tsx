import { motion } from 'framer-motion';
import { ArrowUpRight, BoltIcon, ClockIcon, FlameIcon } from './ui/icons';
import { KPIResponse, TrendResponse } from '../types';

type Props = {
  kpis?: KPIResponse;
  trend?: TrendResponse;
  isLoading?: boolean;
};

const severityLabels: Record<string, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
};

const severityColor: Record<string, string> = {
  baja: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  media: 'bg-amber-500/20 text-amber-100 border-amber-500/40',
  alta: 'bg-orange-500/20 text-orange-100 border-orange-500/40',
  critica: 'bg-red-500/20 text-red-100 border-red-500/40',
};

function KPIStats({ kpis, trend, isLoading }: Props) {
  const cardClasses =
    'flex flex-col gap-2 rounded-2xl border border-slate/50 bg-charcoal/70 p-4 shadow-glass';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label="Tiempo promedio de respuesta"
        value={kpis?.tiempoRespuestaPromedio ? `${kpis.tiempoRespuestaPromedio} min` : '--'}
        icon={<ClockIcon className="h-5 w-5" />}
        accent
        loading={isLoading}
      />
      <StatCard
        label="Tiempo promedio de llegada"
        value={kpis?.tiempoLlegadaPromedio ? `${kpis.tiempoLlegadaPromedio} min` : '--'}
        icon={<BoltIcon className="h-5 w-5" />}
        loading={isLoading}
      />
      <StatCard
        label="Incidentes abiertos"
        value={kpis?.incidentesAbiertos ?? '--'}
        icon={<FlameIcon className="h-5 w-5" />}
        loading={isLoading}
      />
      <div className={cardClasses}>
        <div className="flex items-center gap-2 text-sm text-muted">
          <ArrowUpRight className="h-4 w-4" />
          Incidentes por severidad
        </div>
        <div className="flex flex-wrap gap-2">
          {kpis
            ? Object.entries(kpis.incidentesPorSeveridad).map(([sev, count]) => (
                <span
                  key={sev}
                  className={`px-3 py-2 rounded-xl border text-sm ${severityColor[sev]}`}
                >
                  {severityLabels[sev] ?? sev}: {count}
                </span>
              ))
            : '---'}
        </div>
        {trend && (
          <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-muted">
            <div>
              <p className="mb-1 text-white/70">Tendencia por hora</p>
              <Sparkline data={trend.porHora} />
            </div>
            <div>
              <p className="mb-1 text-white/70">Por día</p>
              <Sparkline data={trend.porDia} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KPIStats;

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: boolean;
  loading?: boolean;
};

const StatCard = ({ label, value, icon, accent, loading }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`rounded-2xl border border-slate/50 bg-charcoal/70 p-4 shadow-glass ${
      accent ? 'ring-1 ring-accent/30' : ''
    }`}
  >
    <div className="flex items-center justify-between text-sm text-muted">
      <span>{label}</span>
      <div className="h-8 w-8 grid place-items-center rounded-xl bg-accent/10 text-accent border border-accent/40">
        {icon}
      </div>
    </div>
    <div className="mt-2 text-3xl font-display font-semibold text-white">
      {loading ? '···' : value}
    </div>
  </motion.div>
);

const Sparkline = ({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((point) => (
        <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-md bg-gradient-to-t from-accent/40 to-accent/70"
            style={{ height: `${(point.value / max) * 100}%` }}
            title={`${point.label}: ${point.value}`}
          />
          <span className="text-[10px] text-muted">{point.label}</span>
        </div>
      ))}
    </div>
  );
};
