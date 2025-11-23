# MobilityAI Operations Dashboard

Panel SPA en React + Vite para ver incidentes de la Línea 1 con mapa, KPIs y simulación de trenes.

## Correr rápido
```bash
npm install   # o pnpm / yarn
npm run dev   # http://localhost:5173
```
.
## Cosas clave
- React + TS + Tailwind (tema oscuro con verde).
- MapLibre para el mapa; Framer Motion para animaciones.
- Datos dummy con React Query + Zustand para selección y filtros.
- Gráficas ligeras con Recharts (tendencias, severidad, estados).

## Rutas útiles
- `src/App.tsx` arma el layout.
- `src/components/MapView.tsx` pinta la línea, markers y trenes.
- `src/services/fakeApi.ts` datos simulados.
- `src/constants/line1.ts` coords y estaciones.

## Para escalar luego
- Cambiar fake API por API real/WebSockets.
- Mover estilos de mapa a tu propio style server.
- Si se necesita SSR/SEO, migrar a Next/Remix.
