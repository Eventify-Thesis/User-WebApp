import React, { useState, useCallback, useEffect } from 'react';
import { Grid, Stack } from '@mantine/core';
import { Layout, Modal, Form, Input, message, Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import {
  useGetSeatingPlanDetail,
  useSeatingPlanMutations,
} from '@/queries/useSeatingPlanQueries';
import {
  SeatingPlan,
  Selection,
  EditorTool,
  Shape,
  Row,
  Seat,
  Area,
} from './types/index';
import PlanSettingsPanel from './components/PlanSettingsPanel';
import SeatSettingsPanel from './components/SeatSettingsPanel';
import RowSettingsPanel from './components/RowSettingsPanel';
import ShapeSettingsPanel from './components/ShapeSettingsPanel';
import Canvas from './components/Canvas';
import useEditorState from './hooks/useEditorState';
import './EventSeatMap.css';
import { useCanvasState } from './hooks/useCanvasState';
import { useCanvasHandlers } from './hooks/useCanvasHandlers';

const { Content, Sider } = Layout;

const EventSeatMap: React.FC = () => {
  const { eventId, planId } = useParams();
  const [seatingPlan, setSeatingPlan] = useState<SeatingPlan>();
  const [showGrid, setShowGrid] = useState(true);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { data: existingPlan, isLoading: isLoadingPlan } =
    useGetSeatingPlanDetail(eventId!, planId!);

  // Load existing plan if available
  useEffect(() => {
    if (existingPlan && !isLoadingPlan && planId !== 'new') {
      const parsedPlan = JSON.parse(existingPlan.plan);
      setSeatingPlan(parsedPlan);
    }
  }, [existingPlan, isLoadingPlan, planId]);

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout>
        <Content className="seat-map-content">
          <Canvas seatingPlan={seatingPlan} showGrid={showGrid} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default EventSeatMap;
