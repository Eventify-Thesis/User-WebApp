import { Card } from "antd";
import styled from "styled-components";

export const StyledCard = styled(Card)`
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
  transition: transform 0.3s ease-in-out, border 0.3s ease-in-out; /* Smooth transition */

  &:hover {
    transform: scale(1.05);
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


export const EventTitle = styled.h4`
  font-size: 14px;
  font-weight: bold;
  color: white;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* Prevents overflow */
`;

export const EventPrice = styled.p`
  color: #00ff99;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
`;

export const EventDate = styled.p`
  color: #cccccc;
  font-size: 12px;
  gap: 4px;
  display: flex;
  align-items: center;
  margin-top: auto; /* Pushes date to bottom */
`;