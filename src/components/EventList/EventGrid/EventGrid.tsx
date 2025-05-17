import { useNavigate } from "react-router-dom";
import EventCard from "../EventCard/EventCard";
import * as s from "./EventGrid.styles";

export const EventGrid: React.FC<s.EventGridProps> = ({ events }) => {
    const navigate = useNavigate();
    const handleEventClick = (event: any) => {
        if (event.url) {
          window.location.href = `${event.url}-${event.id}`;
        } else {
          window.location.href = `${event.eventName}-${event.id}`;
        }
      };
    return (
        <s.EventGrid>
            {events.map((event) => (
                <EventCard 
                key={event.id} 
                {...event} 
                eventLogoUrl={event.eventLogoUrl} 
                minimumPrice={event.minimumPrice} 
                startTime={event.startTime} 
                isInterested={event.isInterested ?? false} 
                onClick={() => handleEventClick(event)}
                />
            ))}
        </s.EventGrid>
    )
}