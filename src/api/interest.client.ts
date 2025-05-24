import { PaginationResponse } from '@/types/types';
import { httpApi } from './http.api';
import { CreateInterestDto } from '@/types/interest';

// --- Types ---
export interface Interest {
  userId: string;
  eventId: number;
}

export interface InterestResponse {
  message: string;
  interest?: Interest;
}

export const create = async (data: CreateInterestDto): Promise<InterestResponse> => {
  const res = await httpApi.post('/interests', data, 
    {headers: { 'Content-Type': 'application/json' }});
  // Assume backend returns { message, ...interest }
  return {
    message: res.data.message || 'Interest added successfully',
    interest: res.data.interest || res.data,
  };
};

export const findAllInterest = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<PaginationResponse<any>> => {
  const res = await httpApi.get(`/interests/users/${userId}/interests`, {
    params: { page, limit },
  });
  return res.data.data;
};

export const checkExist = async (userId: string, eventId: number): Promise<Interest> => {
  const res = await httpApi.get(`/interests/users/${userId}/events/${eventId}`);
  return res.data;
};

export const remove = async (userId: string, eventId: number): Promise<{ message: string }> => {
  const res = await httpApi.delete(`/interests/users/${userId}/events/${eventId}`);
  return { message: res.data.message || 'Interest removed successfully' };
};
