import styled from 'styled-components';

export const Time = styled.time`
  font-weight: 600; /* Slightly bolder */
  font-size: 20px; /* Bigger size */
  color: #007bff; /* Eye-catching blue */
  text-transform: uppercase;
  font-family: Montserrat, sans-serif;
  margin-top: 10px;
  background-color: rgba(0, 123, 255, 0.1); /* Light blue background for contrast */
  padding: 4px 8px; /* Adds some spacing */
  border-radius: 4px; /* Slightly rounded corners */
`;

export const CardWrapper = styled.article`
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const ImageSection = styled.div`
  position: relative;
  min-height: 254px;
`;

export const EventImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
`;

export const BookmarkIcon = styled.img`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 48px;
  height: 48px;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

export const LocationBadge = styled.div`
  position: absolute;
  top: 14px;
  left: 18px;
  background-color: #2b293d;
  color: #fff;
  padding: 2px 10px;
  border-radius: 5px;
  font-size: 20px;
`;

export const CategoryBadge = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #ffe047;
  color: #2d2c3c;
  padding: 5px 10px;
  border-radius: 0 6px 0 0;
  font-size: 18px;
  font-weight: 600;
`;

export const ContentSection = styled.div`
  display: flex;
  justify-content: space-between; /* Push elements to edges */
  align-items: center; /* Align items vertically */
  padding: 18px;
`;


export const DateSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Montserrat, sans-serif;
  text-align: center;
`;

export const Month = styled.div`
  color: rgba(69, 57, 180, 1);
  font-size: 24px;
  font-weight: 600;
`;

export const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
`;

export const Day = styled.div`
  color: #2d2c3c;
  font-size: 26px;
  font-weight: 700;
`;

export const Separator = styled.div`
  color: #2d2c3c;
  font-size: 26px;
  font-weight: 700;
`;

export const EventDetails = styled.div`
  flex: 1;
  font-family: "Open Sans", sans-serif;
`;

export const Title = styled.h3`
  color: #2d2c3c;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const Venue = styled.p`
  color: #5a5a5a;
  font-size: 18px;
  font-weight: 600;
  margin: 10px 0;
`;

export const MetaInfo = styled.div`
  display: flex;
  gap: 9px;
  margin-top: 10px;
  opacity: 0.9;
  transition: opacity 0.2s ease;

  ${CardWrapper}:hover & {
    opacity: 1;
  }
`;

export const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const PriceIcon = styled.img`
  width: 22px;
  height: 22px;
`;

export const Price = styled.span`
  color: #ff5722; /* Brighter color for emphasis */
  font-size: 22px; /* Increased font size */
  font-weight: 700; /* Bolder font */
  background-color: rgba(255, 87, 34, 0.1); /* Light background for contrast */
  padding: 4px 8px; /* Padding for better visibility */
  border-radius: 4px; /* Rounded corners */
`;


export const InterestSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const InterestIcon = styled.img`
  width: 21px;
  height: 21px;
  border-radius: 1px;
`;

export const InterestBadge = styled.div`
  background-color: rgba(255, 224, 71, 0.2); /* Light yellow background */
  color: #FFC107; /* Bold yellow text */
  font-size: 20px; /* Same size as Price */
  font-weight: 700;
  padding: 4px 12px; /* Similar padding to Price */
  border-radius: 5px;
  display: flex;
  align-items: center;
  height: 40px; /* Match PriceSection */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
`;



export const InterestCount = styled.span`
  font-size: 20px; /* Bigger size for emphasis */
  font-weight: 500; /* Extra bold */
  color: #FFC107; /* Bold yellow text */
`;



export const InterestIconSmall = styled.img`
  width: 22px;
  height: 22px;
`;


