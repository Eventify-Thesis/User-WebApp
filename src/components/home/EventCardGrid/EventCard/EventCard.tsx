"use client";

import React, { useState } from "react";
import * as s from "./EventCard.styles"
import { useTranslation } from "react-i18next";
import { StarOutlined, StarFilled } from '@ant-design/icons';
import EventModel from "@/domain/EventModel";


export const EventCard: React.FC<EventModel> = ({
  eventBannerURL,
  date,
  eventName,
  venueName,
  price,
  isInterested,
  interestedCount,
}) => {
  
  // Format Date
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedMonth = monthNames[date.getMonth()]; // Convert zero-based month to string
  const formattedDay = date.getDate().toString(); // Get day
  const formattedYear = date.getFullYear().toString(); // Get day
  const { t } = useTranslation();
  const [isFavorited, setIsFavorited] = useState( isInterested ?? false );
  
  const toggleFavorite = () => {
    setIsFavorited((prev) => !prev);
  };
  
  return (
    <s.CardWrapper>
      <s.ImageSection>
        <s.EventImage src={eventBannerURL} alt={eventName} />

        {/* Bookmark Icon */}
        <s.BookmarkIcon onClick={toggleFavorite}>
                  {isFavorited ? (
                    <StarFilled style={{ fontSize: '38px', color: '#FFD700' }} />
                  ) : (
                    <StarOutlined style={{ fontSize: '38px', color: 'white' }} />
                  )}
        </s.BookmarkIcon>
      </s.ImageSection>


      <s.ContentSection>
  <s.EventDetails>
    <s.Title>{eventName}</s.Title>
    <s.Venue>{venueName}</s.Venue>
    <s.Time>{formattedDay + " " + formattedMonth + " " + formattedYear}</s.Time>

    <s.MetaInfo>
  {/* Price on the left */}
  {price && (
    <s.PriceSection>
      <s.PriceIcon
        src={"https://cdn.builder.io/api/v1/image/assets/TEMP/75e267775796d2beb53e040c1b6a4e1b918da2c64177d75c54600544babd7cbb"}
      />
                <s.Price> {price != "FREE" ?  t('homePage.from') + " " + price : t('homePage.free')}</s.Price>
    </s.PriceSection>
  )}

  {/* InterestBadge on the right */}
  <s.InterestBadge>
    <s.InterestCount>{interestedCount ?? 0} interested</s.InterestCount>
  </s.InterestBadge>

</s.MetaInfo>

  </s.EventDetails>
</s.ContentSection>


    </s.CardWrapper>
  );
};

