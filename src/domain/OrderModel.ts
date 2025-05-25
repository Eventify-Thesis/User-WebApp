import { IdParam } from '@/types/types';
import EventModel from './EventModel';
import { ShowModel } from './ShowModel';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  CANCELLED = 'CANCELLED',
}

export interface OrderModel {
  id: number;
  publicId: string;
  shortId: string;

  userId: string;

  firstName: string;

  lastName: string;

  email: string;

  eventId: number;
  showId: number;

  bookingCode: string;

  status: OrderStatus;

  subtotalAmount: number;

  platformDiscountAmount: number;

  totalAmount: number;

  reservedUntil: Date;

  stripePaymentIntentId: string;

  stripePaymentStatus: string;

  stripePaymentErrorMessage: string;

  stripeCustomerId: string;

  paidAt: Date;

  items: OrderItemModel[];

  event: EventModel;

  show: ShowModel;

  createdAt: Date;

  updatedAt: Date;
}

export interface OrderItemModel {
  id: number;

  orderId: number;

  ticketTypeId: number;

  name: string;

  seatId?: string;

  sectionId?: string;

  quantity: number;

  rowLabel: string;

  seatNumber: number;

  price: number;

  createdAt: Date;

  updatedAt: Date;
}
