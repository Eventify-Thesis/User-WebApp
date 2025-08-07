import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrderModel } from '@/domain/OrderModel';
import {
  Box,
  Title,
  Text,
  Group,
  Badge,
  Grid,
  Table,
  Stack,
  Paper,
  Divider,
} from '@mantine/core';
import {
  IconUser,
  IconMail,
  IconTicket,
  IconClock,
  IconDiscount,
} from '@tabler/icons-react';
import '@mantine/core/styles.css';
import { formatDate, utcToTz } from '@/utils/dates';

interface OrderSectionProps {
  order: OrderModel;
}

const OrderSection: React.FC<OrderSectionProps> = ({ order }) => {
  const { t } = useTranslation();

  // Group items by name and calculate totals
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, {
      name: string;
      totalQuantity: number;
      totalPrice: number;
      singlePrice: number;
      items: typeof order.items;
    }> = {};

    order.items.forEach((item) => {
      const key = item.name;
      if (!groups[key]) {
        groups[key] = {
          name: item.name,
          totalQuantity: 0,
          totalPrice: 0,
          singlePrice: Number(item.price) / item.quantity, // Calculate single item price
          items: [],
        };
      }
      groups[key].totalQuantity += item.quantity;
      groups[key].totalPrice += Number(item.price);
      groups[key].items.push(item);
    });

    return Object.values(groups);
  }, [order.items]);

  return (
    <Stack gap="xl">
      {/* Order Status */}
      <Box>
        <Group justify="space-between" mb="md">
          <Title order={3}>
            {t('orderSection.order')}: #{order.publicId}
          </Title>
          <Badge
            color={order.status === 'PAID' ? 'green' : 'yellow'}
            variant="light"
            size="lg"
          >
            {order.status}
          </Badge>
        </Group>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Group gap="xs">
              <IconClock size={16} />
              <Text size="sm" c="gray.7">
                {t('orderSection.orderDate')}:
              </Text>
              <Text size="sm">
                {formatDate(
                  utcToTz(order.createdAt, 'Asia/Bangkok') || '',
                  'MM/DD/YYYY, hh:mm A',
                  'Asia/Bangkok',
                )}
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Group gap="xs">
              <IconTicket size={16} />
              <Text size="sm" c="gray.7">
                {t('orderSection.paidAt')}:
              </Text>
              <Text size="sm">{new Date(order.paidAt).toLocaleString()}</Text>
            </Group>
          </Grid.Col>
        </Grid>
      </Box>

      {/* Buyer Info */}
      <Box>
        <Title order={3} mb="md">
          {t('orderSection.buyerInfo')}
        </Title>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Group gap="xs">
              <IconUser size={16} />
              <Text size="sm" c="gray.7">
                {t('orderSection.name')}:
              </Text>
              <Text size="sm">
                {order.firstName} {order.lastName}
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Group gap="xs">
              <IconMail size={16} />
              <Text size="sm" c="gray.7">
                {t('orderSection.email')}:
              </Text>
              <Text size="sm">{order.email}</Text>
            </Group>
          </Grid.Col>
        </Grid>
      </Box>

      {/* Order Summary */}
      <Box>
        <Title order={3} mb="lg">
          {t('orderSection.orderSummary')}
        </Title>
        <Paper withBorder radius="md" p="md">
          <Table
            verticalSpacing="sm"
            styles={{
              th: {
                color: 'var(--mantine-color-gray-6)',
                fontSize: 'var(--mantine-font-size-sm)',
                fontWeight: 500,
                padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
                borderBottom: '1px solid var(--mantine-color-gray-3)',
              },
              td: {
                fontSize: 'var(--mantine-font-size-sm)',
                padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
              },
            }}
          >
            <thead>
              <tr>
                <th>{t('orderSection.ticketType')}</th>
                <th>{t('orderSection.quantity')}</th>
                <th style={{ textAlign: 'right' }}>
                  {t('orderSection.price')}
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedItems.map((group, index) => (
                <tr key={`${group.name}-${index}`}>
                  <td>
                    <Stack gap={4}>
                      <Group gap="xs">
                        <IconTicket
                          size={16}
                          style={{ color: 'var(--mantine-color-blue-6)' }}
                        />
                        <Text>{group.name}</Text>
                      </Group>
                      <Text size="xs" c="dimmed" pl={20}>
                        {group.singlePrice.toLocaleString()} đ per ticket
                      </Text>
                    </Stack>
                  </td>
                  <td>
                    <Badge variant="light" color="blue" size="sm">
                      {group.totalQuantity}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Text fw={500}>
                      {group.totalPrice.toLocaleString()} đ
                    </Text>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Divider my="md" variant="dashed" />

          <Stack gap="xs" pl="sm" pr="sm">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {t('orderSection.subtotal')}
              </Text>
              <Text size="sm">
                {Number(
                  order.subtotalAmount || order.totalAmount,
                ).toLocaleString()}{' '}
                đ
              </Text>
            </Group>

            {order.platformDiscountAmount > 0 && (
              <Group justify="space-between">
                <Group gap="xs">
                  <IconDiscount
                    size={16}
                    style={{ color: 'var(--mantine-color-green-6)' }}
                  />
                  <Text size="sm" c="dimmed">
                    {t('orderSection.discount')}
                  </Text>
                </Group>
                <Text size="sm" c="green.6">
                  -{Number(order.platformDiscountAmount).toLocaleString()} đ
                </Text>
              </Group>
            )}

            <Group justify="space-between" mt="xs">
              <Text fw={500}>{t('orderSection.total')}</Text>
              <Text size="lg" fw={700} c="blue.7">
                {Number(order.totalAmount).toLocaleString()} đ
              </Text>
            </Group>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
};

export default OrderSection;
