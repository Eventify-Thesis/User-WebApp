import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
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
  ActionIcon,
} from '@mantine/core';
import {
  IconCalendar,
  IconPlus,
  IconMinus,
  IconTicket,
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
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQuantityChange = (ticketId: string, newValue: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, newValue),
    }));
  };

  const handleAddToCart = (
    ticket: ShowModel['ticketTypes'][0],
    showId: string,
  ) => {
    const quantity = quantities[ticket.id] || 0;
    if (quantity > 0 && eventId && showId) {
      navigate(
        `/checkout?eventId=${eventId}&showId=${showId}&ticketId=${ticket.id}&quantity=${quantity}`,
      );
    }
  };

  const renderTickets = (show: ShowModel) => {
    return show.ticketTypes.map((ticket) => (
      <Accordion.Item key={ticket.id} value={String(ticket.id)}>
        <Accordion.Control>
          <Group justify="space-between" style={{ width: '100%' }}>
            <Text className="ticket-title">{ticket.name}</Text>
            <Text className="ticket-price">{Math.round(ticket.price)} Đ</Text>
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
                <Text mt="sm" size="sm" color="rgba(0, 0, 0, 0.7)">
                  {ticket.description}
                </Text>
              )}
            </Box>

            <Box className="ticket-actions">
              <Group className="quantity-selector">
                <ActionIcon
                  className="quantity-button"
                  onClick={() =>
                    handleQuantityChange(
                      ticket.id,
                      (quantities[ticket.id] || 0) - 1,
                    )
                  }
                  disabled={
                    (quantities[ticket.id] || 0) <= 0 || ticket.quantity <= 0
                  }
                >
                  <IconMinus size={16} />
                </ActionIcon>
                <Text className="quantity-value">
                  {quantities[ticket.id] || 0}
                </Text>
                <ActionIcon
                  className="quantity-button"
                  onClick={() =>
                    handleQuantityChange(
                      ticket.id,
                      (quantities[ticket.id] || 0) + 1,
                    )
                  }
                  disabled={ticket.quantity <= 0}
                >
                  <IconPlus size={16} />
                </ActionIcon>
              </Group>
              <Button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(ticket, show.id)}
                disabled={
                  (quantities[ticket.id] || 0) <= 0 || ticket.quantity <= 0
                }
              >
                {t('eventDetailPage.addToCart')}
              </Button>
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
          defaultValue={shows[0]?.id ? String(shows[0].id) : undefined}
          variant="contained"
          radius="md"
          styles={{
            item: {
              borderColor: 'rgba(0, 0, 0, 0.1)',
              marginBottom: '12px',
              '&[data-active]': {
                backgroundColor: '#f8f8f8',
              },
            },
            control: {
              padding: '16px',
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#f8f8f8',
              },
            },
            label: {
              fontWeight: 600,
              color: '#000000',
            },
            panel: {
              padding: '0',
              backgroundColor: '#ffffff',
            },
          }}
        >
          {shows.map((show) => (
            <Accordion.Item key={show.id} value={String(show.id)}>
              <Accordion.Control>
                <Group justify="space-between" style={{ width: '100%' }}>
                  <Group>
                    <IconCalendar size={18} />
                    <Text fw={500}>
                      {dayjs(show.startTime).format('ddd, DD MMM YYYY')}
                    </Text>
                  </Group>
                  <Text size="sm" c="dimmed">
                    {dayjs(show.startTime).format('HH:mm')}
                  </Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Accordion
                  variant="contained"
                  radius="sm"
                  styles={{
                    item: {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      marginBottom: '8px',
                    },
                    control: {
                      padding: '12px',
                      backgroundColor: '#ffffff',
                    },
                    panel: {
                      padding: '0',
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
