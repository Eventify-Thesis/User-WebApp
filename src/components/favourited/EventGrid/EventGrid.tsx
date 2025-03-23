import EventCard from "../EventCard/EventCard";
import * as s from "./EventGrid.styles";

export const EventGrid: React.FC<s.EventGridProps & {
        onUnbookmark: (id: string) => void;
        fadingEvents: string[]
    }> = ({ events, onUnbookmark, fadingEvents }) => {
    return (
        <s.EventGrid>
            {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  {...event} 
                  onUnbookmark={onUnbookmark} 
                  isFading={fadingEvents.includes(event.id)} 
                />
            ))}
        </s.EventGrid>
    )
}
