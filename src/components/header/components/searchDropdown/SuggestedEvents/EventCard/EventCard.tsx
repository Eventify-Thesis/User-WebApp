import React from "react";
import EventModel from "@/domain/EventModel";
import { CalendarOutlined } from "@ant-design/icons";
import * as s from "./EventCard.styles";
import { useTranslation } from "react-i18next";

interface EventCardProps extends EventModel {
  minimumPrice: string;
  startTime: Date;
}

export const EventCard: React.FC<EventCardProps> = ({ eventName, minimumPrice, startTime, eventBannerUrl }) => {
  const { t } = useTranslation();
  let formattedDate: string;
  if (startTime && startTime instanceof Date && !isNaN(startTime.getTime())) {
    formattedDate = `${startTime.getDate()} ${t(`monthNames.${startTime.getMonth()}`)} ${startTime.getFullYear()}`;
  } else {
    formattedDate = t('searchBar.noDate');
  }

  return (
    <s.StyledCard hoverable cover={<img src={eventBannerUrl} alt={eventName} />}>
      <s.EventTitle title={eventName}>{eventName}</s.EventTitle>
      <s.EventPrice>{minimumPrice}</s.EventPrice>
      <s.EventDate><CalendarOutlined /> {formattedDate}</s.EventDate>
    </s.StyledCard>
  );
};
