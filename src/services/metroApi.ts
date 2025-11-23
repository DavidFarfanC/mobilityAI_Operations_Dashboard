import { apiClient } from '../config/api';
import { LineStatus, Station } from '../types';

/**
 * Servicio para consumir los endpoints del Metro Line 1
 */

/**
 * Obtiene el estado actual de la Línea 1 con todos los trenes activos
 * Endpoint: GET /metro/line1/status
 */
export const getLineStatus = async (): Promise<LineStatus> => {
  try {
    const response = await apiClient.get<LineStatus>('/metro/line1/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching line status:', error);
    throw error;
  }
};

/**
 * Obtiene información de todas las estaciones de la Línea 1
 * Endpoint: GET /metro/line1/stations
 */
export const getStations = async (): Promise<Station[]> => {
  try {
    const response = await apiClient.get<Station[]>('/metro/line1/stations');
    return response.data;
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
};

/**
 * Reinicia la simulación del metro
 * Endpoint: POST /metro/reset
 */
export const resetSimulation = async (): Promise<{ message: string; timestamp: string }> => {
  try {
    const response = await apiClient.post<{ message: string; timestamp: string }>('/metro/reset');
    return response.data;
  } catch (error) {
    console.error('Error resetting simulation:', error);
    throw error;
  }
};

/**
 * Obtiene el estado de una estación específica por ID
 */
export const getStationById = async (stationId: string): Promise<Station | undefined> => {
  try {
    const stations = await getStations();
    return stations.find((station) => station.id === stationId);
  } catch (error) {
    console.error(`Error fetching station ${stationId}:`, error);
    throw error;
  }
};
