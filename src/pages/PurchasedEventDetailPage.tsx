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
} from '@mantine/core';
import './EventDetailPage.css';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import ShowScheduleCalendar from '@/components/event-detail/ShowScheduleCalendar/ShowScheduleCalendar';
import { useGetEventShowDetail } from '@/queries/useGetEventShowDetail';

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

  const AdvertisingSection = () => (
    <Paper
      p="md"
      radius="md"
      style={{ height: '500px', background: 'rgba(255, 255, 255, 0.8)' }}
    >
      <Title order={3} mb="md">
        Advertisement
      </Title>
      <Box
        style={{
          height: '300px',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text c="dimmed">Advertisement Space</Text>
      </Box>
    </Paper>
  );

  const ScheduleSection = () => {
    if (showsLoading || schedulesLoading) {
      return (
        <Box pos="relative" h={400}>
          <LoadingOverlay visible={true} />
        </Box>
      );
    }

    if (!showDetail) {
      return (
        <Stack p="md">
          <Title order={2}>Show Schedule</Title>
          <Stack p="md">
            <Text>Show not found.</Text>
          </Stack>
        </Stack>
      );
    }

    return (
      <Stack p="md">
        <ShowScheduleCalendar
          showStartTime={showDetail.startTime}
          showEndTime={showDetail.endTime}
          schedules={schedules || []}
          error={schedulesError}
        />
      </Stack>
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
        style={{
          display: 'flex',
          gap: '10px',
          width: '100%',
          padding: '0 128px',
          '@media (max-width: 1280px)': {
            padding: '0 24px',
            flexDirection: 'column',
          },
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
          </Box>
        </Box>
        <Box style={{ width: '400px', flexShrink: 0 }}>
          <AdvertisingSection />
        </Box>
      </Box>
    </BaseRow>
  );
};

export default PurchasedEventDetailPage;
