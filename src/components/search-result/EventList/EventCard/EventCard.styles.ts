import styled from "styled-components";
import { Types } from 'mongoose';

export interface EventProps {
  id: string; // Matches MongoDB ObjectId
  paymentInfo?: Types.ObjectId;
  setting?: Types.ObjectId;
  show?: Types.ObjectId;
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
  isFavorited?: boolean; // Added for UI state
  interestedCount?: number; //TODO: Add to schema
}


export const Card = styled.div`
  background-color: #111;
  border-radius: 10px;
  overflow: hidden;
  color: white;
  padding: 10px;
  text-align: left;
`;

// Wrapper to apply hover effect
export const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 10px; 

  &:hover img {
    transform: scale(1.1);
  }

  &:hover::after {
    animation: shine 0.8s ease-in-out forwards;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 70%
    );
    transition: left 0.8s ease-in-out;
  }

  @keyframes shine {
    from {
      left: -100%;
    }
    to {
      left: 100%;
    }
  }
`;

export const EventImage = styled.img`
  width: 100%;
  display: block;
  border-radius: 10px;
  transition: transform 0.5s ease-in-out;
`;

export const EventTitle = styled.h3`
  font-size: 16px;
  margin: 10px 0;
`;

export const EventPrice = styled.p`
  color: rgb(214, 205, 32);
  font-weight: bold;
`;

export const EventDate = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #ccc;
`;


export const BookmarkIcon = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;