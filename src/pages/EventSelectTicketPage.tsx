import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useResponsive } from '@/hooks/useResponsive';
import { useNavigate, useParams } from 'react-router-dom';
import { saveBookingCode } from '@/services/localStorage.service';
import { useGetEventShowDetail } from '@/queries/useGetEventShowDetail';
import { notification, Space, Spin } from 'antd';
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  Box,
  ActionIcon,
  Center,
  Paper,
} from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';
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
    const ticket = show?.ticketTypes.find((t: any) => t.id === ticketId);
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

  // This will open up a mantine modal and will ask user to input number of tickets for this section, can use button too
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);

  const handleSelectSection = (section: any) => {
    console.log('section', JSON.stringify(section, null, 2));
    setSelectedSection(section);
    setTicketQuantity(1);
    setSectionModalOpen(true);
  };

  const handleConfirmTickets = useCallback(
    async (section: any) => {
      console.log('section', JSON.stringify(section, null, 2));
      try {
        const response = await submitTicketInfo({
          eventId: event?.id,
          showId: show?.id,
          timestamp: Date.now(),
          platform: 'web',
          items: [
            {
              id: ticketTypesMapping[selectedSection.category].id,
              sectionId: selectedSection.uuid,
              quantity: ticketQuantity,
              sectionName: selectedSection.name,
            },
          ],
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
    },
    [event, show, selectedSection, ticketQuantity, ticketTypesMapping],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#f8f9fa',
      }}
    >
      <PageTitle>Select Your Tickets</PageTitle>

      <Modal
        opened={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        title={
          <Text fw={700} fz="xl" c="#6741D9">
            Get Your Tickets! 🎟️
          </Text>
        }
        centered
        size="sm"
        radius="lg"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: {
            background: 'linear-gradient(135deg, #f5f7ff 0%, #fff 100%)',
            boxShadow:
              '0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)',
          },
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 15,
          },
        }}
      >
        <Stack gap="xl" mt="md">
          <Paper
            p="md"
            radius="md"
            withBorder
            shadow="sm"
            style={{ borderColor: '#e9ecef', background: 'white' }}
          >
            <Text fw={600} fz="lg" c="#444" mb="xs">
              Section:{' '}
              <Text span c="#6741D9" fw={700}>
                {selectedSection?.name}
              </Text>
            </Text>

            {selectedSection && (
              <Box
                mb="md"
                p="xs"
                style={{
                  background: 'rgba(103, 65, 217, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(103, 65, 217, 0.1)',
                }}
              >
                {selectedSection.category && (
                  <Group gap="xs" mb="xs">
                    <Text fz="xs" fw={600} c="#555">
                      Category:
                    </Text>
                    <Text fz="xs" c="#666">
                      {selectedSection.category}
                    </Text>
                  </Group>
                )}

                <Group gap="xs">
                  <Text fz="xs" fw={600} c="#555">
                    Available:
                  </Text>
                  <Text fz="xs" c="#666">
                    {selectedSection.quantity} tickets
                  </Text>
                </Group>
              </Box>
            )}

            <Text fz="sm" c="#666" mb="lg">
              How many tickets would you like to get? Choose wisely! 😎
            </Text>

            <Center mb="md">
              <Group>
                <ActionIcon
                  size="lg"
                  variant="light"
                  color="grape"
                  onClick={() =>
                    setTicketQuantity(Math.max(1, ticketQuantity - 1))
                  }
                  disabled={ticketQuantity <= 1}
                  radius="xl"
                >
                  <IconMinus size={18} />
                </ActionIcon>

                <Box
                  w={70}
                  style={{
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 24,
                    color: '#6741D9',
                    background: '#f8f9fa',
                    borderRadius: 8,
                    padding: '8px 0',
                  }}
                >
                  {ticketQuantity}
                </Box>

                <ActionIcon
                  size="lg"
                  variant="light"
                  color="grape"
                  onClick={() =>
                    setTicketQuantity(Math.min(10, ticketQuantity + 1))
                  }
                  disabled={ticketQuantity >= 10}
                  radius="xl"
                >
                  <IconPlus size={18} />
                </ActionIcon>
              </Group>
            </Center>
          </Paper>

          <Group justify="center" mt="md" gap="md">
            <Button
              variant="light"
              color="gray"
              onClick={() => setSectionModalOpen(false)}
              radius="xl"
              size="md"
              style={{ fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleConfirmTickets(selectedSection)}
              radius="xl"
              size="md"
              style={{
                background: 'linear-gradient(135deg, #6741D9 0%, #8763E8 100%)',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(103, 65, 217, 0.4)',
              }}
              leftSection={<IconPlus size={18} />}
            >
              Buy Tickets
            </Button>
          </Group>
        </Stack>
      </Modal>
      {isLoadingEvent || isLoadingShow ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
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
                  onSelectSection={handleSelectSection}
                />
              ) : (
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  {show?.ticketTypes.map((ticket: any) => (
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
