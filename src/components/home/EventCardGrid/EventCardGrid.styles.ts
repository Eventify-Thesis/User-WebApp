import styled from "styled-components";

export const Section = styled.section`
  margin: 60px auto 0; /* Center the section */
  padding: 50px 50px;
  width: 100%;
  background-color: rgb(225, 226, 227);
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content inside */

  @media (max-width: 991px) {
    margin-top: 40px;
    padding: 0 20px;
  }
`;


export const Title = styled.h2`
  color: #000000;
  font-family: Montserrat, sans-serif;
  font-size: 30px;
  font-weight: 700;
  align-self: flex-start; /* Aligns the title to the left */
  margin-left: 10px; /* Adjust as needed for alignment */

  @media (max-width: 991px) {
    margin-top: 13px;
  }
`;

export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 40px;

  @media (max-width: 991px) {
    grid-template-columns: repeat(1, 1fr); /* Stack on small screens */
  }
`;
