# Integración de Fall Detection API

## ✅ Cambios Implementados

### 1. Transformación de Datos

Se agregó la función `fallDetectionToIncident()` en `src/types.ts` que convierte los datos de Fall Detection del backend al formato Incident del frontend:

- **Severidad**: Se calcula automáticamente según el tiempo transcurrido desde la detección

  - `critica`: < 5 minutos
  - `alta`: 5-15 minutos
  - `media`: 15-60 minutos
  - `baja`: > 60 minutos

- **Estado**: Se determina por el tiempo transcurrido

  - `abierto`: < 2 minutos
  - `en camino`: 2-30 minutos
  - `resuelto`: > 30 minutos

- **Coordenadas**: Se incluye un mapa de las 20 estaciones de la Línea 1 del Metro CDMX

### 2. Hook de React Query

Ya existe el hook `useFallDetections()` en `src/services/hooks.ts`:

- Se actualiza cada 10 segundos
- Obtiene los últimos 50 registros por defecto
- Manejo automático de caché y revalidación

### 3. Integración en App.tsx

El componente principal ahora:

- Obtiene fall detections del backend en tiempo real
- Los transforma a incidents
- Los muestra en el mapa, sidebar y modal de detalles
- Mantiene los datos fake de KPIs (por migrar después)

### 4. Visualización en el Mapa

Los incidentes de fall detection ahora se muestran en el mapa con:

- Marcador personalizable (`/incident-icon.png`)
- InfoWindow con toda la información del incidente
- Imagen de la detección (si está disponible)
- Botón para ver detalles completos
- Click en el botón abre el modal de detalles

## 📦 Estructura de Datos

### Backend (Fall Detection)

```typescript
{
  id: number,
  image_url: string,
  station: string,
  detected_object: string,
  incident_datetime: string,
  created_at: string
}
```

### Frontend (Incident)

```typescript
{
  id: string,
  tipo: "Caída detectada",
  descripcion: string,
  hora: string,
  severidad: "baja" | "media" | "alta" | "critica",
  estado: "abierto" | "en camino" | "resuelto",
  linea: string,
  posicion: { lat: number, lng: number },
  fotoUrl: string,
  detalles: string[],
  accionesSugeridas: string[]
}
```

## 🎨 Personalización de Iconos

Para personalizar el ícono de los incidentes en el mapa:

1. Coloca tu imagen en `public/incident-icon.png`
2. Formato recomendado: PNG con fondo transparente
3. Tamaño: 24x24 px o 48x48 px
4. El icono se centra automáticamente en las coordenadas

Si quieres usar el ícono circular predeterminado, cambia en `MapView.tsx`:

```typescript
icon: {
  path: google.maps.SymbolPath.CIRCLE,
  scale: 6,
  fillColor: getIncidentColor(incident.severidad),
  fillOpacity: 0.9,
  strokeColor: '#ffffff',
  strokeWeight: 2,
}
```

## 🚀 Probar la Integración

### 1. Verificar Backend

```bash
# Verificar que el backend está corriendo
curl http://ec2-54-84-92-63.compute-1.amazonaws.com/falldetection
```

### 2. Iniciar Frontend

```bash
yarn dev
```

### 3. Verificar en el Dashboard

- Los incidentes deberían aparecer en el sidebar derecho
- Los marcadores deberían mostrarse en el mapa
- Click en un marcador muestra el InfoWindow con detalles
- Click en "Ver detalles" abre el modal completo
- Los datos se actualizan cada 10 segundos automáticamente

## 🔧 Solución de Problemas

### No se muestran incidentes

1. Verificar que el backend está corriendo y accesible
2. Revisar la consola del navegador para errores de CORS o red
3. Verificar que hay datos en el backend: `GET /falldetection`

### Errores de CORS

Si ves errores de CORS en la consola, el backend necesita agregar:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Imágenes no se cargan

Verificar que las URLs de S3 son públicas o tienen las credenciales correctas.

## 📊 Próximos Pasos

1. ✅ Fall Detection integrado
2. ⏳ Migrar KPIs a datos reales del backend
3. ⏳ Calcular estadísticas reales de los fall detections
4. ⏳ Agregar filtros específicos para fall detection
5. ⏳ Implementar notificaciones en tiempo real (WebSocket)
6. ⏳ Dashboard de analytics para fall detection

## 🔗 Enlaces Útiles

- Backend API: http://ec2-54-84-92-63.compute-1.amazonaws.com
- Documentación API: http://ec2-54-84-92-63.compute-1.amazonaws.com/docs
- Google Maps API: https://developers.google.com/maps
