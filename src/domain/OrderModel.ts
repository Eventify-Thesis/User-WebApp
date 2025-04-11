import { IdParam } from '@/types/types';

export default interface OrderModel {
  id: IdParam;
  userId: string;
  eventId: number;
  eventName: string;
  imageUrl: string;
  //ticketType: string; // whether it's booked online or offline
  date: Date;
  paymentMethod: string;
  orderStatus: string;
  totalAmount: number;
  startTime: string; // "HH:mm" (24-hour format)
  endTime: string; // "HH:mm" (24-hour format)
  createdAt: Date;
  buyerEmail: string;
}
