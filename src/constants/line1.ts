import { Incident } from '../types';

export const linea1Coordinates: [number, number][] = [
  [-99.2009, 19.3986], // Observatorio
  [-99.1873, 19.404], // Tacubaya
  [-99.1821, 19.411], // Juanacatlan
  [-99.1774, 19.4206], // Chapultepec
  [-99.1732, 19.4246], // Sevilla
  [-99.1682, 19.4258], // Insurgentes
  [-99.1577, 19.4256], // Cuauhtemoc
  [-99.1437, 19.4254], // Balderas
  [-99.1391, 19.4232], // Salto del Agua
  [-99.1345, 19.425], // Isabel la Católica
  [-99.1322, 19.4277], // Pino Suarez
  [-99.1263, 19.4261], // Merced
  [-99.1221, 19.4289], // Candelaria
  [-99.1168, 19.4328], // San Lázaro
  [-99.1079, 19.4328], // Moctezuma
  [-99.1021, 19.4278], // Balbuena
  [-99.0954, 19.4236], // Blvd Puerto Aéreo
  [-99.0885, 19.4173], // Gómez Farías
  [-99.0837, 19.4133], // Zaragoza
  [-99.072, 19.4156], // Pantitlán
];

export const linea1Stations = [
  'Observatorio',
  'Tacubaya',
  'Juanacatlán',
  'Chapultepec',
  'Sevilla',
  'Insurgentes',
  'Cuauhtémoc',
  'Balderas',
  'Salto del Agua',
  'Isabel la Católica',
  'Pino Suárez',
  'Merced',
  'Candelaria',
  'San Lázaro',
  'Moctezuma',
  'Balbuena',
  'Blvd. Puerto Aéreo',
  'Gómez Farías',
  'Zaragoza',
  'Pantitlán',
];

export const baseIncidents: Incident[] = [
  {
    id: 'inc-l1-001',
    tipo: 'Retraso en servicio',
    severidad: 'media',
    linea: 'Línea 1',
    descripcion: 'Retraso moderado por alta afluencia de pasajeros',
    hora: new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    estado: 'abierto',
    posicion: { lat: 19.4277, lng: -99.1322 },
  },
  {
    id: 'inc-l1-002',
    tipo: 'Saturación',
    severidad: 'alta',
    linea: 'Línea 1',
    descripcion: 'Estación con alta saturación',
    hora: new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    estado: 'abierto',
    posicion: { lat: 19.4326, lng: -99.1332 },
  },
  {
    id: 'inc-l1-003',
    tipo: 'Mantenimiento',
    severidad: 'baja',
    linea: 'Línea 1',
    descripcion: 'Mantenimiento programado',
    hora: new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    estado: 'resuelto',
    posicion: { lat: 19.4208, lng: -99.1761 },
  },
];