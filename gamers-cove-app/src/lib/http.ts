import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

// Response type for successful requests
type ApiResponse<T = any> = {
  data: T;
  message?: string;
};

// Public client: never adds Authorization
export const httpPublic = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Don't send cookies with public requests
});

// Ensure public client never sends Authorization header
httpPublic.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.headers) {
    delete config.headers.Authorization;
  }
  return config;
});

// Auth client: adds Authorization only when a valid JWT exists
export const httpAuth = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
httpAuth.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('backend_jwt');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers && 'Authorization' in config.headers) {
      delete (config.headers as any).Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling responses
const responseInterceptor = <T>(response: AxiosResponse<ApiResponse<T> | T>) => {
  // Log the response for debugging
  console.log('Response interceptor:', {
    url: response.config.url,
    data: response.data,
    isArray: Array.isArray(response.data)
  });

  // For login response, handle the token and return the data
  if (response.config.url?.includes('/auth/login') && response.data) {
    return response.data;
  }
  
  // If the response data is an array (like /games), return it directly
  if (Array.isArray(response.data)) {
    return response.data as unknown as T;
  }
  
  // If the response has a nested data property, return that
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return (response.data as any).data as T;
  }
  
  // If we have data but no nested data property, return it directly
  if (response.data) {
    return response.data as T;
  }
  
  // Fallback: return the entire response as a last resort
  return response as unknown as T;
};

const errorInterceptor = (error: AxiosError<ApiResponse>) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    const errorMessage = data?.message || error.message || 'An error occurred';
    
    // Clear token on 401/403 errors
    if (status === 401 || status === 403) {
      localStorage.removeItem('backend_jwt');
    }
    
    return Promise.reject(new Error(`HTTP ${status}: ${errorMessage}`));
  } else if (error.request) {
    // The request was made but no response was received
    return Promise.reject(new Error('No response from server. Please check your connection.'));
  }
  // Something happened in setting up the request that triggered an Error
  return Promise.reject(error);
};

// Add interceptors to both clients
[httpPublic, httpAuth].forEach((client) => {
  client.interceptors.response.use(
    (response: AxiosResponse) => responseInterceptor(response),
    errorInterceptor
  );
});

// For backward compatibility
export const http = httpPublic;
