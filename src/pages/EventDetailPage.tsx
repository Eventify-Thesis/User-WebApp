import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { HeroSection } from '@/components/event-detail/HeroSection/HeroSection';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { DescriptionSection } from '@/components/event-detail/DescriptionSection/DescriptionSection';
import { OrganizerInfoSection } from '@/components/event-detail/OrganizerInfoSection/OrganizerInfoSection';
import { useParams } from 'react-router-dom';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import TicketsInfoSection from '@/components/event-detail/TicketsInfoSection/TicketsInfoSection';
import { EventGrid } from '@/components/EventList/EventGrid/EventGrid';
import { useCreateInterest } from '@/mutations/useCreateInterest';
import { useDeleteInterest } from '@/mutations/useDeleteInterest';
import {
  Box,
  Container,
  Paper,
  Text,
  Title,
  useMantineTheme,
  Stack,
  Divider,
  Group,
  Badge,
  ActionIcon,
  Button,
  Modal,
  Flex,
  Tooltip,
  CopyButton,
} from '@mantine/core';
import {
  IconSparkles,
  IconTrendingUp,
  IconHeart,
  IconHeartFilled,
  IconShare,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconMail,
  IconCopy,
  IconCheck,
  IconUser,
} from '@tabler/icons-react';
import { useRelatedEvents } from '@/queries/useRelatedEvents';
import { useAuth } from '@clerk/clerk-react';
import { DEFAULT_LIMIT } from '@/constants/recommendedEvents';
import './EventDetailPage.css';
import styled from 'styled-components';

const RecommendedEventsBox = styled(Box)`
  width: 100%;
  margin: 0 auto;
`;

const EventDetailPage: React.FC = () => {
  const { slug } = useParams();
  const eventId = slug?.split('-')?.[slug?.split('-')?.length - 1];
  const { data: event } = useGetEventDetail(eventId);
  const { isTablet, isDesktop, isMobile, useMediaQuery } = useResponsive();
  const { userId } = useAuth();
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const { eventDescription, orgName, orgLogoUrl, orgDescription } = event || {};
  const [isLiked, setIsLiked] = useState(event?.isInterested || false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Custom media query for better responsive behavior
  // Use desktop layout only for screens >= 1200px
  const isLargeDesktop = useMediaQuery({ query: '(min-width: 1200px)' });

  // Interest mutations
  const createInterestMutation = useCreateInterest();
  const deleteInterestMutation = useDeleteInterest();

  const { data: recommendedEvents, isLoading } = useRelatedEvents(
    Number(eventId),
    DEFAULT_LIMIT,
    userId || '',
  );
  // Normalize and map for EventGrid
  const relatedEvents = (() => {
    const eventsArr = Array.isArray(recommendedEvents) ? recommendedEvents : [];
    return eventsArr.map((event: any) => ({
      ...event,
      eventLogoUrl: event.eventLogoUrl,
      minimumPrice: event.minimumPrice,
      startTime: event.startTime ? new Date(event.startTime * 1000) : undefined,
      isInterested: event.isInterested ?? false,
    }));
  })();

  // Handle like/unlike functionality
  const handleLikeToggle = () => {
    if (!userId || !eventId) return;

    const eventIdNum = Number(eventId);

    if (isLiked) {
      deleteInterestMutation.mutate({ userId, eventId: eventIdNum });
      setIsLiked(false);
    } else {
      createInterestMutation.mutate({ userId, eventId: eventIdNum });
      setIsLiked(true);
    }
  };

  // Update isLiked when event data changes
  React.useEffect(() => {
    if (event?.isInterested !== undefined) {
      setIsLiked(event.isInterested);
    }
  }, [event?.isInterested]);

  // Social media sharing functionality
  const currentUrl = window.location.href;
  const shareTitle = event?.eventName || 'Check out this event';
  const shareDescription =
    event?.eventDescription || 'Amazing event you should not miss!';

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl,
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl,
    )}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl,
    )}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      shareTitle + ' ' + currentUrl,
    )}`,
    email: `mailto:?subject=${encodeURIComponent(
      shareTitle,
    )}&body=${encodeURIComponent(shareDescription + '\n\n' + currentUrl)}`,
  };

  const handleSocialShare = (platform: string) => {
    const url = shareUrls[platform as keyof typeof shareUrls];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const ShareModal = () => (
    <Modal
      opened={shareModalOpen}
      onClose={() => setShareModalOpen(false)}
      title={<Title order={3}>Share this event</Title>}
      centered
      size="md"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Share this event with your friends and family
        </Text>

        <Flex gap="md" wrap="wrap" justify="center">
          <Tooltip label="Share on Facebook">
            <ActionIcon
              size="xl"
              variant="filled"
              color="blue"
              onClick={() => handleSocialShare('facebook')}
              style={{ borderRadius: '50%' }}
            >
              <IconBrandFacebook size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Share on Twitter">
            <ActionIcon
              size="xl"
              variant="filled"
              color="cyan"
              onClick={() => handleSocialShare('twitter')}
              style={{ borderRadius: '50%' }}
            >
              <IconBrandTwitter size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Share on LinkedIn">
            <ActionIcon
              size="xl"
              variant="filled"
              color="blue"
              onClick={() => handleSocialShare('linkedin')}
              style={{ borderRadius: '50%' }}
            >
              <IconBrandLinkedin size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Share on WhatsApp">
            <ActionIcon
              size="xl"
              variant="filled"
              color="green"
              onClick={() => handleSocialShare('whatsapp')}
              style={{ borderRadius: '50%' }}
            >
              <IconBrandWhatsapp size={20} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Share via Email">
            <ActionIcon
              size="xl"
              variant="filled"
              color="orange"
              onClick={() => handleSocialShare('email')}
              style={{ borderRadius: '50%' }}
            >
              <IconMail size={20} />
            </ActionIcon>
          </Tooltip>
        </Flex>

        <Divider my="sm" />

        <Box>
          <Text size="sm" fw={500} mb="xs">
            Or copy link
          </Text>
          <Group gap="xs">
            <Text
              size="sm"
              c="dimmed"
              style={{
                flex: 1,
                padding: '8px 12px',
                backgroundColor: theme.colors.gray[1],
                borderRadius: theme.radius.sm,
                wordBreak: 'break-all',
              }}
            >
              {currentUrl}
            </Text>
            <CopyButton value={currentUrl} timeout={2000}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied!' : 'Copy link'}>
                  <ActionIcon
                    variant="filled"
                    color={copied ? 'teal' : 'gray'}
                    onClick={copy}
                  >
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        </Box>
      </Stack>
    </Modal>
  );

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

  const RecommendedEventsSection = () => (
    <Box
      className="recommended-section"
      style={{ width: '100%', padding: '0 128px', margin: '40px 0' }}
    >
      {/* Enhanced Divider */}
      <Divider className="section-divider" mb="xl" />

      <Group justify="space-between" align="center" mb="xl">
        <Box>
          <Group gap="md" align="center">
            <ActionIcon variant="filled" color="yellow" size="xl" radius="xl">
              <IconSparkles size={20} />
            </ActionIcon>
            <Box>
              <Title order={2} className="section-title">
                {t('orderHistory.recommended')}
              </Title>
              <Text c="dimmed" size="sm" mt={4}>
                Handpicked events based on your preferences
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
          Trending
        </Badge>
      </Group>

      <Box className="recommended-events">
        <EventGrid events={relatedEvents} userId={userId} />
      </Box>
    </Box>
  );

  const RecommendedEventsSectionMobile = () => (
    <Box
      className="recommended-section"
      style={{ width: '100%', padding: '0 24px', margin: '40px 0' }}
    >
      {/* Enhanced Divider */}
      <Divider className="section-divider" mb="xl" />

      <Group justify="space-between" align="center" mb="xl">
        <Box>
          <Group gap="md" align="center">
            <ActionIcon variant="filled" color="yellow" size="xl" radius="xl">
              <IconSparkles size={20} />
            </ActionIcon>
            <Box>
              <Title order={2} className="section-title">
                {t('orderHistory.recommended')}
              </Title>
              <Text c="dimmed" size="sm" mt={4}>
                Handpicked events based on your preferences
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
          Trending
        </Badge>
      </Group>

      <Box className="recommended-events">
        <EventGrid events={relatedEvents} userId={userId} />
      </Box>
    </Box>
  );

  // Use mobile layout for screens below 1200px instead of 1280px
  const shouldUseMobileLayout = !isLargeDesktop;

  const desktopLayout = (
    <BaseRow
      align="middle"
      gutter={[16, 24]}
      style={{
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#f4f7fc',
      }}
    >
      <Box className="event-banner" style={{ position: 'relative' }}>
        <HeroSection event={event} />
        {/* Action buttons positioned within hero section */}
        {event && (
          <Group
            gap="sm"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 10,
              '@media (max-width: 1199px)': {
                top: '10px',
                right: '10px',
              },
            }}
          >
            <Tooltip label="Share event">
              <ActionIcon
                size="xl"
                radius="xl"
                variant="filled"
                color="blue"
                onClick={() => setShareModalOpen(true)}
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  border: '2px solid white',
                }}
              >
                <IconShare size={24} />
              </ActionIcon>
            </Tooltip>

            {userId && (
              <Tooltip label={isLiked ? 'Unlike event' : 'Like event'}>
                <ActionIcon
                  size="xl"
                  radius="xl"
                  variant="filled"
                  color={isLiked ? 'red' : 'gray'}
                  onClick={handleLikeToggle}
                  loading={
                    createInterestMutation.isPending ||
                    deleteInterestMutation.fadingEvents.includes(
                      Number(eventId),
                    )
                  }
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    border: '2px solid white',
                  }}
                >
                  {isLiked ? (
                    <IconHeartFilled size={24} />
                  ) : (
                    <IconHeart size={24} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        )}
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
              <DescriptionSection description={eventDescription} />
            </Box>
            <Box className="section-container" id="tickets-section">
              <TicketsInfoSection
                shows={event?.shows || []}
                eventId={event?.id}
              />
            </Box>
            <Box className="section-container">
              <OrganizerInfoSection
                organizerDescription={orgDescription}
                organizerName={orgName}
                organizerImage={orgLogoUrl}
              />
            </Box>
          </Box>
        </Box>
        <Box style={{ width: '400px', flexShrink: 0 }}>
          <AdvertisingSection />
        </Box>
      </Box>

      {/* Related Events Section */}
      {relatedEvents && relatedEvents.length > 0 && (
        <RecommendedEventsSection />
      )}
    </BaseRow>
  );

  const mobileAndTabletLayout = (
    <BaseRow
      align="middle"
      gutter={[16, 24]}
      style={{
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#f4f7fc !important',
      }}
    >
      <Box className="event-banner" style={{ position: 'relative' }}>
        <HeroSection event={event} />
        {/* Action buttons positioned within hero section */}
        {event && (
          <Group
            gap="sm"
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10,
            }}
          >
            <Tooltip label="Share event">
              <ActionIcon
                size="xl"
                radius="xl"
                variant="filled"
                color="blue"
                onClick={() => setShareModalOpen(true)}
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  border: '2px solid white',
                }}
              >
                <IconShare size={24} />
              </ActionIcon>
            </Tooltip>

            {userId && (
              <Tooltip label={isLiked ? 'Unlike event' : 'Like event'}>
                <ActionIcon
                  size="xl"
                  radius="xl"
                  variant="filled"
                  color={isLiked ? 'red' : 'gray'}
                  onClick={handleLikeToggle}
                  loading={
                    createInterestMutation.isPending ||
                    deleteInterestMutation.fadingEvents.includes(
                      Number(eventId),
                    )
                  }
                  style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                    border: '2px solid white',
                  }}
                >
                  {isLiked ? (
                    <IconHeartFilled size={24} />
                  ) : (
                    <IconHeart size={24} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        )}
      </Box>
      <Box className="main-info-section">
        <Box className="section-container">
          <DescriptionSection description={eventDescription} />
        </Box>
        <Box className="section-container" id="tickets-section">
          <TicketsInfoSection shows={event?.shows || []} eventId={event?.id} />
        </Box>
        <Box className="section-container">
          <OrganizerInfoSection
            organizerDescription={orgDescription}
            organizerName={orgName}
            organizerImage={orgLogoUrl}
          />
        </Box>
      </Box>

      {/* Related Events Section */}
      {relatedEvents && relatedEvents.length > 0 && (
        <RecommendedEventsSectionMobile />
      )}
    </BaseRow>
  );

  return (
    <Container fluid className="event-detail-container" p={0}>
      <PageTitle>{event?.eventName || 'Eventify'}</PageTitle>
      {event && (
        <>{shouldUseMobileLayout ? mobileAndTabletLayout : desktopLayout}</>
      )}
      <ShareModal />
    </Container>
  );
};

export default EventDetailPage;
