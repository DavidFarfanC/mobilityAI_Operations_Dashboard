import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Incident, TrendResponse } from '../types';

type Props = {
  incidents: Incident[];
  trend?: TrendResponse;
};

const palette = ['#7ae582', '#d97706', '#f97316', '#ef4444'];

function AnalyticsPanel({ incidents, trend }: Props) {
  const severityData = buildSeverityData(incidents);
  const statusData = buildStatusData(incidents);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <ChartCard title="Incidentes por severidad">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={severityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="label" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ background: '#0f1621', border: '1px solid #1f2937' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {severityData.map((_, idx) => (
                <Cell key={idx} fill={palette[idx % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Tendencia por hora">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend?.porHora}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="label" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ background: '#0f1621', border: '1px solid #1f2937' }} />
            <Line type="monotone" dataKey="value" stroke="#7ae582" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Estado de incidentes">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusData}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="#0b0d10"
            >
              {statusData.map((_, idx) => (
                <Cell key={idx} fill={palette[idx % palette.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#0f1621', border: '1px solid #1f2937' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex gap-2 flex-wrap text-xs text-muted mt-2">
          {statusData.map((item, idx) => (
            <span
              key={item.label}
              className="px-2 py-1 rounded-lg border border-slate/60 flex items-center gap-2"
            >
              <span
                className="h-2.5 w-2.5 rounded-full inline-block"
                style={{ backgroundColor: palette[idx % palette.length] }}
              />
              {item.label}: {item.value}
            </span>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

export default AnalyticsPanel;

type ChartCardProps = { title: string; children: React.ReactNode };

const ChartCard = ({ title, children }: ChartCardProps) => (
  <div className="rounded-2xl border border-slate/50 bg-charcoal/70 p-4 shadow-glass">
    <div className="mb-2 text-sm text-muted">{title}</div>
    {children}
  </div>
);

const buildSeverityData = (incidents: Incident[]) => {
  const grouped: Record<string, number> = {};
  incidents.forEach((inc) => {
    grouped[inc.severidad] = (grouped[inc.severidad] || 0) + 1;
  });
  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
};

const buildStatusData = (incidents: Incident[]) => {
  const grouped: Record<string, number> = {};
  incidents.forEach((inc) => {
    grouped[inc.estado] = (grouped[inc.estado] || 0) + 1;
  });
  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
};
