export type Severity = 'baja' | 'media' | 'alta' | 'critica';
export type IncidentStatus = 'abierto' | 'en camino' | 'resuelto';

export type Incident = {
  id: string;
  tipo: string;
  descripcion: string;
  hora: string;
  severidad: Severity;
  estado: IncidentStatus;
  linea: string;
  posicion: { lat: number; lng: number };
};

export type KPIResponse = {
  tiempoRespuestaPromedio: number;
  tiempoLlegadaPromedio: number;
  incidentesAbiertos: number;
  incidentesPorSeveridad: Record<Severity, number>;
};

export type TrendPoint = { label: string; value: number };
export type TrendResponse = { porHora: TrendPoint[]; porDia: TrendPoint[] };
