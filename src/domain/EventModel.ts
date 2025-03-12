export interface PaymentInfo {
  id: string;
  eventId: string;
  bankAccount: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankOffice: string;
  businessType: string;
  companyName?: string;
  companyAddress?: string;
  taxNumber?: string;
}

export interface Setting {
  id: string;
  eventId: string;
  url: string;
  maximumAttendees?: number;
  ageRestriction?: string;
  messageAttendees?: string;
  isPrivate?: boolean;
  eventDescription?: string;
  isEnableQuestionForm?: boolean;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  isFree: boolean;
  quantity: number;
  minTicketPurchase: number;
  maxTicketPurchase: number;
  startTime: Date;
  endTime: Date;
  description: string;
  imageURL: string;
  isDisabled?: boolean;
  position: number;
}

export interface Showing {
  ticketTypes: TicketType[];
  startTime: Date;
  endTime: Date;
}

export interface Show {
  id: string;
  eventId: string;
  showings: Showing[];
}

export default interface EventModel {
  id: string; // Matches MongoDB ObjectId
  paymentInfo?: PaymentInfo;
  setting?: Setting;
  show?: Show;
  organizationId?: string;
  eventName: string;
  eventDescription?: string;
  eventType?: string;
  status?: string;
  orgName?: string;
  orgDescription?: string;
  orgLogoURL?: string;
  eventLogoURL?: string;
  eventBannerURL?: string;
  venueName?: string;
  cityId?: string;
  districtId?: string;
  wardId?: string;
  street?: string;
  categories?: string[];
  categoriesIds?: string[];
  price?: string; // Not in schema, but kept for display purposes
  date: Date; // Not in schema, but kept for display purposes
  isInterested?: boolean; // Added for UI state
  interestedCount?: number; //TODO: Add to schema
}
