import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import { useGetShowSchedules } from '@/queries/useGetShowSchedules';
import { HeroSection } from '@/components/event-detail/HeroSection/HeroSection';
import { DescriptionSection } from '@/components/event-detail/DescriptionSection/DescriptionSection';
import { OrganizerInfoSection } from '@/components/event-detail/OrganizerInfoSection/OrganizerInfoSection';
import {
  Box,
  Paper,
  Text,
  Title,
  LoadingOverlay,
  Stack,
  useMantineTheme,
  Loader,
  Group,
  ActionIcon,
  Button,
} from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import './EventDetailPage.css';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import ShowScheduleCalendar from '@/components/event-detail/ShowScheduleCalendar/ShowScheduleCalendar';
import { useGetEventShowDetail } from '@/queries/useGetEventShowDetail';
import { GameSection } from '@/components/event-detail/GameSection/GameSection';
import { CommentSection } from '@/components/event-detail/CommentSection/CommentSection';

const PurchasedEventDetailPage: React.FC = () => {
  const { slug, showId } = useParams();
  const eventId = slug?.split('-')?.[slug?.split('-')?.length - 1];
  const { data: event, isLoading: eventLoading } = useGetEventDetail(eventId);
  const { t } = useTranslation();
  const theme = useMantineTheme();

  // Show schedule state and data
  const { data: showDetail, isLoading: showsLoading } = useGetEventShowDetail(
    eventId,
    showId,
  );
  const {
    data: schedules,
    isLoading: schedulesLoading,
    error: schedulesError,
  } = useGetShowSchedules(eventId, showId);

  if (eventLoading) {
    return <Loader />;
  }

  const FuturisticPromoSection = () => (
    <Paper
      p="xl"
      radius="xl"
      style={{
        height: '500px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
        }}
      />
      
      <Stack gap="xl" style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        <Group align="center" gap="md">
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            style={{
              background: 'linear-gradient(45deg, #00d4ff, #00a8cc)',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            }}
          >
            <IconCalendar size={24} />
          </ActionIcon>
          <Title order={2} c="white" fw={700}>
            Eventify Pro
          </Title>
        </Group>

        <Box
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Stack gap="lg">
            <Text c="white" fw={600} size="lg">
              Next-Gen Event Management
            </Text>

            <Text c="rgba(255, 255, 255, 0.9)" size="sm" lh={1.6}>
              Create, manage, and scale your events with cutting-edge tools designed for the future of entertainment.
            </Text>

            <Stack gap="sm">
              <Group gap="xs">
                <Box
                  w={8}
                  h={8}
                  style={{
                    background: '#00ff88',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)',
                  }}
                />
                <Text c="white" size="sm">Smart Analytics</Text>
              </Group>
              <Group gap="xs">
                <Box
                  w={8}
                  h={8}
                  style={{
                    background: '#ff6b6b',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(255, 107, 107, 0.5)',
                  }}
                />
                <Text c="white" size="sm">Real-time Tracking</Text>
              </Group>
              <Group gap="xs">
                <Box
                  w={8}
                  h={8}
                  style={{
                    background: '#ffd93d',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(255, 217, 61, 0.5)',
                  }}
                />
                <Text c="white" size="sm">Seamless Integration</Text>
              </Group>
            </Stack>
          </Stack>
        </Box>

        <Button
          fullWidth
          size="lg"
          variant="filled"
          style={{
            background: 'linear-gradient(45deg, #00d4ff, #00a8cc)',
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
            border: 'none',
            fontWeight: 600,
          }}
        >
          Start Your Journey
        </Button>
      </Stack>
    </Paper>
  );

  const ScheduleSection = () => {
    if (showsLoading || schedulesLoading) {
      return (
        <Box pos="relative" h={600}>
          <LoadingOverlay visible={true} />
        </Box>
      );
    }

    if (!showDetail) {
      return (
        <Paper p="xl" radius="md" style={{ textAlign: 'center' }}>
          <Stack align="center" gap="md">
            <IconCalendar size={48} color="#64748b" />
            <Title order={3} c="dimmed">
              Show Not Found
            </Title>
            <Text c="dimmed">The requested show could not be found.</Text>
          </Stack>
        </Paper>
      );
    }

    return (
      <Paper radius="md" style={{ overflow: 'hidden', height: '600px' }}>
        <ShowScheduleCalendar
          event={event}
          showStartTime={showDetail.startTime}
          showEndTime={showDetail.endTime}
          schedules={schedules || []}
          error={schedulesError}
        />
      </Paper>
    );
  };

  return (
    <BaseRow
      align="middle"
      gutter={[16, 24]}
      style={{
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#f4f7fc',
      }}
    >
      <Box className="event-banner">
        <HeroSection event={event} />
      </Box>
      <Box
        className="event-content-container"
        style={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          padding: '0 128px',
        }}
      >
        <Box style={{ flex: 1, padding: '0' }}>
          <Box className="main-info-section">
            <Box className="section-container">
              <DescriptionSection description={event.eventDescription} />
            </Box>
            <Box className="section-container">
              <ScheduleSection />
            </Box>
            <Box className="section-container">
              <OrganizerInfoSection
                organizerDescription={event.orgDescription}
                organizerName={event.orgName}
                organizerImage={event.orgLogoUrl}
              />
            </Box>
            <Box className="section-container">
              <GameSection eventId={eventId} />
            </Box>
            {eventId && (
              <Box className="section-container">
                <CommentSection eventId={eventId} />
              </Box>
            )}
          </Box>
        </Box>
        <Box style={{ width: '400px', flexShrink: 0 }}>
          <FuturisticPromoSection />
        </Box>
      </Box>
    </BaseRow>
  );
};

export default PurchasedEventDetailPage;
