import http from './http';

async function apiFetch<T>(
  path: string,
  config: any = {}
): Promise<T> {
  try {
    // The http client already handles the base URL and auth headers
    const response = await http({
      url: path.startsWith('/') ? path.slice(1) : path,
      ...config,
      headers: {
        ...config.headers,
      },
    });
    return response as T;
  } catch (error) {
    // The error is already processed by the http interceptor
    throw error;
  }
}

// Helper functions for common HTTP methods
const api = {
  get: <T>(url: string, config?: any) => apiFetch<T>(url, { ...config, method: 'GET' }),
  post: <T>(url: string, data?: any, config?: any) =>
    apiFetch<T>(url, { ...config, method: 'POST', data }),
  put: <T>(url: string, data?: any, config?: any) =>
    apiFetch<T>(url, { ...config, method: 'PUT', data }),
  delete: <T>(url: string, config?: any) =>
    apiFetch<T>(url, { ...config, method: 'DELETE' }),
};

export default api;
