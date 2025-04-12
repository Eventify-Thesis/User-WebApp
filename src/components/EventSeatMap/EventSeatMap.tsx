import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Spin, Button, Space } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import Canvas from './components/Canvas';
import './EventSeatMap.css';
import { useGetSeatingPlanDetail } from '@/queries/useSeatingPlanQueries';
const { Content } = Layout;

interface EventSeatMapProps {
  eventId: string;
  seatingPlanId: string;
  onSeatSelect: (seats: any[]) => void;
  selectedSeats: any[];
}

const EventSeatMap: React.FC<EventSeatMapProps> = ({
  eventId,
  seatingPlanId,
  onSeatSelect,
  selectedSeats,
}) => {
  const { data: seatingPlanData, isLoading: isLoadingPlan } =
    useGetSeatingPlanDetail(eventId!, seatingPlanId!);
  const [scale, setScale] = useState(1);

  const seatingPlan = useMemo(() => {
    if (seatingPlanData?.plan) {
      return JSON.parse(seatingPlanData.plan);
    }
    return null;
  }, [seatingPlanData]);

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  return (
    <Layout style={{ height: '100%', width: '100%' }}>
      {isLoadingPlan ? (
        <Spin />
      ) : seatingPlan ? (
        <Content className="seat-map-content">
          <div className="zoom-controls">
            <Space direction="vertical" size="small">
              <Button
                icon={<ZoomInOutlined />}
                onClick={() => handleZoom(0.1)}
                title="Zoom In"
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
            onSeatSelect={onSeatSelect}
            selectedSeats={selectedSeats}
          />
        </Content>
      ) : (
        <div>No seating plan data available</div>
      )}
    </Layout>
  );
};

export default EventSeatMap;
