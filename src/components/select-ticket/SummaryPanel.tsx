import React from 'react';
import { Typography, Space, Button, Row, Divider } from 'antd';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useResponsive } from '@/hooks/useResponsive';

const { Title, Text } = Typography;

interface TicketType {
  id: number;
  name: string;
  price: string;
  description?: string;
}

interface SummaryPanelProps {
  eventName: string;
  startTime?: string;
  location?: string;
  selectedTickets: { id: number; quantity: number }[];
  totalPrice: number;
  onContinue: () => void;
  ticketTypes: TicketType[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  eventName,
  startTime,
  location,
  selectedTickets,
  totalPrice,
  onContinue,
  ticketTypes,
}) => {
  const { isDesktop } = useResponsive();
  const totalTickets = selectedTickets.reduce((acc, ticket) => acc + ticket.quantity, 0);
  const hasSelections = totalTickets > 0;

  const mainContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Event Details */}
        <Title level={4} style={{ margin: 0 }}>
          {eventName}
        </Title>

        <Space direction="vertical" size="small" style={{ marginTop: 16 }}>
          {location && (
            <Space>
              <EnvironmentOutlined />
              <Text>{location}</Text>
            </Space>
          )}
          {startTime && (
            <Space>
              <CalendarOutlined />
              <Text>{dayjs(startTime).format('MMM D, YYYY - h:mm A')}</Text>
            </Space>
          )}
        </Space>

        <Divider style={{ margin: '24px 0' }} />

        {/* Ticket Types */}
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          {ticketTypes.map((ticket) => (
            <Row key={ticket.id} justify="space-between" align="top">
              <Text>{ticket.name}</Text>
              <Text strong>${ticket.price}</Text>
            </Row>
          ))}
        </Space>
      </div>

      {/* Action Button */}
      <div style={{ marginTop: 24 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
          {totalTickets > 0
            ? `${totalTickets} ${totalTickets === 1 ? 'ticket' : 'tickets'} selected`
            : 'No tickets selected'}
        </Text>
        <Button
          type="primary"
          size="large"
          block
          onClick={onContinue}
          disabled={!hasSelections}
        >
          {hasSelections ? `Continue • $${totalPrice.toFixed(2)}` : 'Please choose ticket'}
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          borderLeft: '1px solid #f0f0f0',
          padding: '24px',
          height: '100%',
          position: 'sticky',
          top: 0,
        }}
      >
        {mainContent}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #f0f0f0',
        padding: '12px 16px',
        zIndex: 100,
      }}
    >
      <Row justify="space-between" align="middle">
        <div>
          <Text type="secondary">
            {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'}
          </Text>
          <Title level={4} style={{ margin: 0 }}>
            ${totalPrice.toFixed(2)}
          </Title>
        </div>
        <Button
          type="primary"
          size="large"
          onClick={onContinue}
          disabled={!hasSelections}
        >
          {hasSelections ? 'Continue' : 'Please choose ticket'}
        </Button>
      </Row>
    </div>
  );
};

export default SummaryPanel;
