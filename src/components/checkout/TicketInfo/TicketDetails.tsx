import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Text, Box, Group, Badge } from '@mantine/core';

interface TicketItem {
  id: number;
  name: string;
  ticketTypeId: number;
  seatId?: string;
  quantity: number;
  sectionId?: string;
  price: number;
  seatNumber?: string;
  rowLabel?: string;
  color?: string;
  discount: number;
  discountCode: string;
}

interface GroupedTickets {
  [key: string]: {
    name: string;
    id: number;
    quantity: number;
    price: number;
    seats: { id: string; rowLabel?: string; seatNumber?: string }[];
  };
}

interface TicketDetailsProps {
  items: TicketItem[];
}

export const TicketDetails: React.FC<TicketDetailsProps> = ({ items }) => {
  const { t } = useTranslation();

  const groupedTickets = items.reduce<GroupedTickets>((acc, item) => {
    const key = `${item.ticketTypeId}`;
    if (!acc[key]) {
      acc[key] = {
        name: item.name,
        id: item.ticketTypeId,
        quantity: 0,
        price: item.price,
        seats: [],
      };
    }
    acc[key].quantity += item.quantity;
    if (item.seatId) {
      acc[key].seats.push({
        id: item.seatId,
        rowLabel: item.rowLabel,
        seatNumber: item.seatNumber,
      });
    }
    return acc;
  }, {});

  return (
    <Stack gap="md">
      <Text fw={600} size="sm">{t('checkout.ticketDetails')}</Text>
      <Stack gap="sm">
        {Object.values(groupedTickets).map((ticket) => (
          <Box key={ticket.id}>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <Text size="sm" fw={500}>{ticket.name}</Text>
                <Text size="sm" c="dimmed">x{ticket.quantity}</Text>
              </Group>
              <Stack gap={4} align="flex-end">
                <Text size="sm" c="dimmed">
                  {Number(ticket.price).toLocaleString('vi-VN')} đ
                </Text>
                <Text size="sm" fw={500}>
                  {(Number(ticket.price) * ticket.quantity).toLocaleString('vi-VN')} đ
                </Text>
              </Stack>
            </Group>
            {ticket.seats.length > 0 && (
              <Group gap="xs">
                {ticket.seats.map((seat) => (
                  <Badge
                    key={seat.id}
                    variant="light"
                    color="blue"
                    size="sm"
                    radius="sm"
                  >
                    {seat.rowLabel
                      ? `${seat.rowLabel} - ${seat.seatNumber}`
                      : seat.seatNumber}
                  </Badge>
                ))}
              </Group>
            )}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};
