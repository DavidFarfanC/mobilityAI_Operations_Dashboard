# Integración de Google Maps con Backend

El mapa del dashboard ahora usa **Google Maps** y se conecta en tiempo real con el **backend del Metro Línea 1**.

## 🗺️ Características del Mapa

### Datos en Tiempo Real (cada 3 segundos)
- ✅ 20 estaciones de la Línea 1 con coordenadas reales
- ✅ 7 trenes activos moviéndose en tiempo real
- ✅ Nivel de saturación por estación
- ✅ Personas esperando en cada estación
- ✅ Tiempo estimado de llegada del próximo tren
- ✅ Incidentes reportados por el sistema
- ✅ Reportes ciudadanos de incidentes

### Visualización Interactiva
- 🎯 **Marcadores de estaciones**: Coloreados según nivel de saturación
  - Verde: Saturación baja
  - Ámbar: Saturación media
  - Rojo: Saturación alta
  - Rojo oscuro: Saturación crítica

- 🚇 **Marcadores de trenes**: Se mueven automáticamente entre estaciones
  - Muestra ID del tren
  - Dirección (Observatorio ↔ Pantitlán)
  - Ocupación por vagón
  - Progreso entre estaciones

- ⚠️ **Marcadores de incidentes**: Reportes ciudadanos
  - Coloreados según severidad
  - Clickeables para ver detalles

## 🔑 Configuración de Google Maps API Key

### 1. Obtener API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo o selecciona uno existente
3. Habilita las siguientes APIs:
   - **Maps JavaScript API**
   - **Places API** (opcional)
4. Ve a "Credentials" y crea una API Key
5. Copia tu API Key

### 2. Configurar en el Proyecto

Edita el archivo `.env` en la raíz del proyecto:

```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSyB_tu_api_key_aqui
VITE_API_BASE_URL=http://ec2-54-84-92-63.compute-1.amazonaws.com
```

**Nota:** Ya existe una API Key configurada en el archivo `.env`, pero puedes usar la tuya propia.

### 3. Restricciones de Seguridad (Recomendado)

En Google Cloud Console, restringe tu API Key:

1. **Restricciones de aplicación:**
   - Selecciona "Restricciones de HTTP referer"
   - Agrega: `http://localhost:*/*` (desarrollo)
   - Agrega: `https://tudominio.com/*` (producción)

2. **Restricciones de API:**
   - Limita a "Maps JavaScript API"

## 🎮 Interactividad del Mapa

### Click en Estaciones
Al hacer click en una estación, se muestra:
- Nombre de la estación
- Nivel de saturación
- Número de personas esperando
- Tiempo de espera estimado
- Tiempo de llegada del próximo tren
- Mensaje de incidente (si existe)

### Click en Trenes
Al hacer click en un tren, se muestra:
- ID del tren (ej: T101)
- Dirección (Observatorio/Pantitlán)
- Estación actual y siguiente
- Progreso entre estaciones (%)
- Número de vagones
- Pasajeros totales
- Ocupación por vagón (con código de colores)

### Click en Incidentes
Al hacer click en un reporte ciudadano:
- Se abre el modal con detalles completos
- Se muestra en el sidebar de incidentes

## 📊 Panel de Información

En la esquina superior izquierda del mapa:
- Nombre de la línea y ruta
- Alertas de incidentes (si existen)
- Estadísticas rápidas:
  - Número de trenes activos
  - Total de personas esperando
  - Incidentes en estaciones
- Leyenda de colores de saturación
- Indicador de actualización automática

## 🔄 Actualización Automática

El mapa se actualiza automáticamente:
- **Cada 3 segundos**: Estado de línea y posición de trenes
- **Cada 5 segundos**: Estado de estaciones
- No requiere refrescar la página

## 🎨 Estilos Personalizados

El mapa usa un tema oscuro personalizado que combina con el diseño del dashboard:
- Geometría en tonos oscuros (#242f3e)
- Agua en color oscuro (#17263c)
- Carreteras en gris (#2b3544)
- Puntos de interés destacados

## 🚀 Uso en Componentes

El mapa ya está integrado en `App.tsx`. Si necesitas usarlo en otro lugar:

```tsx
import MapView from './components/MapView';
import { useIncidents } from './services/hooks';

function MiComponente() {
  const { data: incidents = [], isLoading } = useIncidents();
  
  return (
    <div className="h-screen">
      <MapView incidents={incidents} isLoading={isLoading} />
    </div>
  );
}
```

## 🐛 Solución de Problemas

### Error: "Google Maps API Key no configurada"

**Solución:** Verifica que el archivo `.env` tenga la variable:
```bash
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
```

Reinicia el servidor de desarrollo:
```bash
yarn dev
```

### Error: "This page can't load Google Maps correctly"

**Causas posibles:**
1. API Key inválida o vencida
2. APIs no habilitadas en Google Cloud Console
3. Restricciones de dominio muy estrictas
4. Límites de uso excedidos

**Solución:**
1. Verifica tu API Key en Google Cloud Console
2. Asegúrate de tener habilitada "Maps JavaScript API"
3. Revisa las restricciones de la API Key
4. Verifica el uso en el dashboard de Google Cloud

### Los trenes no se mueven

**Causa:** El backend no está respondiendo o está caído

**Solución:**
1. Verifica la conexión al backend:
   ```bash
   curl http://ec2-54-84-92-63.compute-1.amazonaws.com/metro/line1/status
   ```
2. Revisa la consola del navegador para errores
3. Verifica que el backend esté corriendo

### Las estaciones no aparecen

**Causa:** Error al obtener datos del backend

**Solución:**
1. Verifica la URL del backend en `.env`
2. Revisa errores de CORS en la consola
3. Verifica que el endpoint `/metro/line1/stations` responda

## 📈 Optimizaciones

### Rendimiento
- Los marcadores se crean una sola vez
- Las posiciones se interpolan en el cliente
- React Query cachea las respuestas del backend

### Uso de API
- Un solo mapa por página
- Estilos cargados una vez
- Sin recargas innecesarias

## 🔐 Seguridad

- La API Key se expone en el frontend (normal para Google Maps)
- Usa restricciones de dominio para proteger la key
- No incluyas la key en repositorios públicos (usa `.env`)
- Considera usar variables de entorno del servidor en producción

## 📱 Responsive

El mapa se adapta automáticamente:
- Desktop: Altura completa de la sección
- Tablet: 480px de altura mínima
- Mobile: Se ajusta al contenedor

## 🎯 Próximos Pasos

Puedes mejorar el mapa agregando:
- [ ] Filtros de saturación/incidentes
- [ ] Búsqueda de estaciones
- [ ] Rutas sugeridas
- [ ] Predicción de tiempo de viaje
- [ ] Heat map de saturación
- [ ] Histórico de incidentes
- [ ] Notificaciones en tiempo real
- [ ] Geolocalización del usuario

## 📚 Referencias

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [React Google Maps (@vis.gl)](https://visgl.github.io/react-google-maps/)
- [Backend API Documentation](./INTEGRATION_GUIDE.md)
