# MobilityAI Operations Dashboard

SPA en React + Vite para monitorear incidentes en el Metro CDMX (Línea 1) con mapa interactivo, KPIs en vivo y simulación de trenes.

## Stack técnico
- React 18 + TypeScript (SPA rápida con tipado estricto).
- Vite para desarrollo y build.
- TailwindCSS para un tema oscuro minimalista.
- Framer Motion para animaciones.
- MapLibre GL para mapa vectorial (compatible con Mapbox GL JS).
- Zustand para estado UI (selección de incidente).
- TanStack React Query para datos simulados y polling.

## Ejecutar local
```bash
pnpm install   # o npm install / yarn
pnpm dev       # abre http://localhost:5173
```

## Estructura
- `src/App.tsx` layout principal con KPIs, mapa y sidebar.
- `src/components/MapView.tsx` integra MapLibre, traza Línea 1 y simula trenes/markers.
- `src/components/KPIStats.tsx` KPIs y tendencias dummy.
- `src/components/IncidentSidebar.tsx` lista + detalle de incidentes.
- `src/services/fakeApi.ts` y `src/services/hooks.ts` servicio simulado con React Query.
- `src/constants/line1.ts` coordenadas y estaciones de la línea.
- `src/store/uiStore.ts` estado global de selección.

## Notas de implementación
- Tema oscuro con acento verde (`accent`), sombras glass y fondo texturizado.
- Línea 1 dibujada con coordenadas reales aproximadas; markers en la posición del reporte.
- Trenes simulados avanzan sobre la polilínea mediante interpolación (haversine aproximado).
- Datos se refrescan con polling (`refetchInterval`) para dar sensación de vivo.
- Map style: `https://demotiles.maplibre.org/style.json` (puedes reemplazar por tu estilo/mapa privado).

## Escalabilidad y producción
- Multi-sistema: añade más líneas en `constants/` y cambia la fuente GeoJSON dinámica por API/BD.
- Estado/datos: React Query ya listo para conectar a API real; ajusta `refetchInterval` o usa WebSockets/SSE para tiempo real real.
- SSR/SEO: Next.js o Remix si necesitas server rendering; Vite + SPA ok para panel interno.
- Mapas: servir estilos vectoriales propios (Mapbox/MapTiler/MapLibre server) y cache CDN.
- Realtime: usa WebSockets para movimiento de trenes y actualizaciones de incidentes; persistir en Redis + cola (Kafka/NATS) para ingestión masiva.
- Observabilidad: logging estructurado + métricas de rendimiento (Web Vitals) y error tracking (Sentry).
- AI: clasificar severidad automáticamente (modelo liviano) y priorizar respuesta; summary generativo por incidente.

## Configurable
- Tokens mapa: define `VITE_MAP_STYLE_URL` o `VITE_MAP_TOKEN` y úsalo en `MapView`.
- Colores/tema: ajustar en `tailwind.config.cjs`.
- Intervalos: modificar los `refetchInterval` en `src/services/hooks.ts`.
