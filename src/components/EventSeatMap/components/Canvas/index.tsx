import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { SeatingPlan } from '../..//types/index';
import { ShapeLayer } from './components/ShapeLayer';
import { RowLayer } from './components/RowLayer';
import './Canvas.css';
import BackgroundLayer from './components/BackgroundLayer';

interface CanvasProps {
  seatingPlan: SeatingPlan;
  scale: number;
  onSeatSelect: (seats: any[]) => void;
  selectedSeats: any[];
}

const Canvas: React.FC<CanvasProps> = ({
  seatingPlan,
  scale,
  onSeatSelect,
  selectedSeats,
}) => {
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  }, []);

  const handleDragEnd = useCallback((e: any) => {
    // You can save the position here if needed
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#000000',
      }}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        draggable
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
        scale={{ x: scale, y: scale }}
      >
        {seatingPlan?.backgroundImage && (
          <BackgroundLayer
            backgroundImage={seatingPlan.backgroundImage}
            stageSize={{
              width: dimensions.width,
              height: dimensions.height,
            }}
          />
        )}

        <BackgroundLayer
          background={seatingPlan.background}
          stageSize={{
            width: dimensions.width,
            height: dimensions.height,
          }}
        />

        <ShapeLayer seatingPlan={seatingPlan} />
        <RowLayer
          seatingPlan={seatingPlan}
          onSeatSelect={onSeatSelect}
          selectedSeats={selectedSeats}
        />
      </Stage>
    </div>
  );
};

export default Canvas;
