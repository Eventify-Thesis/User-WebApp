import { useState } from 'react';
import {
  Box,
  Container,
  Divider,
  Loader,
  Pagination,
  Title,
  TextInput,
  Group,
  Stack,
  Badge,
  ActionIcon,
  Paper,
  Text,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  IconSearch,
  IconStar,
  IconSparkles,
  IconTrendingUp,
  IconBookmark,
} from '@tabler/icons-react';
import * as s from '@/components/interested/InterestedPage.styles';
import { useGetInterests } from '@/queries/useGetInterests';
import { useDeleteInterest } from '@/mutations/useDeleteInterest';
import { useAuth } from '@clerk/clerk-react';
import { useRelatedEvents } from '@/queries/useRelatedEvents';
import { useSearchSemanticEvents } from '@/queries/useSearchSemanticEvents';
import { DEFAULT_LIMIT } from '@/constants/recommendedEvents';
import { EventGrid } from '@/components/EventList/EventGrid/EventGrid';
import { Loading } from '@/components/common/Loading/Loading';
import './OrderHistory.css';

export default function InterestedPage() {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, refetch } = useGetInterests(
    userId!,
    page,
    limit,
    !!userId,
  );
  const { mutate: deleteInterest } = useDeleteInterest();

  // Map InterestModel[] to EventModel[] for EventGrid
  const interestEvents = (data?.docs || []).map((interest: any) => ({
    id: interest.eventId,
    eventName: interest.event?.eventName,
    eventDescription: interest.event?.eventDescription,
    eventType: interest.event?.eventType,
    status: interest.event?.status,
    eventLogoUrl: interest.event?.eventLogoUrl,
    eventBannerUrl: interest.event?.eventBannerUrl,
    venueName: interest.event?.venueName,
    street: interest.event?.street,
    categories: interest.event?.categories, // or [] if you want a default
    minimumPrice: interest.minimumPrice,
    startTime: interest.startTime,
    city: interest.city,
    district: interest.district,
    ward: interest.ward,
    isInterested: true,
    // ...add other EventModel fields as needed
  }));

  // Recommended events logic
  const relatedEventsQuery = useRelatedEvents(
    interestEvents?.[0]?.id ?? 0,
    DEFAULT_LIMIT,
    userId || '',
  );

  const semanticEventsQuery = useSearchSemanticEvents({
    limit: DEFAULT_LIMIT,
    userId: userId || '',
    query: '',
  });

  // Determine which data to use
  const recommendedEvents = interestEvents?.[0]?.id
    ? relatedEventsQuery.data
    : semanticEventsQuery.data;

  const recommendedEventsLoading = interestEvents?.[0]?.id
    ? relatedEventsQuery.isLoading
    : semanticEventsQuery.isLoading;

  // Normalize and map for EventGrid
  const relatedEvents = !recommendedEventsLoading
    ? (() => {
        if (!recommendedEvents) return [];
        const eventsArr = Array.isArray(recommendedEvents)
          ? recommendedEvents
          : [];
        return eventsArr.map((event: any) => ({
          ...event,
          eventLogoUrl: event.eventLogoUrl,
          minimumPrice: event.minimumPrice,
          startTime: event.startTime
            ? new Date(event.startTime * 1000)
            : undefined,
          isInterested: event.isInterested ?? false,
        }));
      })()
    : [];

  // Callback to handle interest changes and update the list
  const handleInterestChange = (eventId: number) => {
    // Refetch the interests to update the main list
    refetch();

    // Also refetch the recommended events to update their interest status
    if (interestEvents?.[0]?.id) {
      relatedEventsQuery.refetch();
    } else {
      semanticEventsQuery.refetch();
    }
  };

  const filteredEvents = interestEvents.filter((event: any) =>
    event.eventName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) return <Loading />;

  return (
    <Container fluid className="order-history-container">
      <Box className="order-content">
        {/* Enhanced Header Section */}
        <Box className="page-header" mb="xl">
          <Group justify="space-between" align="flex-start">
            <Box>
              <Title order={1} className="page-title">
                {t('interested.title')}
              </Title>
              <Text c="dimmed" size="lg" mt="sm">
                {t('interested.description')}
              </Text>
            </Box>

            <Group gap="xs">
              <Badge
                variant="light"
                color="pink"
                size="lg"
                radius="xl"
                leftSection={<IconBookmark size={16} />}
              >
                {t('interested.saved', { count: filteredEvents.length })}
              </Badge>
            </Group>
          </Group>
        </Box>

        {/* Modern Search Section */}
        <Paper shadow="md" className="order-tabs-container" mb="xl">
          <Box p="md">
            <TextInput
              placeholder={t('interested.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<IconSearch size={16} />}
              size="md"
              radius="md"
              styles={{
                input: {
                  borderColor: '#e0e7ff',
                  '&:focus': {
                    borderColor: '#6366f1',
                    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.1)',
                  },
                },
              }}
            />
          </Box>
        </Paper>

        {/* Error State */}
        {error && (
          <Paper className="error-message" shadow="sm" mb="xl">
            <Text size="md" fw={500}>
              {t('error.loadingEvents')}
            </Text>
          </Paper>
        )}

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <Stack gap="xl">
            <EventGrid
              events={filteredEvents}
              userId={userId}
              onBookmarkChange={handleInterestChange}
            />

            {/* Pagination */}
            <Group justify="center">
              <Pagination
                value={page}
                onChange={setPage}
                total={data?.totalPages || 1}
                color="yellow"
                radius="xl"
                size="md"
              />
            </Group>
          </Stack>
        ) : (
          <Paper
            className="no-events-container"
            shadow="sm"
            p="xl"
            ta="center"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px',
            }}
          >
            <s.SadIcon />
            <Title order={3} mt="md" mb="sm" c="white">
              {t('interested.noInterested')}
            </Title>
            <Text c="rgba(255, 255, 255, 0.8)" size="sm">
              {t('interested.noInterestedDescription')}
            </Text>
          </Paper>
        )}

        {/* Enhanced Divider */}
        <Divider className="section-divider" my="xl" />

        {/* Recommended Events Section */}
        <Box className="recommended-section">
          <Group justify="space-between" align="center" mb="xl">
            <Box>
              <Group gap="md" align="center">
                <ActionIcon
                  variant="filled"
                  color="yellow"
                  size="xl"
                  radius="xl"
                >
                  <IconSparkles size={20} />
                </ActionIcon>
                <Box>
                  <Title order={2} className="section-title">
                    {t('orderHistory.recommended')}
                  </Title>
                  <Text c="dimmed" size="sm" mt={4}>
                    {t('interested.recommendedDescription')}
                  </Text>
                </Box>
              </Group>
            </Box>

            <Badge
              variant="light"
              color="blue"
              size="md"
              radius="xl"
              leftSection={<IconTrendingUp size={14} />}
            >
              {t('orderHistory.recommended')}
            </Badge>
          </Group>

          {recommendedEventsLoading ? (
            <Group justify="center" p="xl">
              <Loader color="yellow" size="lg" variant="dots" />
            </Group>
          ) : (
            <Box className="recommended-events">
              <EventGrid
                events={relatedEvents}
                userId={userId}
                onBookmarkChange={handleInterestChange}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
