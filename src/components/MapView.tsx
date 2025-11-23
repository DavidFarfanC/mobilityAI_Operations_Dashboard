import { useMemo, useState, useEffect, useRef } from 'react'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { motion } from 'framer-motion'
import { GOOGLE_MAPS_API_KEY } from '../config/api'
import {
  Incident,
  Train as BackendTrain,
  Station as BackendStation,
} from '../types'
import { useUiStore } from '../store/uiStore'
import {
  useLineStatus,
  useStations,
  useLine2Status,
  useLine2Stations,
} from '../services/hooks'
import { TrainIcon } from './ui/icons'

type Props = {
  incidents: Incident[]
  isLoading?: boolean
}

const getSaturationColor = (saturation: string): string => {
  switch (saturation) {
    case 'low':
      return '#10b981'
    case 'medium':
      return '#f59e0b'
    case 'high':
      return '#ef4444'
    case 'critical':
      return '#991b1b'
    default:
      return '#7ae582'
  }
}

const getIncidentColor = (severity: string): string => {
  switch (severity) {
    case 'baja':
      return '#10b981'
    case 'media':
      return '#f59e0b'
    case 'alta':
      return '#ef4444'
    case 'critica':
      return '#991b1b'
    default:
      return '#7ae582'
  }
}

// Componente que usa useMap para acceder a la instancia del mapa
function MapContent({
  line1Stations,
  line1Status,
  line2Stations,
  line2Status,
  incidents,
  setSelectedIncident,
  selectedLine,
}: {
  line1Stations?: BackendStation[]
  line1Status: any
  line2Stations?: BackendStation[]
  line2Status: any
  incidents: Incident[]
  setSelectedIncident: (id: string) => void
  selectedLine: 'all' | 'L1' | 'L2'
}) {
  const map = useMap()
  const markersRef = useRef<google.maps.Marker[]>([])
  const lineRef = useRef<google.maps.Polyline | null>(null)
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  useEffect(() => {
    if (!map || !window.google) return

    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    if (lineRef.current) {
      lineRef.current.setMap(null)
    }

    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow()
    }

    // Dibujar Línea 1 (rosa)
    if (line1Stations && line1Stations.length > 0 && selectedLine !== 'L2') {
      const linePath = line1Stations.map((s) => ({
        lat: s.latitude,
        lng: s.longitude,
      }))
      const line1 = new google.maps.Polyline({
        path: linePath,
        geodesic: true,
        strokeColor: '#ec4899',
        strokeOpacity: 0.9,
        strokeWeight: 5,
      })
      line1.setMap(map)
    }

    // Dibujar Línea 2 (azul)
    if (line2Stations && line2Stations.length > 0 && selectedLine !== 'L1') {
      const linePath = line2Stations.map((s) => ({
        lat: s.latitude,
        lng: s.longitude,
      }))
      const line2 = new google.maps.Polyline({
        path: linePath,
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.9,
        strokeWeight: 5,
      })
      line2.setMap(map)
    }

    // Renderizar estaciones de ambas líneas
    const allStations = [
      ...(selectedLine !== 'L2' && line1Stations ? line1Stations : []),
      ...(selectedLine !== 'L1' && line2Stations ? line2Stations : []),
    ]

    allStations.forEach((station) => {
      const marker = new google.maps.Marker({
        position: { lat: station.latitude, lng: station.longitude },
        map,
        title: station.name,
        icon: {
          url: '/station-icon.png', // Reemplaza con la ruta de tu imagen
          scaledSize: new google.maps.Size(
            station.has_incident ? 40 : 32,
            station.has_incident ? 40 : 32
          ),
          anchor: new google.maps.Point(
            station.has_incident ? 20 : 16,
            station.has_incident ? 20 : 16
          ),
        },
      })

      marker.addListener('click', () => {
        const content = `
          <div style="padding: 8px; max-width: 250px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${
              station.name
            }</h3>
            <div style="font-size: 14px;">
              <p><strong>Saturación:</strong> <span style="padding: 2px 8px; border-radius: 4px; background-color: ${getSaturationColor(
                station.saturation
              )}; color: white;">${station.saturation}</span></p>
              <p><strong>Personas esperando:</strong> ${
                station.people_waiting
              }</p>
              <p><strong>Próximo tren:</strong> ${
                station.next_train_arrival
              } min</p>
              ${
                station.has_incident
                  ? `<p style="color: #ef4444; font-weight: 600;">⚠️ ${station.incident_message}</p>`
                  : ''
              }
            </div>
          </div>
        `
        infoWindowRef.current?.setContent(content)
        infoWindowRef.current?.open(map, marker)
      })

      markersRef.current.push(marker)
    })

    // Renderizar trenes de ambas líneas
    const allTrains = [
      ...(selectedLine !== 'L2' && line1Status?.active_trains
        ? line1Status.active_trains.map((t: any) => ({ ...t, line: 'L1' }))
        : []),
      ...(selectedLine !== 'L1' && line2Status?.active_trains
        ? line2Status.active_trains.map((t: any) => ({ ...t, line: 'L2' }))
        : []),
    ]

    allTrains.forEach((train: BackendTrain & { line: string }) => {
      const stationsToSearch =
        train.line === 'L1' ? line1Stations : line2Stations
      const currentStation = stationsToSearch?.find(
        (s) => s.name === train.current_station
      )
      const nextStation = stationsToSearch?.find(
        (s) => s.name === train.next_station
      )

      if (!currentStation || !nextStation) return

      const lat =
        currentStation.latitude +
        (nextStation.latitude - currentStation.latitude) *
          train.progress_to_next
      const lng =
        currentStation.longitude +
        (nextStation.longitude - currentStation.longitude) *
          train.progress_to_next

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: train.train_id,
        icon: {
          url: '/train-icon.png', // Reemplaza con la ruta de tu imagen
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
      })

      marker.addListener('click', () => {
        const totalPassengers = train.passengers_per_wagon.reduce(
          (a, b) => a + b,
          0
        )
        const wagonInfo = train.passengers_per_wagon
          .map(
            (p, i) =>
              `<div style="display:inline-block; width:40px; text-align:center; padding:4px; margin:2px; border-radius:4px; background-color:${
                p > 50 ? '#ef4444' : p > 35 ? '#f59e0b' : '#10b981'
              }; color:white;">${p}</div>`
          )
          .join('')

        const content = `
          <div style="padding: 8px; max-width: 280px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">🚇 ${
              train.train_id
            }</h3>
            <div style="font-size: 14px;">
              <p><strong>Dirección:</strong> ${train.direction}</p>
              <p><strong>De:</strong> ${train.current_station}</p>
              <p><strong>A:</strong> ${train.next_station}</p>
              <p><strong>Progreso:</strong> ${Math.round(
                train.progress_to_next * 100
              )}%</p>
              <p><strong>Vagones:</strong> ${train.wagons}</p>
              <p><strong>Pasajeros totales:</strong> ${totalPassengers}</p>
              <div style="margin-top: 8px;">
                <p style="font-weight: 600; margin-bottom: 4px;">Ocupación:</p>
                <div>${wagonInfo}</div>
              </div>
            </div>
          </div>
        `
        infoWindowRef.current?.setContent(content)
        infoWindowRef.current?.open(map, marker)
      })

      markersRef.current.push(marker)
    })

    incidents.forEach((incident) => {
      const marker = new google.maps.Marker({
        position: { lat: incident.posicion.lat, lng: incident.posicion.lng },
        map,
        title: incident.tipo,
        icon: {
          url: '/incident-icon.png', // Puedes usar una imagen personalizada
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 12),
        },
      })

      marker.addListener('click', () => {
        const content = `
          <div style="padding: 8px; max-width: 280px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">🚨 ${
              incident.tipo
            }</h3>
            <div style="font-size: 14px;">
              <p><strong>Hora:</strong> ${incident.hora}</p>
              <p><strong>Ubicación:</strong> ${incident.linea}</p>
              <p><strong>Severidad:</strong> <span style="padding: 2px 8px; border-radius: 4px; background-color: ${getIncidentColor(
                incident.severidad
              )}; color: white;">${incident.severidad}</span></p>
              <p><strong>Estado:</strong> ${incident.estado}</p>
              <p style="margin-top: 8px;">${incident.descripcion}</p>
              ${
                incident.fotoUrl
                  ? `<img src="${incident.fotoUrl}" alt="Incident" style="width: 100%; margin-top: 8px; border-radius: 8px;" />`
                  : ''
              }
              <button style="margin-top: 8px; padding: 4px 12px; background-color: #7ae582; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Ver detalles</button>
            </div>
          </div>
        `
        infoWindowRef.current?.setContent(content)
        infoWindowRef.current?.open(map, marker)

        // Al hacer clic en el InfoWindow, abrir el modal
        google.maps.event.addListenerOnce(
          infoWindowRef.current!,
          'domready',
          () => {
            const contentElement = document.querySelector('.gm-style-iw-c')
            const button = contentElement?.querySelector('button')
            button?.addEventListener('click', () => {
              setSelectedIncident(incident.id)
              infoWindowRef.current?.close()
            })
          }
        )
      })

      markersRef.current.push(marker)
    })

    return () => {
      markersRef.current.forEach((m) => m.setMap(null))
      if (lineRef.current) lineRef.current.setMap(null)
    }
  }, [
    map,
    line1Stations,
    line1Status,
    line2Stations,
    line2Status,
    incidents,
    setSelectedIncident,
    selectedLine,
  ])

  return null
}

function MapView({ incidents, isLoading }: Props) {
  const { setSelectedIncident, selectedLine, setSelectedLine } = useUiStore()

  const { data: line1Status, isLoading: loadingLine1 } = useLineStatus()
  const { data: line1Stations, isLoading: loadingStations1 } = useStations()
  const { data: line2Status, isLoading: loadingLine2 } = useLine2Status()
  const { data: line2Stations, isLoading: loadingStations2 } = useLine2Stations()

  const mapCenter = { lat: 19.4326, lng: -99.1332 }

  const stats = useMemo(() => {
    const trains1 = selectedLine !== 'L2' && line1Status ? line1Status.active_trains.length : 0
    const trains2 = selectedLine !== 'L1' && line2Status ? line2Status.active_trains.length : 0
    const activeTrains = trains1 + trains2

    const people1 = selectedLine !== 'L2' && line1Stations ? line1Stations.reduce((sum, s) => sum + s.people_waiting, 0) : 0
    const people2 = selectedLine !== 'L1' && line2Stations ? line2Stations.reduce((sum, s) => sum + s.people_waiting, 0) : 0
    const totalPeople = people1 + people2

    const inc1 = selectedLine !== 'L2' && line1Stations ? line1Stations.filter((s) => s.has_incident).length : 0
    const inc2 = selectedLine !== 'L1' && line2Stations ? line2Stations.filter((s) => s.has_incident).length : 0
    const incidentsCount = inc1 + inc2

    const stations1 = selectedLine !== 'L2' && line1Stations ? line1Stations.length : 0
    const stations2 = selectedLine !== 'L1' && line2Stations ? line2Stations.length : 0
    const totalStations = stations1 + stations2

    return { activeTrains, totalPeople, incidentsCount, totalStations }
  }, [line1Status, line1Stations, line2Status, line2Stations, selectedLine])

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-full flex items-center justify-center bg-charcoal/70">
        <div className="text-center p-6">
          <p className="text-red-400 font-semibold mb-2">
            ⚠️ Google Maps API Key no configurada
          </p>
          <p className="text-muted text-sm">
            Agrega tu API key en el archivo{' '}
            <code className="bg-slate/50 px-2 py-1 rounded">.env</code>
          </p>
          <p className="text-muted text-xs mt-2">
            VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[480px] xl:h-full">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="mobilityai-map"
          style={{ width: '100%', height: '100%' }}
        />
        <MapContent
          line1Stations={line1Stations}
          line1Status={line1Status}
          line2Stations={line2Stations}
          line2Status={line2Status}
          incidents={incidents}
          setSelectedIncident={setSelectedIncident}
          selectedLine={selectedLine}
        />
      </APIProvider>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-slate/90 backdrop-blur-sm border border-slate/60 rounded-2xl p-4 text-sm text-muted shadow-glass max-w-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-semibold font-display text-lg">
            Metro CDMX
          </p>
          {(loadingLine1 || loadingLine2) && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent border-t-transparent" />
          )}
        </div>

        {/* Selector de líneas */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setSelectedLine('all')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedLine === 'all'
                ? 'bg-accent text-charcoal'
                : 'bg-charcoal/50 text-muted hover:bg-charcoal/70'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setSelectedLine('L1')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedLine === 'L1'
                ? 'bg-pink-500 text-white'
                : 'bg-charcoal/50 text-muted hover:bg-charcoal/70'
            }`}
          >
            Línea 1
          </button>
          <button
            onClick={() => setSelectedLine('L2')}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedLine === 'L2'
                ? 'bg-blue-500 text-white'
                : 'bg-charcoal/50 text-muted hover:bg-charcoal/70'
            }`}
          >
            Línea 2
          </button>
        </div>

        {(line1Status || line2Status) && (
          <>
            {/* Incidentes de Línea 1 */}
            {selectedLine !== 'L2' &&
              line1Status &&
              line1Status.incident_type !== 'none' && (
                <div className="mb-2 p-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 font-semibold text-xs">
                    🚇 L1: {line1Status.incident_message}
                  </p>
                </div>
              )}

            {/* Incidentes de Línea 2 */}
            {selectedLine !== 'L1' &&
              line2Status &&
              line2Status.incident_type !== 'none' && (
                <div className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 font-semibold text-xs">
                    🚇 L2: {line2Status.incident_message}
                  </p>
                </div>
              )}

            {stats && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-charcoal/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted">Trenes</p>
                  <p className="text-lg font-bold text-accent">
                    {stats.activeTrains}
                  </p>
                </div>
                <div className="bg-charcoal/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted">Personas</p>
                  <p className="text-lg font-bold text-white">
                    {stats.totalPeople}
                  </p>
                </div>
                <div className="bg-charcoal/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-muted">Incidentes</p>
                  <p className="text-lg font-bold text-red-400">
                    {stats.incidentsCount}
                  </p>
                </div>
              </div>
            )}

            <div className="text-xs text-muted">
              <p>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>{' '}
                Baja saturación
              </p>
              <p>
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span>{' '}
                Media saturación
              </p>
              <p>
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>{' '}
                Alta saturación
              </p>
              <p className="mt-2 text-[10px]">
                ⏱️ Actualización cada 3 segundos
              </p>
              <p className="text-[10px]">📍 {stats?.totalStations || 0} estaciones</p>
            </div>
          </>
        )}
      </motion.div>

      {(isLoading || loadingStations1 || loadingStations2) && (
        <div className="absolute inset-0 grid place-items-center bg-graphite/70 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center gap-3 text-muted bg-charcoal/90 px-4 py-3 rounded-lg">
            <TrainIcon className="h-5 w-5 animate-pulse" />
            Cargando datos del metro...
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView
