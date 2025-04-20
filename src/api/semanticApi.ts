// api/semantic.api.ts
import axios from "axios";
import { AxiosError } from "axios";
import { ApiError } from "@/api/ApiError";
import { readToken } from "@/services/localStorage.service";

export const semanticApi = axios.create({
  baseURL: "http://localhost:8000", // or use VITE_SEMANTIC_API_BASE_URL
});

semanticApi.interceptors.request.use((config) => {
  const token = readToken();

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

semanticApi.interceptors.response.use(undefined, (error: AxiosError) => {
  throw new ApiError<ApiErrorData>(
    error.response?.data.message || error.message,
    error.response?.data
  );
});

export interface ApiErrorData {
  message: string;
}
