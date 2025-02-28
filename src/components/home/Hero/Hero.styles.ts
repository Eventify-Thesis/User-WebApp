import styled, { keyframes } from "styled-components";

export const HeroWrapper = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
`;

export const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
`;

export const Subheading = styled.p`
  font-size: 18px;
  margin-bottom: 10px;
`;

export const Heading = styled.h1`
  font-size: 50px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const fadeAnimation = keyframes`
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

export const HighlightText = styled.span`
  color: #2ecc71;
  animation: ${fadeAnimation} 0.8s ease-in-out;
`;

