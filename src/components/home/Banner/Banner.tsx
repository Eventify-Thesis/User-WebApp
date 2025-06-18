import React, { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { useNavigate } from "react-router-dom";
import * as s from "./Banner.styles";
import EventModel from "@/domain/EventModel";
import placeholderImage from "@/assets/images/placeholder_image.png";
interface BannerProps {
  events?: EventModel[];
  images?: string[];
  promoText?: string;
}

export const Banner: React.FC<BannerProps> = ({ events, images: propImages, promoText = "Special Promotion Events" }) => {
  const navigate = useNavigate();
  const images = events?.map(event => event.eventLogoUrl) || propImages || [];
  
  const handleImageClick = (event: any) => {
    if (event.url) {
      navigate(`${event.url}-${event.id}`);
    } else {
      navigate(`${event.eventName}-${event.id}`);
    }
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const groupedImages = isMobile
    ? images.map((image) => [image || placeholderImage])
    : images.reduce((acc, image, index) => {
        if (index % 2 === 0) acc.push([image || placeholderImage]);
        else acc[acc.length - 1].push(image || placeholderImage);
        return acc;
      }, [] as string[][]);

  return (
    <div>
      {/* Promotion Text Row with Typewriter Effect */}
      <s.PromoTextWrapper>
        <s.PromoText>
          <Typewriter
            words={[promoText]} // The text to be typed
            loop={0} // Infinite loop
            cursor
            cursorStyle="_"
            typeSpeed={70} // Speed of typing
            deleteSpeed={50} // Speed of deleting
            delaySpeed={2000} // Delay before restarting
          />
        </s.PromoText>
      </s.PromoTextWrapper>

      {/* Carousel */}
      <s.StyledCarousel arrows infinite={true} draggable={true} autoplay={{ dotDuration: true }}>
        {groupedImages.map((pair, index) => (
          <s.SlideContainer key={index}>
            <s.ImageWrapper>
              {pair.map((image, idx) => {
                const eventIndex = index * 2 + idx;
                const event = events?.[eventIndex];
                return (
                  <s.SlideImage 
                    key={idx} 
                    src={image} 
                    alt={event?.eventName || `Slide ${eventIndex + 1}`}
                    onClick={() => event && handleImageClick(event)}
                    style={{ cursor: event ? 'pointer' : 'default' }}
                  />
                );
              })}
            </s.ImageWrapper>
          </s.SlideContainer>
        ))}
      </s.StyledCarousel>
    </div>
  );
};
