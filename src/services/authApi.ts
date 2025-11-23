import { apiClient } from '../config/api';

/**
 * Servicio de autenticación con el backend
 * Endpoints de Auth: /auth/register, /auth/login, /auth/me
 */

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

/**
 * Registrar un nuevo usuario
 * Endpoint: POST /auth/register
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    
    // Guardar token en localStorage
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Iniciar sesión
 * Endpoint: POST /auth/login
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    
    // Guardar token en localStorage
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Cerrar sesión
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Obtener usuario actual
 * Endpoint: GET /auth/me
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Obtener el token actual
 */
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};
