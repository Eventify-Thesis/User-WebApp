import styled from "styled-components";
import { Carousel } from "antd";

export const StyledCarousel = styled(Carousel)`
  width: 100%;
  margin: 0 auto;
  padding-top: 30px;
  padding-bottom: 50px;
  background-color: black;

  .slick-prev,
  .slick-next {
    width: 40px;
    height: 40px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .slick-prev:hover,
  .slick-next:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }

  .slick-prev::after,
  .slick-next::after {
    font-size: 18px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 50%;
    position: relative;
    left: 0px;
    top: -1.2px;
  }
`;

export const PromoTextWrapper = styled.div`
  width: 100%;
  text-align: center;
  padding: 20px 0;
  background: black;
`;

export const PromoText = styled.div`
  color: white;
  font-size: clamp(16px, 4vw, 32px);
  font-weight: bold;
  padding: 10px 20px;
  text-align: center;
`;


export const SlideContainer = styled.div`
  width: 100%;
`;

export const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;

  @media (max-width: 750px) {
    flex-direction: column; /* Stack images vertically */
  }
`;

export const SlideImage = styled.img`
  width: 48%;
  height: clamp(250px, 50vh, 450px); /* Responsive height */
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 750px) {
    width: 90%; /* Full width for smaller screens */
  }
`;
