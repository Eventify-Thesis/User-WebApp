import styled from 'styled-components';
import { ExtendedEventModel } from '@/domain/EventModel';

export interface EventGridProps {
  events: ExtendedEventModel[];
  onBookmarkChange?: (id: number) => void;
}

export const EventGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
`;
