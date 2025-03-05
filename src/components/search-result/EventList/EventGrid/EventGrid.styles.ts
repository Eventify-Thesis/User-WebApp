import styled from "styled-components";
import { EventProps } from "../EventCard/EventCard.styles";

export interface EventGridProps {
    events: EventProps[];
}

export const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;