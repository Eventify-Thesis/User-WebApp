import React from "react";
import TicketSection from "../components/ticket-order/TicketSection/TicketSection";
import OrderSection from "../components/ticket-order/OrderSection/OrderSection";
import styled from "styled-components";
import { BASE_COLORS } from "@/styles/themes/constants";

const TicketContainer = styled.div`
  flex-direction: column;
  justify-content: center;
  color: white;
  align-items: center;
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background: #333; /* Dark background */
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Hightlight = styled.span`
  color: ${BASE_COLORS['yellow']};
`;

const orderData = {
  id: "VH20240310",
  createdAt: "25/02/2024 18:29",
  paymentMethod: "Momo",
  orderStatus: "Thành công",
  totalAmount: 0,
  buyer: {
    name: "John Henry",
    email: "contactforwork@gmail.com",
    phone: "0234567890",
    address: "Hồ Chí Minh, Việt Nam"
  },
  tickets: [
    {
      id: "TKT-001",
      eventName: "Nhà Hát Kịch IDECAF: THUỐC ĐẮNG GIÃ TẬT",
      imageUrl: "https://salt.tkbcdn.com/ts/ds/21/5f/d7/92e9981cc46850451627316bfea4abd5.jpg",
      ticketType: "eTicket",
      area: "VIP_Left",
      row: "C",
      seat: "6",
      time: "18:00 - 21:00, 10 tháng 03, 2024",
      price: 270000, // Added price field
      qrCode: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
    },
    {
      id: "TKT-002",
      eventName: "Nhà Hát Kịch IDECAF: THUỐC ĐẮNG GIÃ TẬT",
      imageUrl: "https://salt.tkbcdn.com/ts/ds/21/5f/d7/92e9981cc46850451627316bfea4abd5.jpg",
      ticketType: "eTicket",
      area: "VIP_Left",
      row: "C",
      seat: "7",
      time: "18:00 - 21:00, 10 tháng 03, 2024",
      price: 270000, // Added price field
      qrCode: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
    },
    {
      id: "TKT-003",
      eventName: "Live Concert: Sơn Tùng M-TP",
      imageUrl: "https://images.tkbcdn.com/1/1560/600/Upload/eventcover/2024/03/28/B13FAE.jpg",
      ticketType: "physicalTicket",
      area: "VIP_Center",
      row: "A",
      seat: "15",
      time: "19:00 - 22:00, 15 tháng 03, 2024",
      price: 270000, // Added price field
      qrCode: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
    }
  ]
};

// Dynamically calculate total price
orderData.totalAmount = orderData.tickets.reduce((sum, ticket) => sum + ticket.price, 0);


const TicketOrder: React.FC = () => {
  return (
    <TicketContainer>
      <Title>  <Hightlight>{orderData.tickets[0].eventName}</Hightlight> <Hightlight>{orderData.id}</Hightlight></Title>
      <TicketSection tickets={orderData.tickets} />
      <OrderSection order={orderData} />
    </TicketContainer>
  );
};

export default TicketOrder;
