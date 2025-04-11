import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { useParams } from 'react-router-dom';
import { useGetEventShowDetail } from '@/queries/useGetEventShowDetail';
import { Space } from 'antd';
import { TicketCard, SummaryPanel, Header } from '@/components/select-ticket';

interface TicketSelection {
  id: number;
  quantity: number;
  price: string;
  name: string;
}

const EventSelectTicketPage: React.FC = () => {
  const { eventId, showId } = useParams();
  const { data: show } = useGetEventShowDetail(eventId, showId);
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();

  const [selectedTickets, setSelectedTickets] = useState<TicketSelection[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

  const totalPrice = useMemo(() => {
    if (show?.seatingPlanId) {
      return selectedSeats.reduce(
        (acc, seat) => acc + parseFloat(seat.price || '0'),
        0,
      );
    }
    return selectedTickets.reduce(
      (acc, ticket) => acc + parseFloat(ticket.price) * ticket.quantity,
      0,
    );
  }, [selectedTickets, selectedSeats, show]);

  const handleTicketQuantityChange = (ticketId: number, quantity: number) => {
    const ticket = show?.ticketTypes.find((t) => t.id === ticketId);
    if (!ticket) return;

    if (
      quantity < ticket.minTicketPurchase ||
      quantity > ticket.maxTicketPurchase
    )
      return;

    setSelectedTickets((prev) => {
      const existing = prev.find((t) => t.id === ticketId);
      if (!existing) {
        return [
          ...prev,
          { id: ticketId, quantity, price: ticket.price, name: ticket.name },
        ];
      }
      if (quantity === 0) {
        return prev.filter((t) => t.id !== ticketId);
      }
      return prev.map((t) => (t.id === ticketId ? { ...t, quantity } : t));
    });
  };

  const handleSeatSelection = (seats: any[]) => {
    setSelectedSeats(seats);
  };

  const handleContinue = () => {
    // Handle continue action
    console.log('Continue with selection:', {
      selectedTickets,
      selectedSeats,
      totalPrice,
    });
  };

  const mainContent = show?.seatingPlanId ? (
    // <EventSeatMap
    //   seatingPlanId={show.seatingPlanId}
    //   onSeatSelect={handleSeatSelection}
    //   selectedSeats={selectedSeats}
    // />
    <></>
  ) : (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {show?.ticketTypes.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          quantity={
            selectedTickets.find((t) => t.id === ticket.id)?.quantity || 0
          }
          onQuantityChange={handleTicketQuantityChange}
        />
      ))}
    </Space>
  );

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <PageTitle>{t('eventSelectTicketPage.title')}</PageTitle>
      {show && (
        <div style={{ display: 'flex', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              maxWidth: isDesktop ? 'calc(100% - 400px)' : '100%',
            }}
          >
            <Header />
            <div style={{ flex: 1, padding: '24px' }}>{mainContent}</div>
          </div>
          {isDesktop && (
            <div style={{ width: '400px', height: '100vh' }}>
              <SummaryPanel
                eventName={show.name}
                startTime={show.startTime}
                location={show.location}
                selectedTickets={selectedTickets}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
                onContinue={handleContinue}
                hasSeatingPlan={!!show.seatingPlanId}
                ticketTypes={show.ticketTypes}
              />
            </div>
          )}
          {!isDesktop && (
            <SummaryPanel
              eventName={show.name}
              startTime={show.startTime}
              location={show.location}
              selectedTickets={selectedTickets}
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
              onContinue={handleContinue}
              hasSeatingPlan={!!show.seatingPlanId}
              ticketTypes={show.ticketTypes}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EventSelectTicketPage;
