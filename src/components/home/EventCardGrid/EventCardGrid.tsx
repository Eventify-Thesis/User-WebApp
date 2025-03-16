"use client";
import React from "react";
import { EventCard } from "./EventCard/EventCard.tsx";
import { SeeMoreButton } from "./SeeMoreButton/SeeMoreButton.styles";
import { Section, Title, EventsGrid } from "./EventCardGrid.styles";
import EventModel from "@/domain/EventModel.ts";

interface EventCardGridProps {
    eventCategory: string,
    events: EventModel[];
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
