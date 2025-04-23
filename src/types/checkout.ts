// src/types/checkout.ts
import BookingModel from '@/domain/BookingModel';
import EventModel from '@/domain/EventModel';
import { ShowModel } from '@/domain/ShowModel';
import { UseFormReturnType } from '@mantine/form';

export interface CheckoutContext {
    event: EventModel;
    show: ShowModel;
    bookingStatus: BookingModel;
    form: UseFormReturnType<{
        order: { /* … */ };
        attendees: { /* … */ }[];
    }>;
    onContinue: () => Promise<void>;
}
