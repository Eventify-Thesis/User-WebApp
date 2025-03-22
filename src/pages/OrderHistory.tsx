import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TicketTabs from "@/components/order-history/TicketTabs/TicketTabs";
import TicketInfo from "@/components/order-history/TicketInfo/TicketInfo";
import NoTickets from "@/components/order-history/NoTickets/NoTickets";
import { EventGrid } from "@/components/EventList/EventGrid/EventGrid";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  background: #18181b;
  color: white;
  padding: 20px;
  min-height: 100vh;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const TicketCard = styled.div`
  margin-bottom: 12px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const LoadingText = styled.p`
  color: #fff;
  font-size: 16px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 16px;
`;

// Define Ticket Type
interface Ticket {
  id: number;
  date: Date;
  title: string;
  status: string;
  ticketType: string;
  time: string;
  location: string;
  imageUrl: string;
}

const events = [
  {
    id: "1",
    eventName: "ART WORKSHOP 'UJI MATCHA CHEESECAKE TARTE'",
    price: "420.000đ",
    date: new Date(Date.parse("2023-01-13")),
    eventBannerURL: "https://cdn.builder.io/api/v1/image/assets/TEMP/49e4c3587b8fbaa866ba74be4007470e57f89267",
  },
  {
    id: "2",
    eventName: "[GARDEN ART] - ART WORKSHOP 'TIRAMISU MOUSSE CAKE'",
    price: "390.000đ",
    date: new Date(Date.parse("2023-01-13")),
    eventBannerURL: "https://cdn.builder.io/api/v1/image/assets/TEMP/8b8cf454f031702a8ed64cffc36975443f3d9097",
  },
  {
    id: "3",
    eventName: "ART WORKSHOP 'UJI MATCHA CHEESECAKE TARTE'",
    price: "420.000đ",
    date: new Date(Date.parse("2023-01-13")),
    eventBannerURL: "https://cdn.builder.io/api/v1/image/assets/TEMP/49e4c3587b8fbaa866ba74be4007470e57f89267",
  },
  {
    id: "4",
    eventName: "[GARDEN ART] - ART WORKSHOP 'TIRAMISU MOUSSE CAKE'",
    price: "390.000đ",
    date: new Date(Date.parse("2023-01-13")),
    eventBannerURL: "https://cdn.builder.io/api/v1/image/assets/TEMP/8b8cf454f031702a8ed64cffc36975443f3d9097",
  },
];

const OrderHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [subTab, setSubTab] = useState("ended");
  const [tickets, setTickets] = useState<Ticket[]>([]); // ✅ Apply type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/tickets?status=${activeTab}&timeframe=${subTab}`
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        // Convert date string to Date object
        const parsedData = data.map((ticket: { date: string | number | Date; }) => ({
          ...ticket,
          date: new Date(ticket.date) // Convert string to Date object
        }));

        if (isMounted) {
          setTickets(parsedData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Không thể tải vé. Vui lòng thử lại.");
          setLoading(false);
        }
      }
    };

    fetchTickets();

    return () => {
      isMounted = false;
    };
  }, [activeTab, subTab]);

  return (
    <Container>
      <Title>{t("orderHistory.title")}</Title>

      <TicketTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subTab={subTab}
        setSubTab={setSubTab}
      />

      {loading && <LoadingText>{t("orderHistory.loading")}</LoadingText>}
      {error && <ErrorText>{t("orderHistory.error")}</ErrorText>}

      {!loading && !error && tickets.length > 0 ? (
        tickets.map((ticket) => (
          <TicketCard key={ticket.id} onClick={() => navigate("/ticket-order")}>
            <TicketInfo
              date={ticket.date}
              title={ticket.title}
              status={ticket.status}
              ticketType={ticket.ticketType}
              time={ticket.time}
              location={ticket.location}
              imageUrl={ticket.imageUrl}
            />
          </TicketCard>
        ))
      ) : (
        !loading && !error && tickets.length === 0 && <NoTickets />
      )}

      <Title>{t("orderHistory.recommended")}</Title>

      <EventGrid events={events} />
    </Container>
  );
};

export default OrderHistory;
