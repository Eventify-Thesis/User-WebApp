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
  box-shadow: 0 10px 12px rgba(255, 255, 255, 0.5); /* Lighter shadow */

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px rgba(255, 255, 255, 0.3); /* Stronger shadow on hover */
  }
`;




export const EventImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: cover;
  transition: transform 0.5s ease-in-out;
`;


export const ImageSection = styled.div`
  position: relative;
  min-height: 254px;
  overflow: hidden; /* Prevents overflow */
  
  &:hover ${EventImage} {
    transform: scale(1.1);
  }

  &:hover::after {
    animation: shine 0.8s ease-in-out forwards;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 70%
    );
  }

  @keyframes shine {
    from {
      left: -100%;
    }
    to {
      left: 120%;
    }
  }
`;

export const BookmarkIcon = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
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
  justify-content: space-between; /* Ensures left and right alignment */
  align-items: center;
  padding: 18px;
  position: relative; /* Allows absolute positioning inside */
`;

export const PriceAndInterestWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* Adds space between Price and InterestBadge */
  margin-left: auto; /* Pushes it to the right */
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
  justify-content: space-between; /* Default: Pushes left and right apart */
  align-items: center;
  margin-top: 10px;
  opacity: 0.9;
  transition: opacity 0.2s ease;
  width: 100%;

  ${CardWrapper}:hover & {
    opacity: 1;
  }

  /* Make InterestBadge take a new row for specific widths */
  @media (max-width: 1475px) and (min-width: 991px),
         (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start; /* Align content to the left */
    gap: 8px; /* Adds spacing between rows */
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
  color: #FFC107;
  font-size: 20px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  height: 40px;
  white-space: nowrap;

  /* When in column mode, make it full-width */
  @media (max-width: 1475px) and (min-width: 991px),
         (max-width: 500px) {
    align-self: flex-start; /* Align it to the left */
  }
`;




export const InterestCount = styled.span`
  font-size: 20px; /* Bigger size for emphasis */
  font-weight: 700; /* Extra bold */
  color: #FFC107; /* Bold yellow text */
`;



export const InterestIconSmall = styled.img`
  width: 22px;
  height: 22px;
`;


