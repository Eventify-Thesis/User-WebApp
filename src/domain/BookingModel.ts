
export default interface BookingModel {
  eventId: number;
  showingId: number;
  bookingCode: string;
  subtotalAmount: number;
  totalAmount: number;
  expireIn: number;
  discountAmount: number;
  discountCode: string;
  addressId: number;
  ticketPrintingFee?: number;
  shippingFee?: number;
  orderId: number;
  step: string;
  platformDiscountAmount: number;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    seatId?: string;
    sectionId?: string;
    rowLabel?: string;
    seatNumber?: number;
    discount: number;
    discountCode: string;
  }[];
}

