import { useResponsive } from '@/hooks/useResponsive';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Stack, Text } from '@mantine/core';

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
    <Box
      w="11.875rem"
      h="100%"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <Paper
        radius="xl"
        p="lg"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.38)',
        }}
      >
        <Stack align="center" gap="md">
          <Text c="white" size="sm" fw={500} style={{ letterSpacing: '0.01em', opacity: 0.9 }}>
            {t('checkout.finishOrderIn')}
          </Text>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Text c="white" size="xl" fw={600} style={{ letterSpacing: '-0.02em' }}>
                {String(minutes).padStart(2, '0')}
              </Text>
              <Text c="white" size="xl" fw={600} mx={2} style={{ letterSpacing: '-0.02em' }}>
                :
              </Text>
            </Box>
            <Text c="white" size="xl" fw={600} style={{ letterSpacing: '-0.02em' }}>
              {String(seconds).padStart(2, '0')}
            </Text>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};
