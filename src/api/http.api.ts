import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@/api/ApiError';
import { getToken } from '@/services/tokenManager';

export const httpApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

httpApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // Set Authorization header properly for Axios v1+
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  // Handle FormData - remove Content-Type to let browser set it with boundary
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }

  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  console.error('HTTP API Error:', {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    config: {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
    },
  });

  // Type guard for error.response?.data
  const errorData = error.response?.data as { message?: string } | undefined;
  const errorMessage =
    errorData?.message || error.message || 'An unknown error occurred';

  throw new ApiError<ApiErrorData>(
    errorMessage,
    (error.response?.data as ApiErrorData) || { message: errorMessage },
  );
});

export interface ApiErrorData {
  message: string;
}
