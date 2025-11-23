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
    id: 'INC-001',
    tipo: 'Retraso',
    descripcion: 'Tren detenido por revisión preventiva en Tacubaya.',
    hora: '08:12',
    severidad: 'media',
    estado: 'en camino',
    linea: 'Línea 1',
    posicion: { lat: 19.404, lng: -99.1873 },
    fotoUrl: 'https://res.cloudinary.com/dkucopkow/image/upload/v1763871821/62c5b8b0b1c22557109747_awqk2f.jpg',
    detalles: [
      'Tren detenido 3 minutos por revisión preventiva.',
      'Reporte inicial desde puesto de control central.',
      'Se detectó posible anomalía en sistema de frenos.',
    ],
    accionesSugeridas: [
      'Confirmar tiempo estimado de reanudación.',
      'Comunicar mensaje a usuarios en andén y tren.',
      'Validar con mantenimiento si requiere retiro de tren.',
    ],
  },
  {
    id: 'INC-002',
    tipo: 'Aglomeración',
    descripcion: 'Alta demanda y acumulación en andén Insurgentes.',
    hora: '08:25',
    severidad: 'alta',
    estado: 'abierto',
    linea: 'Línea 1',
    posicion: { lat: 19.4258, lng: -99.1682 },
    detalles: [
      'Flujo de ingreso +18% vs promedio.',
      'Retrasos previos incrementan tiempo de espera.',
      'Se observan filas hasta salida de torniquetes.',
    ],
    accionesSugeridas: [
      'Solicitar apoyo de vigilancia para ordenar flujo.',
      'Ajustar cadencia de trenes si es posible.',
      'Enviar aviso por app a usuarios frecuentes.',
    ],
  },
  {
    id: 'INC-003',
    tipo: 'Falla técnica',
    descripcion: 'Puerta no cierra correctamente en Candelaria.',
    hora: '08:41',
    severidad: 'critica',
    estado: 'abierto',
    linea: 'Línea 1',
    posicion: { lat: 19.4289, lng: -99.1221 },
    detalles: [
      'Sensor de cierre de puerta marca error intermitente.',
      'Conductor reporta tiempo extra en cada estación.',
      'Pasajeros tuvieron que cambiar de vagón.',
    ],
    accionesSugeridas: [
      'Programar retiro del tren en siguiente terminal.',
      'Coordinar técnico en andén para revisión rápida.',
      'Actualizar ETA de trenes siguientes.',
    ],
  },
  {
    id: 'INC-004',
    tipo: 'Persona en vía',
    descripcion: 'Reporte visual de persona en zona de vías San Lázaro.',
    hora: '08:55',
    severidad: 'alta',
    estado: 'en camino',
    linea: 'Línea 1',
    posicion: { lat: 19.4328, lng: -99.1168 },
    detalles: [
      'CCTV detecta figura entre carriles 2 y 3.',
      'Se activa protocolo de corte de corriente parcial.',
      'Personal de seguridad se dirige al punto.',
    ],
    accionesSugeridas: [
      'Confirmar corte de energía en tramo afectado.',
      'Alertar a conductores en ambos sentidos.',
      'Coordinar con policía para retiro seguro.',
    ],
  },
  {
    id: 'INC-005',
    tipo: 'Mantenimiento',
    descripcion: 'Revisión de señalización en Observatorio.',
    hora: '09:10',
    severidad: 'baja',
    estado: 'resuelto',
    linea: 'Línea 1',
    posicion: { lat: 19.3986, lng: -99.2009 },
    detalles: [
      'Ajuste de luminarias en señal de cambio de vía.',
      'Se usó brigada nocturna para minimizar impacto.',
      'Sin afectaciones al servicio reportadas.',
    ],
    accionesSugeridas: [
      'Cerrar ticket con fotos finales.',
      'Registrar repuesto utilizado en inventario.',
      'Comunicar cierre en bitácora de mantenimiento.',
    ],
  },
];
