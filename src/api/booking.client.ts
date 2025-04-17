import { httpApi } from '@/api/http.api';

export interface ItemInfo {
  quantity: number;
  id: number;
  sectionId?: number;
  seats?: {
    id: number;
    quantity: number;
  }[];
}

export interface SubmitTicketInfoDto {
  eventId: number;
  showId: number;
  timestamp: number;
  platform: string;
  items: ItemInfo[];
}

export const bookingClient = {
  submitTicketInfo: async (data: SubmitTicketInfoDto) => {
    console.log('data', data);
    const response = await httpApi.post('/bookings/submit-ticket-info', data);
    return response.data;
  },
};
