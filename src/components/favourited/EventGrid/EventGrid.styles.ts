import styled from "styled-components";
import EventModel from '@/domain/EventModel';

export interface EventGridProps {
    events: EventModel[];
}

export const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;