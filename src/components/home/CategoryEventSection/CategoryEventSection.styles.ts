import styled from 'styled-components';

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

export const SectionTitle = styled.div`
  text-align: left; /* Left align the title */
  margin-bottom: 30px;
  margin-left: 30px;  /* Moves the section title 20px to the right */
  
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

export const GridWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: nowrap;
`;

export const EventCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  max-width: 350px; /* Fixed width for cards */
  box-sizing: border-box;
  margin-right: 16px;

  &:last-child {
    margin-right: 0;
  }

  /* Make the cards look clean and visible */
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

