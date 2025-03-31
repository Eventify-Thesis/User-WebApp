import { Card } from "antd";
import styled from "styled-components";

export const StyledCard = styled(Card)`
  width: 150px;
  height: 100px;
  margin: 8px;
  overflow: hidden;
  position: relative;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none; /* Remove default border */
  transition: transform 0.3s ease-in-out, border 0.3s ease-in-out; /* Smooth transition */

  &:hover {
    transform: scale(1.05);
    border: 1px solid white; /* White border on hover */
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const TitleOverlay = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  z-index: 2;
`;
