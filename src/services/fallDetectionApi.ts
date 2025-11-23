import { apiClient } from '../config/api';
import { FallDetection, FallDetectionResponse } from '../types';

/**
 * Servicio para consumir los endpoints de Fall Detection
 */

/**
 * Obtiene todos los incidentes de caídas
 * Endpoint: GET /falldetection?skip={skip}&limit={limit}
 */
export const getFallDetections = async (
  skip: number = 0,
  limit: number = 100
): Promise<FallDetection[]> => {
  try {
    const response = await apiClient.get<FallDetection[]>('/falldetection', {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching fall detections:', error);
    throw error;
  }
};

/**
 * Obtiene un incidente específico por ID
 * Endpoint: GET /falldetection/{id}
 */
export const getFallDetectionById = async (id: number): Promise<FallDetection> => {
  try {
    const response = await apiClient.get<FallDetection>(`/falldetection/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching fall detection ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo incidente de caída con imagen
 * Endpoint: POST /falldetection
 */
export const createFallDetection = async (
  image: File,
  station: string,
  detectedObject: string,
  incidentDatetime: Date
): Promise<FallDetectionResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('station', station);
    formData.append('detected_object', detectedObject);
    formData.append('incident_datetime', incidentDatetime.toISOString());

    const response = await apiClient.post<FallDetectionResponse>('/falldetection', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating fall detection:', error);
    throw error;
  }
};

/**
 * Elimina un incidente de caída
 * Endpoint: DELETE /falldetection/{id}
 */
export const deleteFallDetection = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/falldetection/${id}`);
  } catch (error) {
    console.error(`Error deleting fall detection ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene incidentes filtrados por estación
 */
export const getFallDetectionsByStation = async (station: string): Promise<FallDetection[]> => {
  try {
    const allDetections = await getFallDetections(0, 1000);
    return allDetections.filter((detection) => detection.station === station);
  } catch (error) {
    console.error(`Error fetching fall detections for station ${station}:`, error);
    throw error;
  }
};

/**
 * Obtiene incidentes recientes (últimas 24 horas)
 */
export const getRecentFallDetections = async (): Promise<FallDetection[]> => {
  try {
    const allDetections = await getFallDetections(0, 100);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return allDetections.filter((detection) => {
      const incidentDate = new Date(detection.incident_datetime);
      return incidentDate > oneDayAgo;
    });
  } catch (error) {
    console.error('Error fetching recent fall detections:', error);
    throw error;
  }
};
