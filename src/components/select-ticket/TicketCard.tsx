import React from 'react';
import { Card, Typography, Space, InputNumber, Row, theme, Button } from 'antd';
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
  const { token } = theme.useToken();

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
        background: '#1f1f1f',
        border: '1px solid #303030',
        borderRadius: '12px',
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
              color: token.colorPrimary,
              fontSize: '18px',
            }}
          >
            {ticket.name}
          </Title>
          <Text
            strong
            style={{
              fontSize: '20px',
              color: '#fff',
            }}
          >
            ${ticket.price}
          </Text>
        </Space>
        <Space
          style={{
            background: '#141414',
            borderRadius: '8px',
            padding: '4px',
          }}
        >
          <Button
            type="text"
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 0}
            style={{ color: quantity <= 0 ? '#666' : token.colorPrimary }}
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
              textAlign: 'center',
            }}
            className="dark-input-number"
          />
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= ticket.maxTicketPurchase}
            style={{
              color:
                quantity >= ticket.maxTicketPurchase
                  ? '#666'
                  : token.colorPrimary,
            }}
          />
        </Space>
      </Row>

      {ticket.description && (
        <div
          style={{
            background: '#141414',
            borderRadius: '8px',
            padding: '12px 16px',
          }}
        >
          <Space align="start">
            <InfoCircleOutlined
              style={{ color: token.colorPrimary, marginTop: '3px' }}
            />
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.45)',
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
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          Maximum {ticket.maxTicketPurchase} tickets per order
        </Text>
      )}
    </Card>
  );
};

export default TicketCard;
