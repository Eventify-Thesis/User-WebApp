import styled from "styled-components";

export const CarouselContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
`;

export const TicketCard = styled.div`
  background: #4a4a55;
  color: white;
  border-radius: 16px;
  margin: 0 auto;
  overflow: hidden;
  padding-bottom: 16px;
  position: relative;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 250px; /* Ensure equal height for all cards */
`;

export const EventTitle = styled.h3`
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #fff;
`;

export const TicketSlide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const EventImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 12px;
`;

export const EventImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
`;

export const TicketDetails = styled.div`
  padding: 16px;
  text-align: left;
  width: 100%;
  font-size: 14px;
  flex-grow: 1;
  
  p {
    margin: 4px 0;
    strong {
      color: #45d65a;
    }
  }
`;

export const DetailText = styled.p`
  font-size: 14px;
  margin: 5px 0;
`;

export const QRCodeSection = styled.div`
  text-align: center;
  font-size: 12px;
  color: #45d65a;
  cursor: pointer;
  margin-top: 8px;
`;

export const TicketSectionContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px; /* Match OrderSection width */
  margin: 0 auto;
  background: #4a4a55;
  padding: 16px;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    background: #333;
    border-radius: 50%;
    bottom: -25px;
  }

  &::before {
    left: -25px;
  }

  &::after {
    right: -25px;
  }
`;

