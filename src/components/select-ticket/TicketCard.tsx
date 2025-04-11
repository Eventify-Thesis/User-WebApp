import React from 'react';
import { Card, Typography, Row, Space, InputNumber, Image } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface TicketType {
  id: number;
  name: string;
  price: string;
  description: string;
  minTicketPurchase: number;
  maxTicketPurchase: number;
  imageUrl?: string;
}

interface TicketCardProps {
  ticket: TicketType;
  quantity: number;
  onQuantityChange: (id: number, quantity: number) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  quantity,
  onQuantityChange,
}) => {
  const handleQuantityChange = (value: number | null) => {
    if (value === null) return;
    onQuantityChange(ticket.id, value);
  };

  return (
    <Card
      hoverable
      style={{
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Row justify="space-between" align="middle">
          <Space direction="vertical" size={4}>
            <Title level={5} style={{ margin: 0 }}>
              {ticket.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 16, fontWeight: 'bold' }}>
              ${ticket.price}
            </Text>
          </Space>
          {ticket.imageUrl && (
            <Image
              src={ticket.imageUrl}
              alt={ticket.name}
              width={80}
              height={80}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={false}
            />
          )}
        </Row>

        <Paragraph type="secondary" style={{ margin: 0 }}>
          {ticket.description}
        </Paragraph>

        <Row justify="space-between" align="middle">
          <Text type="secondary">
            Limit: {ticket.minTicketPurchase} - {ticket.maxTicketPurchase}
          </Text>
          <Space>
            <InputNumber
              min={0}
              max={ticket.maxTicketPurchase}
              value={quantity}
              onChange={handleQuantityChange}
              controls={false}
              style={{ width: 50, textAlign: 'center' }}
              bordered={false}
            />
            <Space.Compact>
              <button
                onClick={() => handleQuantityChange(Math.max(0, quantity - 1))}
                style={{
                  border: '1px solid #d9d9d9',
                  background: 'white',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  borderRadius: '2px 0 0 2px',
                }}
                disabled={quantity <= 0}
              >
                <MinusOutlined />
              </button>
              <button
                onClick={() =>
                  handleQuantityChange(
                    Math.min(ticket.maxTicketPurchase, quantity + 1),
                  )
                }
                style={{
                  border: '1px solid #d9d9d9',
                  borderLeft: 'none',
                  background: 'white',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  borderRadius: '0 2px 2px 0',
                }}
                disabled={quantity >= ticket.maxTicketPurchase}
              >
                <PlusOutlined />
              </button>
            </Space.Compact>
          </Space>
        </Row>
      </Space>
    </Card>
  );
};

export default TicketCard;
