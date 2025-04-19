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

export interface QuestionResponse {
  answer?: string;
}

export interface Question {
  question_id: number;
  response: QuestionResponse;
}

export interface Attendee {
  ticket_price_id: number;
  ticket_id: number;
  first_name: string;
  last_name: string;
  email: string;
  questions: Question[];
}

export interface Order {
  first_name: string;
  last_name: string;
  email: string;
  address: Record<string, any>;
  questions: Question[];
}

export interface QuestionAnswerDto {
  showId?: number;
  bookingCode?: string;
  order: Order;
  attendees: Attendee[];
}

export const bookingClient = {
  submitTicketInfo: async (data: SubmitTicketInfoDto) => {
    const response = await httpApi.post('/bookings/submit-ticket-info', data);
    return response.data;
  },

  getBookingStatus: async (showId: number, bookingCode: string) => {
    const response = await httpApi.get(`/bookings/status?showId=${showId}&bookingCode=${bookingCode}`);
    console.log(response);
    return response.data.data;
  },

  cancelBooking: async (showId: number, bookingCode: string) => {
    const response = await httpApi.delete(`/bookings/cancel-booking?showId=${showId}&bookingCode=${bookingCode}`);
    return response.data;
  },

  getAnswer: async (showId: number, bookingCode: string) => {
    const response = await httpApi.get(`/bookings/answers?showId=${showId}&bookingCode=${bookingCode}`);
    return response.data;
  },

  updateAnswers: async (showId: number, bookingCode: string, answers: any) => {
    const response = await httpApi.put(`/bookings/answers?showId=${showId}&bookingCode=${bookingCode}`, answers);
    return response.data;
  }
};
