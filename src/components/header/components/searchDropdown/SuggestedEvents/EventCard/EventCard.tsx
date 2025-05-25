import React from "react";
import EventModel from "@/domain/EventModel";
import * as s from "./EventCard.styles";
import { useTranslation } from "react-i18next";
import { IconCalendar } from "@tabler/icons-react";

interface EventCardProps extends EventModel {
  minimumPrice: string;
  startTime: Date;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ eventName, minimumPrice, startTime, eventLogoUrl, onClick }) => {
  const { t } = useTranslation();
  let formattedDate: string;
  if (startTime && startTime instanceof Date && !isNaN(startTime.getTime())) {
    formattedDate = `${startTime.getDate()} ${t(`monthNames.${startTime.getMonth()}`)} ${startTime.getFullYear()}`;
  } else {
    formattedDate = t('searchBar.noDate');
  }

  return (
    <s.StyledCard hoverable cover={<img src={eventLogoUrl} alt={eventName} />}
    onClick={onClick}>
      <s.EventTitle title={eventName}>{eventName}</s.EventTitle>
      <s.EventPrice>
        {minimumPrice ? (minimumPrice === '0' ? t('searchBar.free') : `${t('searchBar.from')} ${parseInt(minimumPrice).toLocaleString()} Đ`) : t('searchBar.noPrice')}
      </s.EventPrice>
      <s.EventDate>
        <IconCalendar size={20} stroke={1.5} />
        {formattedDate}
      </s.EventDate>
    </s.StyledCard>
  );
};
