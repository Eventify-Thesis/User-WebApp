import React from "react";
import { Card } from "antd";
import styled from "styled-components";
import EventModel from "@/domain/EventModel";
import { CalendarOutlined } from "@ant-design/icons";

const StyledCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.6); /* Transparent background */
  backdrop-filter: blur(8px);
  color: white;
  height: 100%; /* Ensure equal height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: none; /* Remove default border */
  transition: border 0.3s ease-in-out; /* Smooth transition */

  &:hover {
    border: 1px solid white; /* White border on hover */
  }

  .ant-card-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .ant-card-cover img {
    height: 150px; /* Consistent image height */
    object-fit: cover;
  }
`;


const EventTitle = styled.h4`
  font-size: 14px;
  font-weight: bold;
  color: white;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Prevents overflow */
`;

const EventPrice = styled.p`
  color: #00ff99;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
`;

const EventDate = styled.p`
  color: #cccccc;
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-top: auto; /* Pushes date to bottom */
`;

export const EventCard: React.FC<EventModel> = ({ eventName, price, date, eventBannerURL }) => {
  // Format Date
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  return (
    <StyledCard hoverable cover={<img src={eventBannerURL} alt={eventName} />}>
      <EventTitle title={eventName}>{eventName}</EventTitle>
      <EventPrice>{price}</EventPrice>
      <EventDate><CalendarOutlined /> {formattedDate}</EventDate>
    </StyledCard>
  );
};
