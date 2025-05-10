"use client";
import React from "react";
import { EventCard } from "./EventCard/EventCard.tsx";
import { SeeMoreButton } from "./SeeMoreButton/SeeMoreButton.styles";
import { Section, Title, EventsGrid } from "./EventCardGrid.styles";
import EventModel from "@/domain/EventModel.ts";

import { useNavigate } from "react-router-dom";

interface EventCardGridProps {
    eventCategory: string,
    events: EventModel[];
    categoryKey: string;
}

export const EventCardGrid: React.FC<EventCardGridProps> = ({eventCategory, events, categoryKey }) => {
    const navigate = useNavigate();
    const handleSeeMore = () => {
        navigate(`/search-result?query=&categories=${categoryKey}`);
    };
    return (
        <Section>
        <Title>{eventCategory}</Title>
        <EventsGrid>
            {events.map((event, index) => (
            <EventCard key={index} {...event} />
            ))}
        </EventsGrid>

        <SeeMoreButton onClick={handleSeeMore}>See More</SeeMoreButton>

        </Section>
    );
};
