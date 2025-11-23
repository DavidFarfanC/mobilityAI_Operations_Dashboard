import axios from 'axios'

// URL base del backend en AWS (usa variable de entorno si está disponible)
// En producción (Vercel) usa el proxy /api, en desarrollo también
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '/api'

// API Key de Google Maps
export const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

// Instancia de axios configurada
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token')
      // Opcional: redirigir a login
    }
    return Promise.reject(error)
  }
)
