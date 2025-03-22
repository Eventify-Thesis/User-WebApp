import { Table } from "antd";
import * as s from "./OrderSection.styles";
import { useTranslation } from "react-i18next";

interface Ticket {
  id: string;
  eventName: string;
  imageUrl: string;
  ticketType: string;
  area: string;
  row: string;
  seat: string;
  time: string;
  qrCode: string;
}

interface Order {
  id: string;
  tickets: Ticket[];
  paymentMethod: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  buyer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
}

interface OrderSectionProps {
  order: Order;
}

const OrderSection: React.FC<OrderSectionProps> = ({ order }) => {
  const { t } = useTranslation();
  const columns = [
    { title: t("orderSection.ticketType"), dataIndex: "ticketType", key: "ticketType" },
    { title: t("orderSection.quantity"), dataIndex: "quantity", key: "quantity" },
    { 
      title: t("orderSection.totalPrice"), 
      dataIndex: "totalPrice", 
      key: "totalPrice", 
      render: (text: number) => `${text.toLocaleString()} đ` 
    },
  ];

  // Group tickets by type for table display
  const ticketSummary = order.tickets.reduce((acc, ticket) => {
    const existing = acc.find((t) => t.ticketType === ticket.ticketType);
    if (existing) {
      existing.quantity += 1;
      existing.totalPrice += 270000; // Assuming each ticket costs 270,000 đ
    } else {
      acc.push({
        key: ticket.id,
        ticketType: ticket.ticketType,
        quantity: 1,
        totalPrice: 270000,
      });
    }
    return acc;
  }, [] as { key: string; ticketType: string; quantity: number; totalPrice: number }[]);

  return (
    <div>
      {/* Order Info */}
      <s.StyledCard title={`${t("orderSection.order")}: ${order.id}`} bordered={false} isTopCard={true}>
        <Table
          columns={[
            { title: t("orderSection.orderDate"), dataIndex: "createdAt", key: "createdAt" },
            { title: t("orderSection.paymentMethod"), dataIndex: "paymentMethod", key: "paymentMethod" },
            { title: t("orderSection.orderStatus"), dataIndex: "orderStatus", key: "orderStatus" },
          ]}
          dataSource={[order]}
          pagination={false}
          bordered
          scroll={{ x: 300 }}
        />
      </s.StyledCard>

      {/* Buyer Info */}
      <s.ScrollContainer>
        <s.StyledCard title={t("orderSection.buyerInfo")} bordered={false}>
          <Table
            columns={[
              { title: t("orderSection.name"), dataIndex: "name", key: "name" },
              { title: t("orderSection.email"), dataIndex: "email", key: "email" },
              { title: t("orderSection.phone"), dataIndex: "phone", key: "phone" },
              { title: t("orderSection.address"), dataIndex: "address", key: "address" },
            ]}
            dataSource={[order.buyer]}
            pagination={false}
            bordered
            scroll={{ x: 600 }}
          />
        </s.StyledCard>
      </s.ScrollContainer>

      {/* Order Summary */}
      <s.StyledCard title={t("orderSection.orderSummary")} bordered={false}>
        <Table columns={columns} dataSource={ticketSummary} pagination={false} bordered />
        <h3 style={{ textAlign: "right", color: "green", marginTop: "10px" }}>
          {t("orderSection.totalAmount")}: {order.totalAmount.toLocaleString()} đ
        </h3>
      </s.StyledCard>
    </div>
  );
};

export default OrderSection;
