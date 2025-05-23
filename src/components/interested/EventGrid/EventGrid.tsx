import EventCard from "../EventCard/EventCard";
import * as s from "./EventGrid.styles";

export const EventGrid: React.FC<any & {
        onUnbookmark: (id: number) => void;
        fadingEvents: number[]
    }> = ({ events, onUnbookmark, fadingEvents }) => {
    const eventsWithAddress = events.map((event: any) => {
        if (
            !event.street ||
            !event.ward ||
            !event.district ||
            !event.city
        ) {
            return {
                ...event,
                address: 'Online',
            };
        }
        return {
            ...event,
            address:
                event.street +
                ', ' +
                event.ward +
                ', ' +
                'District ' +
                event.district +
                ', ' +
                event.city,
        };
    });
    
    return (
        <s.EventGrid>
            {eventsWithAddress.map((event: any) => (
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
