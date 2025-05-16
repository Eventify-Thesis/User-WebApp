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
  Flex
} from '@mantine/core';
import {
  IconCalendar,
  IconTicket,
  IconCurrencyDollar,
  IconClock,
  IconInfoCircle
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
      navigate(
        `/events/${eventId}/bookings/${showId}/select-ticket`,
      );
    }
  };

  const renderTickets = (show: ShowModel) => {
    return show.ticketTypes.map((ticket) => (
      <Accordion.Item key={ticket.id} value={String(ticket.id)}>
        <Accordion.Control>
          <Group justify="space-between" style={{ width: '100%' }}>
            <Text className="ticket-title">{ticket.name}</Text>
            <Group gap="xs">
              <IconCurrencyDollar size={16} stroke={1.5} color="#228be6" />
              <Text className="ticket-price" fw={600}>{Math.round(ticket.price).toLocaleString()} Đ</Text>
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
              <Box className="ticket-image-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e9ecef', borderRadius: '6px', height: '80px' }}>
                <IconTicket size={32} stroke={1.5} color="#adb5bd" />
              </Box>
            )}
            
            {/* Ticket details beside the image */}
            <Box className="ticket-details">
              <Group justify="flex-end" mb="xs">
                <Badge
                  color={ticket.quantity > 0 ? 'teal' : 'red'}
                  variant="light"
                  size="md"
                >
                  {ticket.quantity > 0
                    ? t('eventDetailPage.available')
                    : t('eventDetailPage.soldOut')}
                </Badge>
              </Group>
              
              <Stack gap="xs">
                <Group className="ticket-detail" gap="xs">
                  <IconTicket size={16} stroke={1.5} color="#228be6" />
                  <Text size="sm" fw={500}>{t('eventDetailPage.ticketInfo')}</Text>
                </Group>
                <Group className="ticket-detail" gap="xs">
                  <IconCalendar size={16} stroke={1.5} color="#228be6" />
                  <Text size="sm">
                    {dayjs(show.startTime).format('DD MMM YYYY')}
                  </Text>
                </Group>
                <Group className="ticket-detail" gap="xs">
                  <IconClock size={16} stroke={1.5} color="#228be6" />
                  <Text size="sm">
                    {dayjs(show.startTime).format('HH:mm')}
                  </Text>
                </Group>
                {ticket.description && (
                  <Text className="ticket-description">
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
    <Paper p="xl" radius="lg" shadow="sm" className="tickets-section">
      <Title order={2} className="section-title">
        {t('eventDetailPage.tickets')}
      </Title>

      {shows.length > 0 ? (
        <Accordion
          defaultValue={shows[0]?.id ? String(shows[0].id) : ''}
          variant="contained"
          radius="md"
          styles={{
            item: {
              borderColor: 'rgba(0, 0, 0, 0.05)',
              marginBottom: '16px',
              borderRadius: '12px',
              overflow: 'hidden',
              '&[data-active]': {
                backgroundColor: 'rgba(34, 139, 230, 0.05)',
                borderColor: 'rgba(34, 139, 230, 0.2)',
              },
            },
            control: {
              padding: '16px',
              backgroundColor: '#f8f9fa',
              '&:hover': {
                backgroundColor: '#e9ecef',
              },
            },
            label: {
              fontWeight: 600,
              color: '#212529',
            },
            panel: {
              padding: '0',
              backgroundColor: '#f1f3f5',
              color: '#495057',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.03)',
            },
            content: {
              color: '#495057',
            },
            chevron: {
              color: '#4dabf7'
            }
          }}
        >
          {shows.map((show) => (
            <Accordion.Item key={show.id} value={String(show.id)}>
              <Accordion.Control>
                <Group justify="space-between" style={{ width: '100%' }}>
                  <Group gap="xs">
                    <IconCalendar size={18} stroke={1.5} color="#228be6" />
                    <Text fw={600}>
                      {dayjs(show.startTime).format('ddd, DD MMM YYYY')}
                    </Text>
                  </Group>
                  <Group>
                    <Group gap="xs">
                      <IconClock size={16} stroke={1.5} color="#4dabf7" />
                      <Text size="sm" c="dimmed">
                        {dayjs(show.startTime).format('HH:mm')}
                      </Text>
                    </Group>
                    <Button 
                      className="buy-ticket-button"
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
                      borderColor: 'rgba(0, 0, 0, 0.05)',
                      marginBottom: '10px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      '&[data-active]': {
                        backgroundColor: 'rgba(34, 139, 230, 0.03)',
                        borderColor: 'rgba(34, 139, 230, 0.1)',
                      },
                    },
                    control: {
                      padding: '14px',
                      backgroundColor: '#f8f9fa',
                      color: '#495057',
                      '&:hover': {
                        backgroundColor: '#e9ecef',
                      },
                    },
                    panel: {
                      padding: '0',
                      backgroundColor: '#ffffff',
                      color: '#495057',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.03)',
                    },
                    label: {
                      color: '#212529',
                    },
                    content: {
                      color: '#495057',
                    },
                    chevron: {
                      color: '#4dabf7'
                    }
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
          <IconInfoCircle size={48} stroke={1.5} color="#adb5bd" />
          <Text c="dimmed" size="lg" mt="md">
            {t('eventDetailPage.noTicketsAvailable')}
          </Text>
        </Flex>
      )}
    </Paper>
  );
};

export default TicketsInfoSection;
