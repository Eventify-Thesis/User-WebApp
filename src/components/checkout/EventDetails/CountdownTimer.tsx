import { useResponsive } from '@/hooks/useResponsive';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface CountdownTimerProps {
  expireIn?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expireIn = 0,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(expireIn);

  useEffect(() => {
    if (expireIn > 0) {
      setTimeLeft(expireIn);
    }
  }, [expireIn]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <TimerWrapper>
      <TimerContainer>
        <TimerLabel>{t('checkout.finishOrderIn')}</TimerLabel>
        <TimerDisplay>
          <TimeUnit>
            <TimeValue>{String(minutes).padStart(2, '0')}</TimeValue>
            <Separator>:</Separator>
          </TimeUnit>
          <TimeValue>{String(seconds).padStart(2, '0')}</TimeValue>
        </TimerDisplay>
      </TimerContainer>
    </TimerWrapper>
  );
};

const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
  justify-content: center;
  width: 11.875rem;
  height: 100%;
`;

const TimerContainer = styled.div`
  justify-content: center;
  border-radius: 36px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.25);
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  padding: 33px 1px 34px;
`;

const TimerLabel = styled.div`
  color: #fff;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const TimerDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const TimeUnit = styled.div`
  display: flex;
  align-items: center;
`;

const TimeValue = styled.span`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
`;

const Separator = styled.span`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0 2px;
`;
