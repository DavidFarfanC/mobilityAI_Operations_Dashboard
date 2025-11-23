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
  fotoUrl?: string;
  detalles?: string[];
  accionesSugeridas?: string[];
};

export type KPIResponse = {
  tiempoRespuestaPromedio: number;
  tiempoLlegadaPromedio: number;
  incidentesAbiertos: number;
  incidentesPorSeveridad: Record<Severity, number>;
};

export type TrendPoint = { label: string; value: number };
export type TrendResponse = { porHora: TrendPoint[]; porDia: TrendPoint[] };

// ===== TIPOS PARA LA API DEL BACKEND =====

// Tipos para el Metro (API)
export type MetroSaturation = 'low' | 'medium' | 'high' | 'critical';
export type MetroIncidentType = 'none' | 'delay' | 'maintenance' | 'accident' | 'crowding';
export type TrainDirection = 'Pantitlán' | 'Observatorio';

export interface Train {
  train_id: string;
  current_station: string;
  next_station: string;
  direction: TrainDirection;
  progress_to_next: number; // 0.0 a 1.0
  wagons: number;
  passengers_per_wagon: number[];
}

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  saturation: MetroSaturation;
  estimated_wait_time: number; // minutos
  has_incident: boolean;
  incident_message: string | null;
  people_waiting: number;
  next_train_arrival: number; // minutos
}

export interface LineStatus {
  line_name: string;
  route: string;
  saturation: MetroSaturation;
  incident_type: MetroIncidentType;
  incident_message: string | null;
  last_updated: string;
  active_trains: Train[];
}

// Tipos para Fall Detection (API)
export interface FallDetection {
  id: number;
  image_url: string;
  station: string;
  detected_object: string;
  incident_datetime: string;
  created_at: string;
}

export interface CreateFallDetectionRequest {
  image: File;
  station: string;
  detected_object: string;
  incident_datetime: string;
}

export interface FallDetectionResponse {
  message: string;
  fall_detection: FallDetection;
}

// Utilidad para transformar FallDetection a Incident
export function fallDetectionToIncident(fallDetection: FallDetection): Incident {
  const incidentDate = new Date(fallDetection.incident_datetime);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - incidentDate.getTime()) / 60000);
  
  // Determinar severidad basada en el tiempo transcurrido
  let severidad: Severity = 'media';
  if (diffMinutes < 5) severidad = 'critica';
  else if (diffMinutes < 15) severidad = 'alta';
  else if (diffMinutes < 60) severidad = 'media';
  else severidad = 'baja';
  
  // Determinar estado basado en el tiempo
  let estado: IncidentStatus = 'abierto';
  if (diffMinutes < 2) estado = 'abierto';
  else if (diffMinutes < 30) estado = 'en camino';
  else estado = 'resuelto';
  
  return {
    id: fallDetection.id.toString(),
    tipo: 'Caída detectada',
    descripcion: `Posible caída detectada en ${fallDetection.station}. Objeto: ${fallDetection.detected_object}`,
    hora: incidentDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    severidad,
    estado,
    linea: fallDetection.station,
    posicion: getStationCoordinates(fallDetection.station),
    fotoUrl: fallDetection.image_url,
    detalles: [
      `Hora de detección: ${incidentDate.toLocaleString('es-MX')}`,
      `Objeto detectado: ${fallDetection.detected_object}`,
      `ID del reporte: ${fallDetection.id}`,
    ],
    accionesSugeridas: [
      'Enviar personal médico a la estación',
      'Revisar cámaras de seguridad cercanas',
      'Contactar a servicios de emergencia si es necesario',
    ],
  };
}

// Coordenadas aproximadas de estaciones (se pueden ajustar con datos reales)
function getStationCoordinates(stationName: string): { lat: number; lng: number } {
  // Coordenadas base de la Línea 1 del Metro CDMX
  const stationCoords: Record<string, { lat: number; lng: number }> = {
    'Pantitlán': { lat: 19.4153, lng: -99.0730 },
    'Zaragoza': { lat: 19.4122, lng: -99.0820 },
    'Gómez Farías': { lat: 19.4170, lng: -99.0900 },
    'Boulevard Puerto Aéreo': { lat: 19.4190, lng: -99.0960 },
    'Balbuena': { lat: 19.4230, lng: -99.1020 },
    'Moctezuma': { lat: 19.4272, lng: -99.1123 },
    'San Lázaro': { lat: 19.4307, lng: -99.1150 },
    'Candelaria': { lat: 19.4289, lng: -99.1200 },
    'Merced': { lat: 19.4260, lng: -99.1240 },
    'Pino Suárez': { lat: 19.4260, lng: -99.1330 },
    'Isabel la Católica': { lat: 19.4262, lng: -99.1380 },
    'Salto del Agua': { lat: 19.4275, lng: -99.1420 },
    'Balderas': { lat: 19.4276, lng: -99.1492 },
    'Cuauhtémoc': { lat: 19.4261, lng: -99.1545 },
    'Insurgentes': { lat: 19.4243, lng: -99.1626 },
    'Sevilla': { lat: 19.4215, lng: -99.1708 },
    'Chapultepec': { lat: 19.4208, lng: -99.1761 },
    'Juanacatlán': { lat: 19.4120, lng: -99.1820 },
    'Tacubaya': { lat: 19.4035, lng: -99.1870 },
    'Observatorio': { lat: 19.3988, lng: -99.2010 },
  };
  
  return stationCoords[stationName] || { lat: 19.4326, lng: -99.1332 }; // Default: Centro CDMX
}
