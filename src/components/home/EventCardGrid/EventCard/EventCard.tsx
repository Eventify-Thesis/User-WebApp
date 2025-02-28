"use client";

import React from "react";
import * as s from "./EventCard.styles"

export interface EventCardProps {
  image: string;
  date: Date;
  title: string;
  venue: string;
  price: string;
  interestedCount: number;
  isOnline?: boolean;
}


export const EventCard: React.FC<EventCardProps> = ({
  image,
  date,
  title,
  venue,
  price,
  interestedCount,
  isOnline
}) => {
  
  // Format Date
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonth = monthNames[date.getMonth()]; // Convert zero-based month to string
  const formattedDay = date.getDate().toString(); // Get day
  const formattedYear = date.getFullYear().toString(); // Get day
  
  return (
    <s.CardWrapper>
      <s.ImageSection>
        <s.EventImage src={image} alt={title} />

        {/* Bookmark Icon */}
        <s.BookmarkIcon
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/9c1046de208fdc3515ce14eddbcf778ad27b67628f7ecbfaa210063a9427c5c9?placeholderIfAbsent=true&apiKey=f27513fe563744688c43a7d8191d48a6"
          alt="Bookmark"
        />
      </s.ImageSection>


      <s.ContentSection>
  <s.EventDetails>
    <s.Title>{title}</s.Title>
    <s.Venue>{isOnline ? "Online" : venue}</s.Venue>
    <s.Time>{formattedDay + " " + formattedMonth + " " + formattedYear}</s.Time>

    <s.MetaInfo>
  {/* Price on the left */}
  {price && (
    <s.PriceSection>
      <s.PriceIcon
        src={
          price === "FREE"
            ? "https://cdn.builder.io/api/v1/image/assets/TEMP/75e267775796d2beb53e040c1b6a4e1b918da2c64177d75c54600544babd7cbb"
            : "https://cdn.builder.io/api/v1/image/assets/TEMP/46afa3da8da98074863d3982465257407b626e287c2afa9b610f7bfd1843fc34"
        }
      />
      <s.Price> {price != "FREE" ? "From " + price : "FREE TICKET"}</s.Price>
    </s.PriceSection>
  )}

  {/* InterestBadge on the right */}
  {interestedCount > 0 && (
    <s.InterestBadge>
      <s.InterestCount>{interestedCount} interested </s.InterestCount>
    </s.InterestBadge>
  )}
</s.MetaInfo>

  </s.EventDetails>
</s.ContentSection>


    </s.CardWrapper>
  );
};

