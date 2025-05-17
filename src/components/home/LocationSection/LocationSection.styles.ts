import styled from "styled-components";

export const LocationWrapper = styled.section`
  padding: 30px 80px;

  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

export const SectionTitle = styled.h2`  
  color: white;
  font-family:
    Inter,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif; 
  font-size: 30px;
  font-weight: 700;
  align-self: flex-start; /* Aligns the title to the left */
  margin-left: 10px; /* Adjust as needed for alignment */
  margin-bottom: 16px;
  @media (max-width: 991px) {
    margin-top: 13px;
  }
`;

export const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
  }
`;

export const LocationCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
  }
`;

export const LocationImage = styled.img`
  width: 100%;
  aspect-ratio: 1.034;
  object-fit: cover;
`;
export const LocationName = styled.h3`
  position: absolute;
  bottom: 57px;
  left: 15px;
  color: white;
  font-size: 28px;
  font-family:
    Inter,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-weight: 700;

  @media (max-width: 991px) {
    bottom: 40px;
  }
`;