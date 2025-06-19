import { useTranslation } from 'react-i18next';
import React from 'react';
import dayjs from 'dayjs';
import { ShowModel } from '@/domain/ShowModel';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  Title,
  Group,
  Button,
  Accordion,
  Badge,
  Image,
  Paper,
  Stack,
  Flex,
} from '@mantine/core';
import {
  IconCalendar,
  IconTicket,
  IconCurrencyDollar,
  IconClock,
  IconInfoCircle,
  IconCurrencyDong,
} from '@tabler/icons-react';
import './TicketsInfoSection.css';

interface TicketInfoSectionProps {
  shows: ShowModel[];
  eventId?: string;
}

const TicketsInfoSection: React.FC<TicketInfoSectionProps> = ({
  shows,
  eventId,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBuyTicket = (showId: string | undefined) => {
    if (eventId && showId) {
      navigate(`/events/${eventId}/bookings/${showId}/select-ticket`);
    }
  };

  const renderTickets = (show: ShowModel) => {
    return show.ticketTypes.map((ticket) => (
      <Accordion.Item key={ticket.id} value={String(ticket.id)}>
        <Accordion.Control>
          <Group justify="space-between" style={{ width: '100%' }}>
            <Text className="ticket-title" color="white">
              {ticket.name}
            </Text>
            <Group gap="xs">
              <Text className="ticket-price" fw={600} color="white">
                {new Intl.NumberFormat('vi-VN').format(Number(ticket.price))}
              </Text>
              <IconCurrencyDong size={16} stroke={1.5} color="#FFD700" />
            </Group>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Box className="ticket-content">
            {/* Image placed to the left */}
            {ticket.imageUrl ? (
              <Box className="ticket-image-container">
                <Image
                  src={ticket.imageUrl}
                  alt={ticket.name || 'Ticket image'}
                  fit="cover"
                  radius="md"
                  className="ticket-image"
                />
              </Box>
            ) : (
              <Box
                className="ticket-image-container"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#373a40',
                  borderRadius: '6px',
                  height: '80px',
                }}
              >
                <IconTicket size={32} stroke={1.5} color="#FFD700" />
              </Box>
            )}

            {/* Ticket details beside the image */}
            <Box className="ticket-details">
              <Group justify="flex-end" mb="xs">
                <Badge
                  color={ticket.quantity > 0 ? 'teal' : 'red'}
                  variant="filled"
                  size="md"
                >
                  {ticket.quantity > 0
                    ? t('eventDetailPage.available')
                    : t('eventDetailPage.soldOut')}
                </Badge>
              </Group>

              <Stack gap="xs">
                <Group className="ticket-detail" gap="xs">
                  <IconTicket size={16} stroke={1.5} color="#FFD700" />
                  <Text size="sm" fw={500} color="white">
                    {t('eventDetailPage.ticketInfo')}
                  </Text>
                </Group>
                <Group className="ticket-detail" gap="xs">
                  <IconCalendar size={16} stroke={1.5} color="#FFD700" />
                  <Text size="sm" color="#c1c2c5">
                    {dayjs(show.startTime).format('DD MMM YYYY')}
                  </Text>
                </Group>
                <Group className="ticket-detail" gap="xs">
                  <IconClock size={16} stroke={1.5} color="#FFD700" />
                  <Text size="sm" color="#c1c2c5">
                    {dayjs(show.startTime).format('HH:mm')}
                  </Text>
                </Group>
                {ticket.description && (
                  <Text className="ticket-description" color="#c1c2c5">
                    {ticket.description}
                  </Text>
                )}
              </Stack>
            </Box>
          </Box>
        </Accordion.Panel>
      </Accordion.Item>
    ));
  };

  return (
    <>
      <Title
        order={2}
        className="section-detail-title"
        style={{ color: '#333333' }}
      >
        {t('eventDetailPage.tickets')}
      </Title>

      {shows.length > 0 ? (
        <Accordion
          defaultValue={shows[0]?.id ? String(shows[0].id) : ''}
          variant="contained"
          radius="md"
          styles={{
            item: {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              marginBottom: '16px',
              borderRadius: '12px',
              overflow: 'hidden',
              '&[data-active]': {
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                borderColor: 'rgba(255, 215, 0, 0.2)',
              },
            },
            control: {
              padding: '16px',
              backgroundColor: '#1a1b1e',
              '&:hover': {
                backgroundColor: '#25262b',
              },
            },
            label: {
              fontWeight: 600,
              color: '#ffffff',
            },
            panel: {
              padding: '0',
              backgroundColor: '#25262b',
              color: '#c1c2c5',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
            },
            content: {
              color: '#c1c2c5',
            },
            chevron: {
              color: '#FFD700',
              marginLeft: '16px',
            },
          }}
        >
          {shows.map((show) => (
            <Accordion.Item key={show.id} value={String(show.id)}>
              <Accordion.Control>
                <Group justify="space-between" style={{ width: '100%' }}>
                  <Group gap="xs">
                    <IconCalendar size={18} stroke={1.5} color="#FFD700" />
                    <Text fw={600} color="white">
                      {dayjs(show.startTime).format('ddd, DD MMM YYYY')}
                    </Text>
                  </Group>
                  <Group>
                    <Group gap="xs">
                      <IconClock size={16} stroke={1.5} color="#FFD700" />
                      <Text size="sm" color="#c1c2c5">
                        {dayjs(show.startTime).format('HH:mm')}
                      </Text>
                    </Group>
                    <Button
                      className="buy-ticket-button"
                      style={{
                        background:
                          'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
                        color: '#000000',
                      }}
                      size="sm"
                      leftSection={<IconTicket size={14} />}
                      radius="md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyTicket(show.id);
                      }}
                    >
                      {t('eventDetailPage.buyTicket')}
                    </Button>
                  </Group>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Accordion
                  variant="contained"
                  radius="sm"
                  styles={{
                    item: {
                      borderColor: 'rgba(255, 255, 255, 0.05)',
                      marginBottom: '10px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      '&[data-active]': {
                        backgroundColor: 'rgba(255, 215, 0, 0.03)',
                        borderColor: 'rgba(255, 215, 0, 0.1)',
                      },
                    },
                    control: {
                      padding: '14px',
                      backgroundColor: '#2c2e33',
                      color: '#e9ecef',
                      '&:hover': {
                        backgroundColor: '#373a40',
                      },
                    },
                    panel: {
                      padding: '0',
                      backgroundColor: '#2f3033',
                      color: '#c1c2c5',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                    label: {
                      color: '#e9ecef',
                    },
                    content: {
                      color: '#c1c2c5',
                      backgroundColor: '#2f3033',
                    },
                    chevron: {
                      color: '#FFD700',
                      marginLeft: '16px',
                    },
                  }}
                >
                  {renderTickets(show)}
                </Accordion>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Flex direction="column" align="center" py="xl" mt="md">
          <IconInfoCircle size={48} stroke={1.5} color="#333333" />
          <Text c="dimmed" size="lg" mt="md" color="#333333">
            {t('eventDetailPage.noTicketsAvailable')}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default TicketsInfoSection;
