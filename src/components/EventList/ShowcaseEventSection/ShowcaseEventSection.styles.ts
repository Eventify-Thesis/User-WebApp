import styled from "styled-components";

export const Section = styled.section`
  width: 100%;
  background-color: #1a1a1a;
  padding: 80px 40px;
  color: white;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }

  @media (max-width: 670px) {
    padding: 40px 0px;
  }
`;

export const TabSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 18px;
  margin-bottom: 24px;
`;

export const Tab = styled.div<{ active: boolean }>`
  cursor: pointer;
  font-weight: ${({ active }) => (active ? '500' : '400')};
  color: ${({ active }) => (active ? '#fff' : '#888')};
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
  }

  ${({ active }) =>
    active &&
    `
      color: #fff;
      font-weight: 700;
      text-shadow: 0 0 10px rgba(255, 87, 51, 0.8);
      transition: color 0.3s, text-shadow 0.3s;
  `}
`;

export const Slash = styled.span`
  color: #666;
`;

export const SectionTitleCard = styled.div`
  border-radius: 10px;
  overflow: hidden;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: opacity 0.3s ease, transform 0.3s ease;
  width: 100%; /* Make the section title card fit nicely within the grid */
  grid-column: span 2; /* Make it wider than the regular event cards */

  &:hover {
    opacity: 0.8;
    transform: translateY(-10px);
  }

  div:first-child {
    font-size: 32px;
    font-weight: 700;
  }

  div:last-child {
    font-size: 24px;
    margin-top: 4px;
    color: #facc15;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Dynamic width of cards */
  gap: 32px 24px;
  justify-items: center;
  padding: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); 
  }
  
  @media (max-width: 485px) {
    grid-template-columns: repeat(1, 1fr); 
  }
`;

export const CardWrapper = styled.div`
  justify-content: center;
  width: 100%; /* Ensure all event cards use available space */
`;

export const EventCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Flexible cards in the first row */
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); 
  }

  @media (max-width: 485px) {
    grid-template-columns: repeat(1, 1fr); 
  }
`;
