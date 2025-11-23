# Integración con Backend API

Esta guía explica cómo usar la integración con el backend FastAPI del Metro Línea 1.

## 🌐 Backend URL

```
http://ec2-54-84-92-63.compute-1.amazonaws.com
```

## 📁 Estructura de Archivos

```
src/
├── config/
│   └── api.ts                 # Configuración de axios y URL base
├── services/
│   ├── metroApi.ts           # API del Metro (endpoints)
│   ├── fallDetectionApi.ts  # API de Fall Detection (endpoints)
│   └── hooks.ts              # Hooks de React Query
├── types.ts                  # Tipos TypeScript
└── components/
    └── MetroIntegrationExample.tsx  # Componente de ejemplo
```

## 🚀 Uso Rápido

### 1. Importar los hooks

```tsx
import {
  useLineStatus,
  useStations,
  useRecentFallDetections,
} from '../services/hooks'
```

### 2. Usar en tus componentes

```tsx
export const MiComponente = () => {
  // Obtener estado de la línea (se actualiza cada 3 segundos)
  const { data: lineStatus, isLoading, error } = useLineStatus()

  // Obtener estaciones (se actualiza cada 5 segundos)
  const { data: stations } = useStations()

  // Obtener incidentes recientes
  const { data: incidents } = useRecentFallDetections()

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {String(error)}</div>

  return (
    <div>
      <h1>{lineStatus?.line_name}</h1>
      <p>Trenes activos: {lineStatus?.active_trains.length}</p>

      <h2>Estaciones</h2>
      {stations?.map((station) => (
        <div key={station.id}>
          <h3>{station.name}</h3>
          <p>Saturación: {station.saturation}</p>
          <p>Personas esperando: {station.people_waiting}</p>
        </div>
      ))}
    </div>
  )
}
```

## 📊 Hooks Disponibles

### `useLineStatus()`

Obtiene el estado completo de la Línea 1 con todos los trenes activos.

**Actualización:** cada 3 segundos

```tsx
const { data, isLoading, error } = useLineStatus()

// data contiene:
// - line_name: string
// - route: string
// - saturation: 'low' | 'medium' | 'high' | 'critical'
// - incident_type: string
// - incident_message: string | null
// - last_updated: string
// - active_trains: Train[]
```

### `useStations()`

Obtiene información de todas las 20 estaciones de la Línea 1.

**Actualización:** cada 5 segundos

```tsx
const { data, isLoading } = useStations()

// data es un array de estaciones con:
// - id: string
// - name: string
// - latitude: number
// - longitude: number
// - saturation: 'low' | 'medium' | 'high' | 'critical'
// - estimated_wait_time: number
// - has_incident: boolean
// - people_waiting: number
// - next_train_arrival: number
```

### `useFallDetections(skip, limit)`

Obtiene todos los incidentes de caídas con paginación.

**Actualización:** cada 10 segundos

```tsx
const { data, isLoading } = useFallDetections(0, 100)

// data es un array de incidentes con:
// - id: number
// - image_url: string
// - station: string
// - detected_object: string
// - incident_datetime: string
// - created_at: string
```

### `useRecentFallDetections()`

Obtiene incidentes de las últimas 24 horas.

**Actualización:** cada 10 segundos

```tsx
const { data, isLoading } = useRecentFallDetections()
```

## 🔧 Funciones de API (sin hooks)

### Metro API

```tsx
import {
  getLineStatus,
  getStations,
  resetSimulation,
} from '../services/metroApi'

// Obtener estado de la línea
const status = await getLineStatus()

// Obtener estaciones
const stations = await getStations()

// Reiniciar simulación
const result = await resetSimulation()
```

### Fall Detection API

```tsx
import {
  getFallDetections,
  getFallDetectionById,
  createFallDetection,
  deleteFallDetection,
} from '../services/fallDetectionApi'

// Listar incidentes
const incidents = await getFallDetections(0, 100)

// Obtener incidente específico
const incident = await getFallDetectionById(1)

// Crear nuevo incidente
const result = await createFallDetection(
  imageFile, // File object
  'Observatorio', // Nombre de la estación
  'persona', // Objeto detectado
  new Date() // Fecha del incidente
)

// Eliminar incidente
await deleteFallDetection(1)
```

## 🎨 Ejemplo Completo

Revisa el componente `MetroIntegrationExample.tsx` para ver un ejemplo completo de cómo usar todos los hooks y funciones.

Para verlo en tu app, importa y usa el componente:

```tsx
import { MetroIntegrationExample } from './components/MetroIntegrationExample'

function App() {
  return (
    <div>
      <MetroIntegrationExample />
    </div>
  )
}
```

## 📝 Tipos TypeScript

Todos los tipos están definidos en `src/types.ts`:

- `LineStatus` - Estado de la línea
- `Train` - Información de un tren
- `Station` - Información de una estación
- `FallDetection` - Incidente de caída
- `MetroSaturation` - Nivel de saturación
- `MetroIncidentType` - Tipo de incidente

## 🔐 Autenticación (Opcional)

Si necesitas autenticación JWT, los tokens se manejan automáticamente:

```tsx
// Guardar token después del login
localStorage.setItem('auth_token', token)

// El interceptor de axios lo agregará automáticamente a todas las peticiones
```

## 🚨 Manejo de Errores

```tsx
const { data, isLoading, error } = useLineStatus()

if (error) {
  console.error('Error:', error)
  return <div>Error al cargar datos del metro</div>
}
```

## 🔄 Actualización Manual

Si necesitas forzar una actualización:

```tsx
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

// Refetch manual
queryClient.invalidateQueries({ queryKey: ['metro', 'line1', 'status'] })
```

## 🛠️ Configuración

Para cambiar la URL del backend, edita `src/config/api.ts`:

```tsx
export const API_BASE_URL = 'http://tu-servidor.com'
```

## 📱 Integración en Componentes Existentes

### En MapView.tsx

```tsx
import { useStations } from '../services/hooks'

export const MapView = () => {
  const { data: stations } = useStations()

  return (
    <Map>
      {stations?.map((station) => (
        <Marker
          key={station.id}
          latitude={station.latitude}
          longitude={station.longitude}
          color={getSaturationColor(station.saturation)}
        />
      ))}
    </Map>
  )
}
```

### En KPIStats.tsx

```tsx
import { useLineStatus, useRecentFallDetections } from '../services/hooks'

export const KPIStats = () => {
  const { data: lineStatus } = useLineStatus()
  const { data: incidents } = useRecentFallDetections()

  return (
    <div>
      <Stat label="Trenes activos" value={lineStatus?.active_trains.length} />
      <Stat label="Incidentes hoy" value={incidents?.length} />
      <Stat label="Saturación" value={lineStatus?.saturation} />
    </div>
  )
}
```

### En IncidentSidebar.tsx

```tsx
import { useRecentFallDetections } from '../services/hooks'

export const IncidentSidebar = () => {
  const { data: incidents, isLoading } = useRecentFallDetections()

  if (isLoading) return <Loading />

  return (
    <div>
      {incidents?.map((incident) => (
        <IncidentCard
          key={incident.id}
          station={incident.station}
          time={new Date(incident.incident_datetime).toLocaleString()}
          imageUrl={incident.image_url}
          object={incident.detected_object}
        />
      ))}
    </div>
  )
}
```

## ✅ Checklist de Integración

- [x] axios instalado
- [x] Configuración de API creada
- [x] Tipos TypeScript definidos
- [x] Servicios de Metro API creados
- [x] Servicios de Fall Detection API creados
- [x] Hooks personalizados creados
- [x] Componente de ejemplo creado
- [ ] Integrar en componentes existentes
- [ ] Probar con backend real
- [ ] Manejo de errores en UI
- [ ] Loading states en UI

## 🐛 Troubleshooting

### Error de CORS

Si ves errores de CORS, el backend ya debe tener CORS configurado. Si no:

```python
# En el backend (main.py)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Backend no responde

Verifica que el backend esté corriendo:

```bash
curl http://ec2-54-84-92-63.compute-1.amazonaws.com/metro/line1/status
```

### Datos no se actualizan

React Query cachea los datos. Para debugging, reduce los tiempos:

```tsx
refetchInterval: 1000 // actualizar cada segundo
```

## 📚 Recursos

- [React Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
- Backend README: Ver documentación del backend FastAPI
