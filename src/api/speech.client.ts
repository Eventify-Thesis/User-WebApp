import { httpApi } from '@/api/http.api';

export interface SpeechToTextResponse {
  text: string;
}

export const speechClient = {
  speechToText: async (formData: FormData): Promise<SpeechToTextResponse> => {
    const response = await httpApi.post<any>('/user/stt', formData, {
      headers: {
        // Don't set Content-Type - let the browser set it automatically for FormData
        // This ensures the boundary is set correctly for multipart/form-data
      },
    });

    return response.data.data;
  },
};
