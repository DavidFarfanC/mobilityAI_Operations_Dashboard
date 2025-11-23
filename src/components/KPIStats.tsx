import { motion } from 'framer-motion';
import { ArrowUpRight, BoltIcon, ClockIcon, FlameIcon } from './ui/icons';
import { KPIResponse } from '../types';

type Props = {
  kpis?: KPIResponse;
  isLoading?: boolean;
};

function KPIStats({ kpis, isLoading }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
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
      <StatCard
        label="Incidentes críticos"
        value={kpis?.incidentesPorSeveridad?.critica ?? '--'}
        icon={<ArrowUpRight className="h-5 w-5" />}
        loading={isLoading}
      />
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
