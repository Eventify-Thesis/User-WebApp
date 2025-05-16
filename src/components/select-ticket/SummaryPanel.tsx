import React, { useEffect, useState } from 'react';
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
  venueName?: string;
  selectedTickets: { id: number; quantity: number }[];
  selectedSeats: any[];
  totalPrice: number;
  onContinue: () => void;
  ticketTypes: TicketType[];
  ticketTypesMapping: Record<string, any>;
  theme?: 'light' | 'dark';
  hasSeatingPlan?: boolean;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  eventName,
  startTime,
  venueName,
  selectedTickets,
  selectedSeats,
  totalPrice,
  ticketTypes,
  onContinue,
  theme: themeProp = 'light',
}) => {
  const { isDesktop } = useResponsive();

  const [totalTickets, setTotalTickets] = useState(0);

  useEffect(() => {
    if (selectedTickets && selectedTickets.length > 0) {
      setTotalTickets(
        selectedTickets.reduce((acc, ticket) => acc + ticket.quantity, 0),
      );
    } else if (selectedSeats && selectedSeats.length > 0) {
      setTotalTickets(selectedSeats.length);
    }
  }, [selectedTickets, selectedSeats]);
  const hasSelections = totalTickets > 0;

  const isDark = themeProp === 'dark';
  const styles = {
    background: '#fff',
    textColor: '#212529',
    secondaryColor: '#6c757d',
    borderColor: '#e9ecef',
    gradientBg: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
    accentColor: '#495057',
    buttonColor: '#212529',
  };

  const actionButton = (
    <div
      style={{
        background: styles.background,
        borderTop: `1px solid ${styles.borderColor}`,
        padding: '16px',
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
      }}
    >
      <Text
        style={{
          display: 'block',
          marginBottom: 12,
          color: styles.secondaryColor,
        }}
      >
        {totalTickets > 0
          ? `${totalTickets} ${
              totalTickets === 1 ? 'ticket' : 'tickets'
            } selected`
          : 'No tickets selected'}
      </Text>
      <Button
        type="primary"
        size="large"
        block
        onClick={onContinue}
        disabled={!hasSelections}
        style={{
          height: '48px',
          fontSize: '16px',
          background: '#212529',
          border: 'none',
        }}
      >
        {hasSelections
          ? `Continue • ${totalPrice} Dong`
          : 'Please choose ticket'}
      </Button>
    </div>
  );

  const content = (
    <>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 0' }}>
        {/* Event Details */}
        <Title
          level={4}
          style={{
            margin: 0,
            color: '#212529',
            fontSize: '24px',
            fontWeight: 700,
          }}
        >
          {eventName}
        </Title>

        <Space direction="vertical" size="small" style={{ marginTop: 16 }}>
          {venueName && (
            <Space>
              <EnvironmentOutlined style={{ color: styles.accentColor }} />
              <Text style={{ color: styles.textColor }}>{venueName}</Text>
            </Space>
          )}
          {startTime && (
            <Space>
              <CalendarOutlined style={{ color: styles.accentColor }} />
              <Text style={{ color: styles.textColor }}>
                {dayjs(startTime).format('MMM D, YYYY - h:mm A')}
              </Text>
            </Space>
          )}
        </Space>

        <Divider
          style={{ margin: '24px 0', borderColor: styles.borderColor }}
        />

        {/* Ticket Types */}
        <Title level={5} style={{ color: '#212529', marginTop: 0, fontWeight: 600 }}>
          Available Tickets
        </Title>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {ticketTypes.map((ticket) => (
            <Row
              key={ticket.id}
              justify="space-between"
              align="top"
              style={{
                background: isDark ? '#141414' : '#f5f5f5',
                padding: '12px 16px',
                borderRadius: '8px',
              }}
            >
              <div>
                <Text style={{ color: styles.textColor, fontSize: '16px', fontWeight: 500 }}>
                  {ticket.name}
                </Text>
                {ticket.description && (
                  <Text
                    style={{
                      display: 'block',
                      color: styles.secondaryColor,
                      fontSize: '14px',
                    }}
                  >
                    {ticket.description}
                  </Text>
                )}
              </div>
              <Text
                strong
                style={{
                  color: styles.accentColor,
                  fontSize: '16px',
                }}
              >
                {Math.round(ticket.price)} Dong
              </Text>
            </Row>
          ))}
        </Space>
      </div>
      {actionButton}
    </>
  );

  if (isDesktop) {
    return (
      <div
        style={{
          background: styles.gradientBg,
          borderLeft: `1px solid ${styles.borderColor}`,
          height: '100%',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {content}
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
        background: styles.background,
        borderTop: `1px solid ${styles.borderColor}`,
        padding: '12px 16px',
        zIndex: 100,
      }}
    >
      <Row justify="space-between" align="middle">
        <div>
          <Text style={{ color: styles.secondaryColor }}>
            {totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'}
          </Text>
          <Title level={4} style={{ margin: 0, color: styles.textColor }}>
            ${totalPrice.toFixed(2)}
          </Title>
        </div>
        <Button
          type="primary"
          size="large"
          onClick={onContinue}
          disabled={!hasSelections}
          style={{
            height: '44px',
            fontSize: '16px',
            background: styles.buttonColor,
            border: 'none',
          }}
        >
          {hasSelections ? 'Continue' : 'Please choose ticket'}
        </Button>
      </Row>
    </div>
  );
};

export default SummaryPanel;
