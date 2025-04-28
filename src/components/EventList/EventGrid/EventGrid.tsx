import EventCard from "../EventCard/EventCard";
import * as s from "./EventGrid.styles";

export const EventGrid: React.FC<s.EventGridProps> = ({ events }) => {
    return (
        <s.EventGrid>
            {events.map((event) => (
                <EventCard key={event.id} {...event} lowest_price={event.lowest_price} />
            ))}
        </s.EventGrid>
    )
}