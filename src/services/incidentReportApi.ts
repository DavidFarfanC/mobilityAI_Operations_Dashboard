import { apiClient } from '../config/api'
import { IncidentReport, IncidentReportResponse } from '../types'

/**
 * Servicio para consumir los endpoints de Incident Reports
 */

/**
 * Obtiene todos los reportes de incidentes
 * Endpoint: GET /reports/incident?skip={skip}&limit={limit}
 */
export const getIncidentReports = async (
  skip: number = 0,
  limit: number = 100
): Promise<IncidentReport[]> => {
  try {
    const response = await apiClient.get<IncidentReport[]>(
      '/reports/incident',
      {
        params: { skip, limit },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching incident reports:', error)
    throw error
  }
}

/**
 * Obtiene un reporte específico por ID
 * Endpoint: GET /reports/incident/{id}
 */
export const getIncidentReportById = async (
  id: number
): Promise<IncidentReport> => {
  try {
    const response = await apiClient.get<IncidentReport>(
      `/reports/incident/${id}`
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching incident report ${id}:`, error)
    throw error
  }
}

/**
 * Crea un nuevo reporte de incidente con audio
 * Endpoint: POST /reports/incident
 */
export const createIncidentReport = async (
  audio: File,
  station: string,
  type: string,
  level: string,
  description: string,
  incidentDatetime?: string
): Promise<IncidentReportResponse> => {
  try {
    const formData = new FormData()
    formData.append('audio', audio)
    formData.append('station', station)
    formData.append('type', type)
    formData.append('level', level)
    formData.append('description', description)

    if (incidentDatetime) {
      formData.append('incident_datetime', incidentDatetime)
    } else {
      formData.append('incident_datetime', new Date().toISOString())
    }

    const response = await apiClient.post<IncidentReportResponse>(
      '/reports/incident',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  } catch (error) {
    console.error('Error creating incident report:', error)
    throw error
  }
}

/**
 * Obtiene reportes de incidentes recientes (últimas 24 horas)
 */
export const getRecentIncidentReports = async (): Promise<IncidentReport[]> => {
  try {
    const response = await apiClient.get<IncidentReport[]>('/reports/incident')
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Filtrar solo los de las últimas 24 horas
    return response.data.filter((report) => {
      const reportDate = new Date(report.incident_datetime)
      return reportDate >= twentyFourHoursAgo
    })
  } catch (error) {
    console.error('Error fetching recent incident reports:', error)
    throw error
  }
}

/**
 * Obtiene reportes por estación
 */
export const getIncidentReportsByStation = async (
  station: string
): Promise<IncidentReport[]> => {
  try {
    const response = await apiClient.get<IncidentReport[]>('/reports/incident')
    return response.data.filter((report) => report.station === station)
  } catch (error) {
    console.error(`Error fetching reports for station ${station}:`, error)
    throw error
  }
}

/**
 * Obtiene reportes por tipo
 */
export const getIncidentReportsByType = async (
  type: string
): Promise<IncidentReport[]> => {
  try {
    const response = await apiClient.get<IncidentReport[]>('/reports/incident')
    return response.data.filter((report) => report.type === type)
  } catch (error) {
    console.error(`Error fetching reports of type ${type}:`, error)
    throw error
  }
}
