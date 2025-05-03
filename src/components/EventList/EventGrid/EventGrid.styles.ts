import styled from "styled-components";
import EventModel from "@/domain/EventModel";

// Extend EventModel with additional fields
export interface ExtendedEventModel extends EventModel {
  minimumPrice: number;
  startTime: Date;
  isInterested: boolean;
}

export interface EventGridProps {
  events: ExtendedEventModel[];
}

export const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;