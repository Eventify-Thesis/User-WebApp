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
} from '@mantine/core';
import {
  IconCalendar,
  IconTicket,
  IconCurrencyDollar,
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
        `/checkout?eventId=${eventId}&showId=${showId}`,
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
              <IconCurrencyDollar size={16} stroke={1.5} color="#facc15" />
              <Text className="ticket-price" fw={600}>{Math.round(ticket.price)} Đ</Text>
            </Group>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Box className="ticket-content" p="md">
            {ticket.imageUrl && (
              <Image
                src={ticket.imageUrl}
                alt={ticket.name || 'Ticket image'}
                height={120}
                fit="contain"
                mb="md"
              />
            )}

            <Group justify="flex-end" mb="md">
              <Badge
                color={ticket.quantity > 0 ? 'green' : 'red'}
                variant="filled"
                size="lg"
              >
                {ticket.quantity > 0
                  ? t('eventDetailPage.available')
                  : t('eventDetailPage.soldOut')}
              </Badge>
            </Group>

            <Box className="ticket-details" mb="md">
              <Group className="ticket-detail">
                <IconTicket size={16} />
                <Text size="sm">{t('eventDetailPage.ticketInfo')}</Text>
              </Group>
              <Group className="ticket-detail">
                <IconCalendar size={16} />
                <Text size="sm">
                  {dayjs(show.startTime).format('DD MMM YYYY, HH:mm')}
                </Text>
              </Group>
              {ticket.description && (
                <Text mt="sm" size="sm" className="ticket-description" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {ticket.description}
                </Text>
              )}
            </Box>
          </Box>
        </Accordion.Panel>
      </Accordion.Item>
    ));
  };

  return (
    <>
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
              borderColor: 'rgba(255, 255, 255, 0.1)',
              marginBottom: '16px',
              borderRadius: '12px',
              overflow: 'hidden',
              '&[data-active]': {
                backgroundColor: 'rgba(80, 60, 120, 0.2)',
                borderColor: 'rgba(250, 204, 21, 0.2)',
              },
            },
            control: {
              padding: '16px',
              backgroundColor: 'rgba(25, 25, 40, 0.7)',
              backdropFilter: 'blur(12px)',
              '&:hover': {
                backgroundColor: 'rgba(60, 50, 90, 0.8)',
              },
            },
            label: {
              fontWeight: 600,
              color: '#ffffff',
            },
            panel: {
              padding: '0',
              backgroundColor: 'rgba(45, 35, 70, 0.7)',
              color: '#ffffff',
              boxShadow: 'inset 0 5px 10px rgba(0, 0, 0, 0.1)',
            },
            content: {
              color: '#ffffff',
            },
          }}
        >
          {shows.map((show) => (
            <Accordion.Item key={show.id} value={String(show.id)}>
              <Accordion.Control>
                <Group justify="space-between" style={{ width: '100%' }}>
                  <Group>
                    <IconCalendar size={18} />
                    <Text fw={600}>
                      {dayjs(show.startTime).format('ddd, DD MMM YYYY')}
                    </Text>
                  </Group>
                  <Group>
                    <Text size="sm" c="dimmed" mr="sm">
                      {dayjs(show.startTime).format('HH:mm')}
                    </Text>
                    <Button 
                      className="buy-ticket-button"
                      size="sm"
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
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      marginBottom: '10px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      '&[data-active]': {
                        backgroundColor: 'rgba(90, 70, 130, 0.2)',
                        borderColor: 'rgba(250, 204, 21, 0.15)',
                      },
                    },
                    control: {
                      padding: '14px',
                      backgroundColor: 'rgba(50, 40, 80, 0.5)',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: 'rgba(70, 55, 100, 0.6)',
                      },
                    },
                    panel: {
                      padding: '0',
                      backgroundColor: 'rgba(60, 45, 90, 0.5)',
                      color: '#ffffff',
                      boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.1)',
                    },
                    label: {
                      color: '#ffffff',
                    },
                    content: {
                      color: '#ffffff',
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
        <Text c="dimmed" ta="center" py="xl">
          {t('eventDetailPage.noTicketsAvailable')}
        </Text>
      )}
    </>
  );
};

export default TicketsInfoSection;
