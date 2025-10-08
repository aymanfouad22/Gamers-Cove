import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import type { 
  AxiosError, 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  InternalAxiosRequestConfig 
} from 'axios';
import { useAuth } from '@/context/AuthContext';
import { handleApiError } from '@/lib/api-utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ApiConfig extends Omit<AxiosRequestConfig, 'headers'> {
  skipAuth?: boolean;
  headers?: Record<string, string>;
}

export const useApi = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Add auth token to requests
  const authInterceptor = useCallback(async (config: InternalAxiosRequestConfig) => {
    const newConfig = { ...config };
    
    // Skip auth if explicitly set in config
    if ((config as any).skipAuth) {
      return newConfig;
    }

    if (user) {
      try {
        const token = await user.getIdToken();
        if (token) {
          newConfig.headers = newConfig.headers || {};
          newConfig.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    
    return newConfig;
  }, [user]);

  // Handle errors
  const errorInterceptor = useCallback((error: AxiosError) => {
    setIsLoading(false);
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        handleApiError('Your session has expired. Please log in again.');
      } else if (status === 403) {
        handleApiError('You do not have permission to perform this action.');
      } else if (status === 404) {
        handleApiError('The requested resource was not found.');
      } else if (status && status >= 500) {
        handleApiError('A server error occurred. Please try again later.');
      } else if (data && typeof data === 'object' && 'message' in data) {
        handleApiError(String(data.message));
      } else {
        handleApiError(error.message);
      }
    } else if (error.request) {
      handleApiError('No response from server. Please check your connection.');
    } else {
      handleApiError(error.message);
    }
    
    return Promise.reject(error);
  }, []);

  // Add request interceptor
  const requestInterceptor = api.interceptors.request.use(
    (config) => {
      setIsLoading(true);
      return authInterceptor(config);
    },
    (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor
  const responseInterceptor = api.interceptors.response.use(
    (response: AxiosResponse) => {
      setIsLoading(false);
      return response;
    },
    (error) => {
      return errorInterceptor(error);
    }
  );

  // Remove interceptors when component unmounts
  useEffect(() => {
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [requestInterceptor, responseInterceptor]);

  // Helper methods for common HTTP methods
  const get = useCallback(async <T>(
    url: string, 
    config: ApiConfig = {}
  ): Promise<T> => {
    try {
      const response = await api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const post = useCallback(async <T>(
    url: string, 
    data?: unknown, 
    config: ApiConfig = {}
  ): Promise<T> => {
    try {
      const response = await api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const put = useCallback(async <T>(
    url: string, 
    data?: unknown, 
    config: ApiConfig = {}
  ): Promise<T> => {
    try {
      const response = await api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const del = useCallback(async <T>(
    url: string, 
    config: ApiConfig = {}
  ): Promise<T> => {
    try {
      const response = await api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  return useMemo(() => ({
    api,
    isLoading,
    get,
    post,
    put,
    delete: del,
  }), [get, post, put, del, isLoading]);
};
