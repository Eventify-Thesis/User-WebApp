import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Text,
  Button,
  Group,
  Stack,
  Box,
  ActionIcon,
  ThemeIcon,
  Container,
} from '@mantine/core';
import {
  IconTicket,
  IconCalendarEvent,
  IconSearch,
  IconStar,
  IconTrendingUp,
  IconSparkles,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import './NoOrders.css';

const NoOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDiscoverEvents = () => {
    navigate('/');
  };

  const handleBrowseCategories = () => {
    navigate('/events');
  };

  return (
    <Container size="sm" className="no-orders-container">
      <Paper className="no-orders-card" radius="xl" p="xl">
        {/* Animated Icon Section */}
        <Box className="no-orders-icon-section" mb="xl">
          <ThemeIcon
            className="no-orders-main-icon"
            size={120}
            radius="xl"
            variant="gradient"
            gradient={{ from: 'yellow', to: 'orange', deg: 45 }}
          >
            <IconTicket size={60} />
          </ThemeIcon>

          {/* Floating decoration icons */}
          <ActionIcon
            className="floating-icon floating-icon-1"
            variant="light"
            color="blue"
            size="lg"
            radius="xl"
          >
            <IconCalendarEvent size={20} />
          </ActionIcon>

          <ActionIcon
            className="floating-icon floating-icon-2"
            variant="light"
            color="green"
            size="lg"
            radius="xl"
          >
            <IconStar size={20} />
          </ActionIcon>

          <ActionIcon
            className="floating-icon floating-icon-3"
            variant="light"
            color="purple"
            size="lg"
            radius="xl"
          >
            <IconSparkles size={20} />
          </ActionIcon>
        </Box>

        {/* Content Section */}
        <Stack align="center" gap="md" className="no-orders-content">
          <Text
            size="xl"
            fw={700}
            c="white"
            ta="center"
            className="no-orders-title"
          >
            {t('orderHistory.noOrders')}
          </Text>

          <Text
            size="md"
            c="dimmed"
            ta="center"
            maw={400}
            className="no-orders-description"
          >
            You haven't purchased any event tickets yet. Start exploring amazing
            events and create unforgettable memories!
          </Text>

          {/* Action Buttons */}
          <Group gap="md" mt="xl" className="no-orders-actions">
            <Button
              size="lg"
              radius="xl"
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange', deg: 45 }}
              leftSection={<IconSearch size={20} />}
              onClick={handleDiscoverEvents}
              className="primary-action-btn"
            >
              Discover Events
            </Button>

            <Button
              size="lg"
              radius="xl"
              variant="light"
              color="gray"
              leftSection={<IconTrendingUp size={20} />}
              onClick={handleBrowseCategories}
              className="secondary-action-btn"
            >
              Browse Categories
            </Button>
          </Group>

          {/* Feature Highlights */}
          <Group gap="xl" mt="xl" className="feature-highlights">
            <Box className="feature-item" ta="center">
              <ThemeIcon
                size="lg"
                radius="xl"
                variant="light"
                color="blue"
                mb="xs"
              >
                <IconCalendarEvent size={18} />
              </ThemeIcon>
              <Text size="xs" c="dimmed" fw={500}>
                Live Events
              </Text>
            </Box>

            <Box className="feature-item" ta="center">
              <ThemeIcon
                size="lg"
                radius="xl"
                variant="light"
                color="green"
                mb="xs"
              >
                <IconTicket size={18} />
              </ThemeIcon>
              <Text size="xs" c="dimmed" fw={500}>
                Secure Booking
              </Text>
            </Box>

            <Box className="feature-item" ta="center">
              <ThemeIcon
                size="lg"
                radius="xl"
                variant="light"
                color="purple"
                mb="xs"
              >
                <IconStar size={18} />
              </ThemeIcon>
              <Text size="xs" c="dimmed" fw={500}>
                Best Experiences
              </Text>
            </Box>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NoOrders;
