import React from 'react';
import { Card, Typography, Space, InputNumber, Row, Button } from 'antd';
import {
  MinusOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface TicketCardProps {
  ticket: {
    id: number;
    name: string;
    price: string;
    description?: string;
    minTicketPurchase: number;
    maxTicketPurchase: number;
  };
  quantity: number;
  onQuantityChange: (id: number, quantity: number) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  quantity,
  onQuantityChange,
}) => {

  const handleQuantityChange = (value: number | null) => {
    const newValue = value ?? 0;
    if (newValue >= 0 && newValue <= ticket.maxTicketPurchase) {
      onQuantityChange(ticket.id, newValue);
    }
  };

  return (
    <Card
      style={{
        width: '100%',
        background: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: '16px' }}
      >
        <Space direction="vertical" size={4} style={{ flex: 1 }}>
          <Title
            level={5}
            style={{
              margin: 0,
              color: '#212529',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            {ticket.name}
          </Title>
          <Text
            strong
            style={{
              fontSize: '20px',
              color: '#495057',
            }}
          >
            ${ticket.price}
          </Text>
        </Space>
        <Space
          style={{
            background: '#f1f3f5',
            borderRadius: '8px',
            padding: '4px',
          }}
        >
          <Button
            type="text"
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 0}
            style={{ color: quantity <= 0 ? '#adb5bd' : '#212529' }}
          />
          <InputNumber
            min={0}
            max={ticket.maxTicketPurchase}
            value={quantity}
            onChange={handleQuantityChange}
            controls={false}
            style={{
              width: '50px',
              background: 'transparent',
              border: 'none',
              color: '#212529',
              textAlign: 'center',
            }}
            className="light-input-number"
          />
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= ticket.maxTicketPurchase}
            style={{
              color:
                quantity >= ticket.maxTicketPurchase
                  ? '#adb5bd'
                  : '#212529',
            }}
          />
        </Space>
      </Row>

      {ticket.description && (
        <div
          style={{
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '12px 16px',
            marginTop: '16px',
            border: '1px solid #e9ecef',
          }}
        >
          <Space align="start">
            <InfoCircleOutlined
              style={{ color: '#495057', marginTop: '3px' }}
            />
            <Text
              style={{
                color: '#6c757d',
                fontSize: '14px',
              }}
            >
              {ticket.description}
            </Text>
          </Space>
        </div>
      )}

      {ticket.maxTicketPurchase > 0 && (
        <Text
          style={{
            display: 'block',
            marginTop: '12px',
            fontSize: '12px',
            color: '#6c757d',
          }}
        >
          Maximum {ticket.maxTicketPurchase} tickets per order
        </Text>
      )}
    </Card>
  );
};

export default TicketCard;
