import React from "react";
import EventModel from "@/domain/EventModel";
import { CalendarOutlined } from "@ant-design/icons";
import * as s from "./EventCard.styles";
import { useTranslation } from "react-i18next";

export const EventCard: React.FC<EventModel> = ({ eventName, price, date, eventBannerURL }) => {
  // Format Date
  const { t } = useTranslation();
  const formattedDate = `${date.getDate()} ${t(`monthNames.${date.getMonth()}`)} ${date.getFullYear()}`;

  return (
    <s.StyledCard hoverable cover={<img src={eventBannerURL} alt={eventName} />}>
      <s.EventTitle title={eventName}>{eventName}</s.EventTitle>
      <s.EventPrice>{price}</s.EventPrice>
      <s.EventDate><CalendarOutlined /> {formattedDate}</s.EventDate>
    </s.StyledCard>
  );
};
