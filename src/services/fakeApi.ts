import { baseIncidents } from '../constants/line1';
import { Incident, KPIResponse, Severity, TrendResponse } from '../types';

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const mutateIncident = (incident: Incident): Incident => {
  const severityShift: Severity[] = ['baja', 'media', 'alta', 'critica'];
  const severityIndex = severityShift.indexOf(incident.severidad);
  const bumped =
    Math.random() > 0.9 && severityIndex < severityShift.length - 1
      ? severityShift[severityIndex + 1]
      : incident.severidad;

  const estado =
    incident.estado === 'abierto' && Math.random() > 0.8
      ? 'en camino'
      : incident.estado === 'en camino' && Math.random() > 0.5
      ? 'resuelto'
      : incident.estado;

  return {
    ...incident,
    severidad: bumped,
    estado,
    hora: incident.hora,
  };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchIncidents = async (): Promise<Incident[]> => {
  await delay(350 + Math.random() * 300);
  return baseIncidents.map((incident) => mutateIncident(incident));
};

export const fetchKpis = async (): Promise<KPIResponse> => {
  await delay(250);
  const incidentes = await fetchIncidents();
  const incidentesAbiertos = incidentes.filter((i) => i.estado !== 'resuelto').length;

  const severidad: Record<Severity, number> = {
    baja: 0,
    media: 0,
    alta: 0,
    critica: 0,
  };
  incidentes.forEach((inc) => {
    severidad[inc.severidad] = (severidad[inc.severidad] || 0) + 1;
  });

  return {
    tiempoRespuestaPromedio: Math.round(randomBetween(6, 14)),
    tiempoLlegadaPromedio: Math.round(randomBetween(10, 22)),
    incidentesAbiertos,
    incidentesPorSeveridad: severidad,
  };
};

export const fetchTrend = async (): Promise<TrendResponse> => {
  await delay(200);
  const hours = Array.from({ length: 8 }).map((_, idx) => {
    const value = Math.round(randomBetween(2, 12));
    return { label: `${7 + idx}h`, value };
  });

  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((label) => ({
    label,
    value: Math.round(randomBetween(6, 22)),
  }));

  return { porHora: hours, porDia: days };
};
