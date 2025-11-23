import { Incident } from '../types'

export const linea2Coordinates: [number, number][] = [
  [-99.2043, 19.4589], // Cuatro Caminos
  [-99.1954, 19.4589], // Panteones
  [-99.1876, 19.4589], // Tacuba
  [-99.1803, 19.4543], // Cuitláhuac
  [-99.1721, 19.4489], // Popotla
  [-99.1634, 19.4453], // Colegio Militar
  [-99.1544, 19.4407], // Normal
  [-99.1468, 19.4371], // San Cosme
  [-99.1415, 19.4365], // Revolución
  [-99.1414, 19.4371], // Hidalgo
  [-99.1415, 19.4365], // Bellas Artes
  [-99.1345, 19.4283], // Allende
  [-99.1322, 19.4277], // Zócalo
  [-99.1322, 19.4277], // Pino Suárez (Transfer)
  [-99.1237, 19.4122], // San Antonio Abad
  [-99.1276, 19.3998], // Chabacano
  [-99.1356, 19.3899], // Viaducto
  [-99.1421, 19.3761], // Xola
  [-99.1474, 19.3627], // Villa de Cortés
  [-99.1534, 19.3489], // Nativitas
  [-99.1589, 19.3412], // Portales
  [-99.1642, 19.3354], // Ermita
  [-99.1701, 19.3245], // General Anaya
  [-99.1875, 19.3234], // Tasqueña
]

export const linea2Stations = [
  'Cuatro Caminos',
  'Panteones',
  'Tacuba',
  'Cuitláhuac',
  'Popotla',
  'Colegio Militar',
  'Normal',
  'San Cosme',
  'Revolución',
  'Hidalgo',
  'Bellas Artes',
  'Allende',
  'Zócalo',
  'Pino Suárez',
  'San Antonio Abad',
  'Chabacano',
  'Viaducto',
  'Xola',
  'Villa de Cortés',
  'Nativitas',
  'Portales',
  'Ermita',
  'General Anaya',
  'Tasqueña',
]

export const line2BaseIncidents: Incident[] = [
  {
    id: 'inc-l2-001',
    tipo: 'Retraso',
    severidad: 'media',
    linea: 'Línea 2',
    descripcion: 'Retraso moderado por alta afluencia de pasajeros',
    hora: new Date().toISOString(),
    estado: 'abierto',
    posicion: { lat: 19.4365, lng: -99.1415 },
  },
  {
    id: 'inc-l2-002',
    tipo: 'Saturación',
    severidad: 'alta',
    linea: 'Línea 2',
    descripcion: 'Estación con alta saturación',
    hora: new Date().toISOString(),
    estado: 'abierto',
    posicion: { lat: 19.3234, lng: -99.1875 },
  },
  {
    id: 'inc-l2-003',
    tipo: 'Mantenimiento',
    severidad: 'baja',
    linea: 'Línea 2',
    descripcion: 'Mantenimiento programado en andén 2',
    hora: new Date().toISOString(),
    estado: 'resuelto',
    posicion: { lat: 19.4453, lng: -99.1634 },
  },
]
