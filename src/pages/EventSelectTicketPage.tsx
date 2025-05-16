import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { useNavigate, useParams } from 'react-router-dom';
import { saveBookingCode } from '@/services/localStorage.service';
import { useGetEventShowDetail } from '@/queries/useGetEventShowDetail';
import { notification, Space, Spin } from 'antd';
import { TicketCard, SummaryPanel, Header } from '@/components/select-ticket';
import { useGetEventDetail } from '@/queries/useGetEventDetail';
import EventSeatMap from '@/components/EventSeatMap/EventSeatMap';
import { useBookingMutations } from '@/mutations/useBookingMutations';
import { ItemInfo } from '@/api/booking.client';

interface TicketSelection {
  id: number;
  quantity: number;
  price: string;
  name: string;
}

const EventSelectTicketPage: React.FC = () => {
  const { eventId, showId } = useParams();
  const { data: event, isLoading: isLoadingEvent } = useGetEventDetail(eventId);
  const { data: show, isLoading: isLoadingShow } = useGetEventShowDetail(
    eventId,
    showId,
  );
  const { t } = useTranslation();
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();
  const { submitTicketInfo } = useBookingMutations();

  const [selectedTickets, setSelectedTickets] = useState<TicketSelection[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [ticketTypesMapping, setTicketTypesMapping] = useState<
    Record<string, any>
  >({});

  const totalPrice = useMemo(() => {
    if (show?.seatingPlanId) {
      if (ticketTypesMapping) {
        return selectedSeats.reduce(
          (acc, seat) =>
            acc + parseFloat(ticketTypesMapping[seat.category]?.price || '0'),
          0,
        );
      } else {
        return parseFloat('0');
      }
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
      (quantity != 0 && quantity < ticket.minTicketPurchase) ||
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

  const handleContinue = useCallback(async () => {
    try {
      let ticketItems: ItemInfo[] = [];

      if (selectedTickets && selectedTickets.length > 0) {
        ticketItems = selectedTickets.map((ticket) => ({
          id: ticket.id,
          quantity: ticket.quantity,
        }));
      } else if (selectedSeats && selectedSeats.length > 0) {
        // Group seats by ticket type
        const seatsByTicketType = selectedSeats.reduce((acc, seat) => {
          const ticketType = ticketTypesMapping[seat.category];
          if (!acc[ticketType.id]) {
            acc[ticketType.id] = {
              id: ticketType.id,
              quantity: 0,
              seats: [],
            };
          }
          acc[ticketType.id].quantity += 1;
          acc[ticketType.id].seats.push({
            id: seat.uuid, // Ensure seat id is present
            quantity: 1,
          });
          return acc;
        }, {});

        ticketItems = Object.values(seatsByTicketType);
      } else {
        throw new Error('No tickets or seats selected');
      }

      const response = await submitTicketInfo({
        eventId: event?.id,
        showId: show?.id,
        timestamp: Date.now(),
        platform: 'web',
        items: ticketItems,
      });

      if (!response.data?.error) {
        saveBookingCode(show?.id, response.data.code);
        navigate(`/events/${event?.id}/bookings/${show?.id}/question-form`);
      } else if (response.data?.error) {
        notification.error({
          message: 'Seat already reserved',
          description: response.data?.error,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to process your booking. Please try again.',
      });
    }
  }, [event, show, selectedTickets, selectedSeats, ticketTypesMapping]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#f8f9fa',
      }}
    >
      <PageTitle>{t('eventSelectTicketPage.title')}</PageTitle>
      {isLoadingEvent || isLoadingShow ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin style={{ color: '#212529' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              maxWidth: isDesktop ? 'calc(100% - 400px)' : '100%',
              background: '#f8f9fa',
              color: '#212529',
            }}
          >
            <Header />
            <div
              style={{
                flex: 1,
                background: 'linear-gradient(180deg, #f1f3f5 0%, #f8f9fa 100%)',
                padding: '0 20px',
              }}
            >
              {event.id && show?.seatingPlanId ? (
                <EventSeatMap
                  eventId={event?.id}
                  seatingPlanId={show.seatingPlanId}
                  showId={show.id}
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                  setTicketTypesMapping={setTicketTypesMapping}
                />
              ) : (
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  {show?.ticketTypes.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      quantity={
                        selectedTickets.find((t) => t.id === ticket.id)
                          ?.quantity || 0
                      }
                      onQuantityChange={handleTicketQuantityChange}
                    />
                  ))}
                </Space>
              )}
            </div>
          </div>
          {isDesktop && (
            <div style={{ width: '400px', height: '100vh' }}>
              <SummaryPanel
                eventName={event?.eventName}
                startTime={show.startTime}
                venueName={event?.venueName}
                selectedTickets={selectedTickets}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
                onContinue={handleContinue}
                hasSeatingPlan={!!show.seatingPlanId}
                ticketTypes={show.ticketTypes}
                ticketTypesMapping={ticketTypesMapping}
                theme="light"
              />
            </div>
          )}
          {!isDesktop && (
            <SummaryPanel
              eventName={event?.eventName}
              startTime={show.startTime}
              venueName={event?.venueName}
              selectedTickets={selectedTickets}
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
              onContinue={handleContinue}
              hasSeatingPlan={!!show.seatingPlanId}
              ticketTypes={show.ticketTypes}
              ticketTypesMapping={ticketTypesMapping}
              theme="light"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EventSelectTicketPage;
