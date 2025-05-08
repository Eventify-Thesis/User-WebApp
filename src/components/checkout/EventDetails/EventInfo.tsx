import { Icon } from '@iconify/react/dist/iconify.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';
import { Text, Title, Stack, Group, Box } from '@mantine/core';

interface EventInfoProps {
  title: string;
  venue: string;
  address: string;
  date: string;
}

export const EventInfo: React.FC<EventInfoProps> = ({
  title,
  venue,
  address,
  date,
}) => {
  const { t, i18n } = useTranslation();

  const formattedDate = dayjs(date)
    .locale(i18n.language)
    .format('dddd, MMMM D, YYYY HH:mm');
  return (
    <Box style={{ color: 'white', flex: 1, minWidth: '240px' }}>
      <Stack gap="md">
        <Title
          order={1}
          size="h3"
          fw={600}
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #1ADCFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </Title>
        <Separator />
        <Stack gap="xs">
          <Group gap="xs">
            <Icon
              icon="bytesize:location"
              width="20"
              height="20"
              style={{ color: '#1ADCFF' }}
            />
            <Text
              size="sm"
              fw={500}
              style={{
                color: '#E2F8FF',
                letterSpacing: '0.01em',
                textShadow: '0 0 20px rgba(26, 220, 255, 0.15)',
              }}
            >
              {venue}
            </Text>
          </Group>
          <Text
            size="sm"
            fw={500}
            ml={28}
            style={{
              color: '#E2F8FF',
              opacity: 0.8,
              letterSpacing: '0.01em',
            }}
          >
            {address}
          </Text>
          <Group gap="xs" mt="md">
            <Icon
              icon="lucide:calendar"
              width="20"
              height="20"
              style={{ color: '#1ADCFF' }}
            />
            <Text
              size="sm"
              fw={500}
              style={{
                color: '#E2F8FF',
                textTransform: 'capitalize',
                letterSpacing: '0.01em',
                textShadow: '0 0 20px rgba(26, 220, 255, 0.15)',
              }}
            >
              {formattedDate}
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Box>
  );
};

const Separator = styled.hr`
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin: 16px 0;
  width: 100%;
`;
