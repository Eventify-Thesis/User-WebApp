"use client";
import React from "react";
import { EventProps } from "./EventCard/EventCard.styles";
import { EventCard } from "./EventCard/EventCard.tsx";
import { SeeMoreButton } from "./SeeMoreButton/SeeMoreButton.styles";
import { Section, Title, EventsGrid } from "./EventCardGrid.styles";


interface EventCardGridProps {
    eventCategory: string,
    events: EventProps[];
}

export const EventCardGrid: React.FC<EventCardGridProps> = ({eventCategory, events }) => {
    return (
        <Section>
        <Title>{eventCategory}</Title>
        <EventsGrid>
            {events.map((event, index) => (
            <EventCard key={index} {...event} />
            ))}
        </EventsGrid>

        <SeeMoreButton>See More</SeeMoreButton>

        </Section>
    );
};
