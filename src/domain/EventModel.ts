import { PaymentInfoModel } from './PaymentInfoModel';
import { SettingModel } from './SettingModel';
import { ShowModel } from './ShowModel';

export default interface EventModel {
  id: number;
  paymentInfo?: PaymentInfoModel;
  setting?: SettingModel;
  shows?: ShowModel[];
  organizationId?: string;
  eventName: string;
  eventDescription?: string;
  eventType?: string;
  status?: string;
  orgName?: string;
  orgDescription?: string;
  orgLogoUrl?: string;
  eventLogoUrl?: string;
  eventBannerUrl?: string;
  venueName?: string;
  cityId?: string;
  districtId?: string;
  wardId?: string;
  street?: string;
  categories?: string[];
  categoriesIds?: string[];
}

export interface EventDetailResponse extends EventModel {
  price?: string; // Not in schema, but kept for display purposes
  date: Date; // Not in schema, but kept for display purposes
  isInterested?: boolean; // Added for UI state
  interestedCount?: number; //TODO: Add to schema
  startTime: Date;
  endTime: Date;
  address: {
    addressVi: string;
    addressEn: string;
  };
}

export interface ExtendedEventModel extends EventModel {
  minimumPrice: number;
  startTime: Date;
  isInterested: boolean;
}