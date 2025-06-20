import axios from 'axios';
import { AxiosError } from 'axios';
import { ApiError } from '@/api/ApiError';
import { getToken } from '@/services/tokenManager';

// Global error handler for HTTP errors
let globalErrorHandler: ((status: number, message: string) => void) | null =
  null;

// Set the global error handler (will be called from App component)
export const setGlobalErrorHandler = (
  handler: (status: number, message: string) => void,
) => {
  globalErrorHandler = handler;
};

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
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }

  return config;
});

httpApi.interceptors.response.use(undefined, (error: AxiosError) => {
  // Type guard for error.response?.data
  const errorData = error.response?.data as { message?: string } | undefined;
  const status = error.response?.status;

  if (status === 401) {
    if (globalErrorHandler) {
      globalErrorHandler(401, 'unauthorized');
    }
    return Promise.reject(error);
  }

  // Handle authorization errors (403) - show permission denied message
  if (status === 403) {
    if (globalErrorHandler) {
      globalErrorHandler(403, 'forbidden');
    }
    throw new ApiError<ApiErrorData>(
      'Insufficient permissions',
      error.response?.data as ApiErrorData | undefined,
    );
  }

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
