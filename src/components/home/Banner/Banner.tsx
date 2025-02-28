import React, { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import * as s from "./Banner.styles"; // Import styles

interface BannerProps {
  images: string[];
  promoText?: string;
}

export const Banner: React.FC<BannerProps> = ({ images, promoText = "Special Promotion Events" }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 750);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const groupedImages = isMobile
    ? images.map((image) => [image])
    : images.reduce((acc, image, index) => {
        if (index % 2 === 0) acc.push([image]);
        else acc[acc.length - 1].push(image);
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
              {pair.map((image, idx) => (
                <s.SlideImage key={idx} src={image} alt={`Slide ${index * 2 + idx + 1}`} />
              ))}
            </s.ImageWrapper>
          </s.SlideContainer>
        ))}
      </s.StyledCarousel>
    </div>
  );
};
