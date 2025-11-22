import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl, { Map as MapLibreMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion } from 'framer-motion';
import { linea1Coordinates, linea1Stations } from '../constants/line1';
import { Incident } from '../types';
import { useUiStore } from '../store/uiStore';
import { TrainIcon } from './ui/icons';

type Props = {
  incidents: Incident[];
  isLoading?: boolean;
};

type Train = { id: string; progress: number; speed: number };

const MAP_STYLE = 'https://demotiles.maplibre.org/style.json';

function MapView({ incidents, isLoading }: Props) {
  const mapRef = useRef<MapLibreMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const incidentMarkers = useRef<Map<string, Marker>>(new Map());
  const trainMarkers = useRef<Map<string, Marker>>(new Map());
  const { setSelectedIncident } = useUiStore();
  const [trains, setTrains] = useState<Train[]>(() =>
    Array.from({ length: 3 }).map((_, idx) => ({
      id: `T-${idx + 1}`,
      progress: Math.random(),
      speed: 0.005 + Math.random() * 0.003,
    }))
  );

  const lineGeoJson = useMemo(
    () => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: linea1Coordinates,
      },
      properties: { name: 'Línea 1' },
    }),
    []
  );

  const cumulativeLine = useMemo(() => cumulativeDistances(linea1Coordinates), []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [-99.13, 19.42],
      zoom: 11.3,
      attributionControl: false,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    mapRef.current.on('load', () => {
      if (!mapRef.current) return;
      // Fuente/linea principal
      mapRef.current.addSource('linea1', {
        type: 'geojson',
        data: lineGeoJson,
      });
      mapRef.current.addLayer({
        id: 'linea1-path',
        type: 'line',
        source: 'linea1',
        paint: {
          'line-color': '#7ae582',
          'line-width': 5,
          'line-opacity': 0.9,
        },
      });

      mapRef.current.addLayer({
        id: 'linea1-stops',
        type: 'circle',
        source: 'linea1',
        paint: {
          'circle-radius': 4,
          'circle-color': '#1f2937',
          'circle-stroke-color': '#7ae582',
          'circle-stroke-width': 1.5,
        },
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lineGeoJson]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateMarkers = () => {
      incidentMarkers.current.forEach((marker) => marker.remove());
      incidentMarkers.current.clear();

      incidents.forEach((incident) => {
        // Marker sencillo por incidente
        const el = document.createElement('div');
        el.className =
          'w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer bg-accent';
        el.title = `${incident.tipo} (${incident.severidad})`;
        el.addEventListener('click', () => setSelectedIncident(incident.id));
        const marker = new maplibregl.Marker(el)
          .setLngLat([incident.posicion.lng, incident.posicion.lat])
          .addTo(map);
        incidentMarkers.current.set(incident.id, marker);
      });
    };

    if (map.isStyleLoaded()) {
      updateMarkers();
    } else {
      map.once('load', updateMarkers);
    }

    return () => {
      map.off('load', updateMarkers);
      incidentMarkers.current.forEach((marker) => marker.remove());
      incidentMarkers.current.clear();
    };
  }, [incidents, setSelectedIncident]);

  useEffect(() => {
    const id = setInterval(() => {
      setTrains((prev) =>
        prev.map((train) => {
          // Progreso circular en la linea
          const next = train.progress + train.speed;
          return { ...train, progress: next > 1 ? next - 1 : next };
        })
      );
    }, 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    trains.forEach((train) => {
      const point = interpolateOnLine(linea1Coordinates, cumulativeLine, train.progress);
      const markerEl = document.createElement('div');
      markerEl.className =
        'w-8 h-8 rounded-full bg-accent/20 border border-accent/60 grid place-items-center shadow-glass';
      const svg = document.createElement('div');
      svg.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#7ae582" stroke-width="1.8"><rect x="6" y="3" width="12" height="14" rx="2"/><path d="M6 11h12"/><circle cx="9" cy="16.5" r="1"/><circle cx="15" cy="16.5" r="1"/><path d="m8 21 2-2h4l2 2"/></svg>`;
      svg.className = 'w-4 h-4';
      markerEl.appendChild(svg);

      const existing = trainMarkers.current.get(train.id);
      if (existing) {
        existing.setLngLat(point).addTo(mapRef.current);
      } else {
        const newMarker = new maplibregl.Marker(markerEl).setLngLat(point).addTo(mapRef.current);
        trainMarkers.current.set(train.id, newMarker);
      }
    });
  }, [cumulativeLine, trains]);

  return (
    <div className="relative h-[480px] xl:h-full">
      <div ref={containerRef} className="h-full w-full" />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-slate/80 backdrop-blur-sm border border-slate/60 rounded-2xl p-3 text-sm text-muted shadow-glass"
      >
        <p className="text-white font-semibold font-display text-lg">Línea 1 · Metro CDMX</p>
        <p>Simulación de trenes y reportes ciudadanos</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {linea1Stations.slice(0, 5).map((name) => (
            <span key={name} className="px-2 py-1 text-xs rounded-lg bg-accent/10 text-accent">
              {name}
            </span>
          ))}
          <span className="px-2 py-1 text-xs rounded-lg bg-slate/80 border border-slate/60">
            +{linea1Stations.length - 5} estaciones
          </span>
        </div>
      </motion.div>
      {isLoading && (
        <div className="absolute inset-0 grid place-items-center bg-graphite/70 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-muted">
            <TrainIcon className="h-5 w-5 animate-pulse" />
            Cargando incidentes...
          </div>
        </div>
      )}
    </div>
  );
}

export default MapView;

const toRadians = (deg: number) => (deg * Math.PI) / 180;

// Lightweight distance approximation to keep trains moving smoothly.
const haversineDistance = (a: [number, number], b: [number, number]) => {
  const R = 6371;
  const dLat = toRadians(b[1] - a[1]);
  const dLon = toRadians(b[0] - a[0]);
  const lat1 = toRadians(a[1]);
  const lat2 = toRadians(b[1]);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const c = 2 * Math.atan2(
    Math.sqrt(sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon),
    Math.sqrt(1 - sinLat * sinLat - Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon)
  );

  return R * c;
};

const cumulativeDistances = (coords: [number, number][]) => {
  const distances = [0];
  for (let i = 1; i < coords.length; i++) {
    distances[i] = distances[i - 1] + haversineDistance(coords[i - 1], coords[i]);
  }
  return distances;
};

const interpolateOnLine = (
  coords: [number, number][],
  cumulative: number[],
  progress: number
): [number, number] => {
  const total = cumulative[cumulative.length - 1];
  let target = progress * total;
  for (let i = 1; i < cumulative.length; i++) {
    if (target <= cumulative[i]) {
      const segment = cumulative[i] - cumulative[i - 1];
      const ratio = segment === 0 ? 0 : (target - cumulative[i - 1]) / segment;
      const lng = coords[i - 1][0] + (coords[i][0] - coords[i - 1][0]) * ratio;
      const lat = coords[i - 1][1] + (coords[i][1] - coords[i - 1][1]) * ratio;
      return [lng, lat];
    }
  }
  return coords[coords.length - 1];
};
