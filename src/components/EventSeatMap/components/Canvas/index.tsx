import React, { useRef } from 'react';
import { Stage, Layer, Group, Line, Circle, Rect, Ellipse } from 'react-konva';
import { SeatingPlan } from '../..//types/index';
import { ShapeLayer } from './components/ShapeLayer';
import { RowLayer } from './components/RowLayer';
import './Canvas.css';
import BackgroundLayer from './components/BackgroundLayer';

interface CanvasProps {
  seatingPlan: SeatingPlan;
}

const Canvas: React.FC<CanvasProps> = ({ seatingPlan }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <Stage>
        <BackgroundLayer
          backgroundImage={seatingPlan.backgroundImage}
          stageSize={{
            width: seatingPlan.zones[0].width,
            height: seatingPlan.zones[0].height,
          }}
        />

        <ShapeLayer seatingPlan={seatingPlan} />

        <RowLayer seatingPlan={seatingPlan} />
      </Stage>
    </div>
  );
};

export default Canvas;
