import styled from "styled-components";
import ExtendedEventModel from "@/domain/ExtendedEventModel";

export interface EventGridProps {
  events: ExtendedEventModel[];
}

export const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;