import React from 'react';
import styled, { keyframes } from 'styled-components';

const TimerContainer = styled.div`
  margin-bottom: 48px;
  text-align: center;
`;

const TimeNumber = styled.div`
  font-size: 6rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;
`;

const TimerBarBackground = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  overflow: hidden;
`;

const fillAnimation = (widthPercent: number) => keyframes`
  from {
    width: 100%;
  }
  to {
    width: ${widthPercent}%;
  }
`;

const TimerBarFill = styled.div<{ widthPercent: number }>`
  height: 100%;
  background-color: #f6ce3a;
  width: ${props => props.widthPercent}%;
  border-radius: 6px;
  transition: width 1s linear;
`;

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;

  return (
    <TimerContainer>
      <TimeNumber>{timeLeft}</TimeNumber>
      <TimerBarBackground>
        <TimerBarFill widthPercent={percentage} />
      </TimerBarBackground>
    </TimerContainer>
  );
};

export default Timer;
