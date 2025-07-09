import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout, Spin, Button, Space } from 'antd';
import {
  ReloadOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import Canvas from './components/Canvas';
import './EventSeatMap.css';
import { useGetSeatingPlanDetail } from '@/queries/useSeatingPlanQueries';
import { Loading } from '../common/Loading/Loading';
import { SeatLegend } from './components/SeatLegend';
const { Content } = Layout;

interface SeatAvailability {
  available_seats: { id: string }[];
  ticket_types: Array<{
    id: number;
    name: string;
    price: string;
    categories: string[];
    [key: string]: any;
  }>;
}

interface EventSeatMapProps {
  eventId: number;
  seatingPlanId: number;
  showId: number;
  selectedSeats: any[];
  setSelectedSeats: (seats: any[]) => void;
  setTicketTypesMapping: (ticketTypes: Record<string, any>) => void;
  onSelectSection: (section: any) => void;
}

const EventSeatMap: React.FC<EventSeatMapProps> = ({
  eventId,
  showId,
  seatingPlanId,
  selectedSeats,
  setSelectedSeats,
  setTicketTypesMapping,
  onSelectSection,
}) => {
  const { data: seatingPlanData, isLoading: isLoadingPlan } =
    useGetSeatingPlanDetail(eventId!, seatingPlanId!);
  const [scale, setScale] = useState(1);
  const [availableSeats, setAvailableSeats] = useState<Set<string>>(new Set());

  const seatingPlan = useMemo(() => {
    if (seatingPlanData?.plan) {
      return JSON.parse(seatingPlanData.plan);
    }
    return null;
  }, [seatingPlanData]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (seatingPlan) {
      // Create EventSource for SSE
      eventSource = new EventSource(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/seats/${showId}/availability/stream`,
      );

      eventSource.onmessage = (event) => {
        try {
          const data: SeatAvailability = JSON.parse(event.data).data;
          const availableSeatIds = new Set(
            data.available_seats.map((seat) => seat.id),
          );
          setAvailableSeats(availableSeatIds);
          let ticketTypesMapping: Record<string, any> = {};

          for (const ticketType of data.ticket_types) {
            for (const category of ticketType.categories) {
              ticketTypesMapping[category] = ticketType;
            }
          }

          setTicketTypesMapping(ticketTypesMapping);
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE Error:', error);
        eventSource?.close();
      };
    }

    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [seatingPlanId, seatingPlan]);

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleSeatSelect = (seat: any) => {
    if (!availableSeats?.has(seat.uuid)) return;
    const updatedSeats = selectedSeats.includes(seat)
      ? selectedSeats.filter((s: any) => s !== seat)
      : [...selectedSeats, seat];
    setSelectedSeats(updatedSeats);
  };

  const isSeatMode = seatingPlan?.mode == 'seat';

  return (
    <Layout style={{ height: '100%', width: '100%' }}>
      {isLoadingPlan && !availableSeats ? (
        <Spin />
      ) : (seatingPlan &&
          isSeatMode &&
          availableSeats &&
          availableSeats.size > 0) ||
        !isSeatMode ? (
        <Content className="seat-map-content" style={{ position: 'relative' }}>
          <div className="zoom-controls">
            <Space direction="vertical" size="small">
              <Button
                icon={<ZoomInOutlined />}
                onClick={() => handleZoom(0.1)}
                title="Zoom In"
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setSelectedSeats([])}
                title="Reset Selected Seats"
              />
              <Button
                icon={<ZoomOutOutlined />}
                onClick={() => handleZoom(-0.1)}
                title="Zoom Out"
              />
            </Space>
          </div>
          <Canvas
            seatingPlan={seatingPlan}
            scale={scale}
            onSeatSelect={handleSeatSelect}
            selectedSeats={selectedSeats}
            availableSeats={availableSeats}
            onSelectSection={onSelectSection}
          />
          {seatingPlan && isSeatMode && (
            <SeatLegend categories={seatingPlan.categories || []} />
          )}
        </Content>
      ) : (
        <Loading />
      )}
    </Layout>
  );
};

export default EventSeatMap;
