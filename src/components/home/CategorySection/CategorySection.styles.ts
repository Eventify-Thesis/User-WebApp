import styled from "styled-components";

// SECTION
export const Section = styled.section`
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #000; /* Black background */
  padding: 0 0; /* Remove any left and right padding/margin */
  overflow: hidden; /* Ensures cards don’t overflow container */
`;

// TITLE
export const Title = styled.h2`
  color: #fff;
  font-family: Montserrat, sans-serif;
  font-size: 24px;
  text-align: left;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// CARD STYLING
export const CategoryCard = styled.article`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 350px; /* Larger card width */
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  background-color: transparent;
  position: relative;
  margin: 0 30px; /* Increased spacing between cards for infinity effect */

  &:hover {
    transform: translateY(-5px);
  }
`;

// IMAGE STYLING
export const CategoryImage = styled.div<{ imageUrl?: string }>`
  width: 100%;
  height: 220px;
  background-image: ${({ imageUrl }) =>
    imageUrl ? `url(${imageUrl})` : "none"};
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  transition: transform 0.3s ease;

  ${CategoryCard}:hover & {
    transform: scale(1.05);
  }
`;

// CATEGORY NAME
export const CategoryName = styled.h3`
  margin-top: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  position: absolute;
  bottom: 15px;
  left: 15px;
  z-index: 1;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
`;

// DESCRIPTION (added placeholder)
export const Description = styled.p`
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  margin: 15px;
  z-index: 1;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1.4;
`;
