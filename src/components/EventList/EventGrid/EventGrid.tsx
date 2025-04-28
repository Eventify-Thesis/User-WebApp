import EventCard from "../EventCard/EventCard";
import * as s from "./EventGrid.styles";

export const EventGrid: React.FC<s.EventGridProps> = ({ events }) => {
    return (
        <s.EventGrid>
            {events.map((event) => (
                <EventCard key={event.id} {...event} minimumPrice={event.minimumPrice} startTime={event.startTime} isInterested={event.isInterested ?? false} />
            ))}
        </s.EventGrid>
    )
}