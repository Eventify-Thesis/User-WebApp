import React, { useState, useEffect } from "react";
import * as S from "./Hero.styles";
import video from "@/assets/video.mp4";

const words = ["Events", "Tickets", "Bookings"]; // Rotating words

export const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <S.HeroWrapper>
      <S.VideoBackground autoPlay loop muted playsInline>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </S.VideoBackground>

      <S.Overlay />
      <S.HeroContent>
        <S.Subheading>The Best Ticket Platform Experience</S.Subheading>
        <S.Heading>
          Your Next <S.HighlightText key={index}>{words[index]}</S.HighlightText>{" "}
          Starts Here!
        </S.Heading>
      </S.HeroContent>
    </S.HeroWrapper>
  );
};