import React from 'react';
import styled from 'styled-components';
import bgPattern from '@/assets/images/bg-pattern-pages.svg';

interface PatternBackgroundProps {
  children: React.ReactNode;
  color?: string;
  patternColor?: string;
  className?: string;
}

const PatternContainer = styled.div<{ $color?: string; $patternColor?: string }>`
  position: relative;
  width: 100%;
  overflow: hidden;
  background-size: cover;
  background-color: ${({ $color }) => $color || 'transparent'};
  --pattern-color: ${({ $patternColor }) => $patternColor || 'currentColor'};
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${bgPattern});
    background-size: contain;
    background-position: 0 0;
    background-repeat: repeat;
    opacity: 0.15;
    ${({ $patternColor }) => $patternColor && `
      filter: brightness(0) invert(1);
      opacity: 0.2;
    `}
    z-index: 0;
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  children,
  color,
  patternColor,
  className = ''
}) => {
  return (
    <PatternContainer 
      $color={color}
      $patternColor={patternColor}
      className={className}
    >
      <ContentWrapper>{children}</ContentWrapper>
    </PatternContainer>
  );
};

export default PatternBackground;
