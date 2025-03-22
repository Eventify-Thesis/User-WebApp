import React from "react";
import TicketSection from "../components/ticket-order/TicketSection/TicketSection";
import OrderSection from "../components/ticket-order/OrderSection/OrderSection";
import styled from "styled-components";
import { BASE_COLORS } from "@/styles/themes/constants";
import { useParams } from "react-router-dom";
import { useGetOrderById } from "@/queries/useGetOrders";
import { useGetTickets } from "@/queries/useGetTickets";

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

const TicketOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  // Fetch order details
  const { data: orderData, isLoading, isError } = useGetOrderById(orderId || "");
  // Fetch tickets for this order
  const { data: tickets, isLoading: ticketsLoading } = useGetTickets(orderId || "");

  if (isLoading || ticketsLoading) return <p>Loading...</p>;
  if (isError || !orderData) return <p>Error fetching order details</p>;

  return (
    <TicketContainer>
      <Title>
        <Hightlight>{orderData.eventName}</Hightlight> <Hightlight>{orderData.id}</Hightlight>
      </Title>
      <TicketSection tickets={tickets || []} imageUrl={orderData.imageUrl} />
      <OrderSection order={orderData} tickets={tickets || []}/>
    </TicketContainer>
  );
};

export default TicketOrder;

