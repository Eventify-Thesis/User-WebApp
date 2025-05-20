import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Text,
  Tabs,
  Grid,
  Paper,
  Center,
  Stack,
  Flex,
} from '@mantine/core';
import { IconCalendar, IconMusic, IconTicket } from '@tabler/icons-react';
import EventCard from '../EventCard/EventCard';
import './ShowcaseEventSection.css';

interface Props {
  eventsThisWeek: any[];
  eventsThisMonth: any[];
}

const EmptyState = ({ type }: { type: 'weekend' | 'month' }) => {
  return (
    <Center mih={300} w="100%">
      <Paper
        radius="md"
        style={{
          backgroundColor: '#27272A',
          backdropFilter: 'blur(10px)',
          maxWidth: 500,
          padding: '0rem',
          width: '100%',
        }}
      >
        <Stack align="center" gap="md">
          <Box style={{ color: 'var(--primary-color)' }}>
            {type === 'weekend' ? (
              <IconMusic size={40} />
            ) : (
              <IconCalendar size={40} />
            )}
          </Box>

          <Text fw={700} size="xl" style={{ color: 'var(--primary-color)' }}>
            {type === 'weekend'
              ? 'No Weekend Vibes Yet! 🎵'
              : 'No Monthly Events Yet! 📅'}
          </Text>

          <Text ta="center" size="md">
            {type === 'weekend'
              ? "Don't worry! We're cooking up some awesome weekend events. Check back soon for the latest party plans! 🎉"
              : "Stay tuned! We're planning some epic events for this month. Keep checking back for updates! ✨"}
          </Text>

          <Box style={{ color: 'var(--primary-color)' }}>
            <IconTicket size={30} />
          </Box>
        </Stack>
      </Paper>
    </Center>
  );
};

const ShowcaseEventSection: React.FC<Props> = ({
  eventsThisWeek,
  eventsThisMonth,
}) => {
  const [activeTab, setActiveTab] = useState<'weekend' | 'month'>('weekend');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currentEvents =
    activeTab === 'weekend' ? eventsThisWeek : eventsThisMonth;

  const handleEventClick = (event: any) => {
    if (event.url) {
      navigate(`${event.url}-${event.id}`);
    } else {
      navigate(`${event.eventName}-${event.id}`);
    }
  };

  return (
    <Box
      bg="#27272A"
      py={{ base: 'md', sm: 'xl' }}
      px={{ base: 'xs', sm: 'md' }}
    >
      <Container size="xl">
        <Flex justify="center" mb={40}>
          <Box
            style={{
              background: 'rgba(255, 255, 255, 0.07)',
              borderRadius: 30,
              padding: '4px 8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Flex gap={10} align="center">
              <Box
                style={{
                  cursor: 'pointer',
                  padding: '8px 20px',
                  borderRadius: 25,
                  background:
                    activeTab === 'weekend'
                      ? 'linear-gradient(to right, #ffe046, #ff9800)'
                      : 'transparent',
                  color: activeTab === 'weekend' ? 'white' : '#888',
                  fontWeight: activeTab === 'weekend' ? 600 : 400,
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setActiveTab('weekend')}
              >
                {t('homePage.thisWeekend')}
              </Box>
              <Text c="dimmed" fw={300}>
                /
              </Text>
              <Box
                style={{
                  cursor: 'pointer',
                  padding: '8px 20px',
                  borderRadius: 25,
                  background:
                    activeTab === 'month'
                      ? 'linear-gradient(to right, #ff9800, #ffe046)'
                      : 'transparent',
                  color: activeTab === 'month' ? 'white' : '#888',
                  fontWeight: activeTab === 'month' ? 600 : 400,
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setActiveTab('month')}
              >
                {t('homePage.thisMonth')}
              </Box>
            </Flex>
          </Box>
        </Flex>

        <Box mt="md">
          <Grid gutter={{ base: 'md', sm: 'lg', md: 'xl' }}>
            <Grid.Col span={12} mb="lg">
              <Paper p="md" radius="md" bg="transparent">
                <Text fw={700} c="white" style={{ fontSize: 32 }}>
                  {t('homePage.popularEvents')}
                </Text>
                <Text c="#facc15" mt={4} style={{ fontSize: 24 }}>
                  {activeTab === 'weekend'
                    ? t('homePage.thisWeekend')
                    : t('homePage.thisMonth')}
                </Text>
              </Paper>
            </Grid.Col>

            {!currentEvents || currentEvents.length === 0 ? (
              <Grid.Col span={12}>
                <EmptyState type={activeTab} />
              </Grid.Col>
            ) : (
              <>
                {currentEvents.map((event) => (
                  <Grid.Col
                    key={event.id}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Box style={{ width: '100%', height: '100%' }}>
                      <EventCard
                        className="event-card-showcase"
                        {...event}
                        onClick={() => handleEventClick(event)}
                      />
                    </Box>
                  </Grid.Col>
                ))}
              </>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default ShowcaseEventSection;
