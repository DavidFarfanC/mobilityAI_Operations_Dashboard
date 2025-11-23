import { useQuery } from '@tanstack/react-query'
import { fetchIncidents, fetchKpis, fetchTrend } from './fakeApi'
import {
  KPIResponse,
  TrendResponse,
  LineStatus,
  Station,
  FallDetection,
} from '../types'
import { getLineStatus, getStations } from './metroApi'
import { getFallDetections, getRecentFallDetections } from './fallDetectionApi'

// ===== HOOKS ORIGINALES (fake data) =====

export const useIncidents = () =>
  useQuery({
    queryKey: ['incidentes'],
    queryFn: fetchIncidents,
    refetchInterval: 8000,
  })

export const useKpis = () =>
  useQuery<KPIResponse>({
    queryKey: ['kpis'],
    queryFn: fetchKpis,
    refetchInterval: 8000,
  })

export const useTrend = () =>
  useQuery<TrendResponse>({
    queryKey: ['tendencias'],
    queryFn: fetchTrend,
    refetchInterval: 12000,
  })

// ===== HOOKS PARA LA API DEL BACKEND =====

/**
 * Hook para obtener el estado de la Línea 1 en tiempo real
 * Se actualiza cada 3 segundos como especifica el backend
 */
export const useLineStatus = () =>
  useQuery<LineStatus>({
    queryKey: ['metro', 'line1', 'status'],
    queryFn: getLineStatus,
    refetchInterval: 3000, // Actualización cada 3 segundos
    staleTime: 2000, // Considera los datos frescos por 2 segundos
  })

/**
 * Hook para obtener todas las estaciones de la Línea 1
 * Se actualiza cada 5 segundos
 */
export const useStations = () =>
  useQuery<Station[]>({
    queryKey: ['metro', 'line1', 'stations'],
    queryFn: getStations,
    refetchInterval: 5000,
    staleTime: 3000,
  })

/**
 * Hook para obtener todos los incidentes de caídas
 */
export const useFallDetections = (skip: number = 0, limit: number = 100) =>
  useQuery<FallDetection[]>({
    queryKey: ['fallDetections', skip, limit],
    queryFn: () => getFallDetections(skip, limit),
    refetchInterval: 10000, // Actualización cada 10 segundos
    staleTime: 5000,
  })

/**
 * Hook para obtener incidentes recientes (últimas 24 horas)
 */
export const useRecentFallDetections = () =>
  useQuery<FallDetection[]>({
    queryKey: ['fallDetections', 'recent'],
    queryFn: getRecentFallDetections,
    refetchInterval: 10000,
    staleTime: 5000,
  })
