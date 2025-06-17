import styled from "styled-components";
import { Carousel } from "antd";

export const StyledCarousel = styled(Carousel)`
  width: 100%;
  margin: 0 auto;
  padding-top: 30px;
  padding-bottom: 50px;

  .slick-prev,
  .slick-next {
    width: 40px !important;
    height: 40px !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.9) !important;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    z-index: 2;
  }

  .slick-prev:hover,
  .slick-next:hover {
    background-color: rgba(0, 0, 0, 0.9);
      }

  .slick-prev::after,
  .slick-next::after {
    display: none !important;  /* Hide the default arrows */
  }
  
  /* Custom dots/pagination */
  .slick-dots {
    bottom: 25px;
    
    li {
      margin: 0 4px;
      
      button {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        
        &::before {
          display: none;
        }
      }
      
      &.slick-active button {
        background: #000;
        width: 24px;
        border-radius: 5px;
      }
    }
  }
`;

export const PromoTextWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

export const PromoText = styled.div`
  color: var(--primary-color);
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
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 10px 15px -3px rgba(0, 0, 0, 0.15),
      0 4px 6px -2px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 750px) {
    width: 90%;
    border-radius: 10px;
    
    &::after {
      border-radius: 10px;
    }
  }
`;
