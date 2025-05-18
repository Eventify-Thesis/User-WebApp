import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { SeatingPlan } from '../../types/index';
import { ShapeLayer } from './components/ShapeLayer';
import { RowLayer } from './components/RowLayer';
import './Canvas.css';
import BackgroundLayer from './components/BackgroundLayer';
import { SectionLayer } from './components/SectionLayer';

interface CanvasProps {
  seatingPlan: SeatingPlan;
  scale: number;
  onSeatSelect: (seats: any[]) => void;
  selectedSeats: any[];
  availableSeats: Set<string>;
  onSelectSection: (section: any) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  seatingPlan,
  scale,
  onSeatSelect,
  selectedSeats,
  availableSeats,
  onSelectSection,
}) => {
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [stageScale, setStageScale] = useState(scale);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    setStageScale(scale);
  }, [scale]);

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
    setStageScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setStagePosition(newPos);
  }, []);

  const handleDragEnd = useCallback((e: any) => {
    const stage = stageRef.current;
    if (stage) {
      setStagePosition({
        x: stage.x(),
        y: stage.y(),
      });
    }
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
        scale={{ x: stageScale, y: stageScale }}
        position={stagePosition}
      >
        <BackgroundLayer
          backgroundImage={seatingPlan.backgroundImage}
          stageSize={{
            width: dimensions.width,
            height: dimensions.height,
          }}
        />
        <ShapeLayer seatingPlan={seatingPlan} />

        {seatingPlan.mode === 'seat' ? (
          <RowLayer
            availableSeats={availableSeats}
            seatingPlan={seatingPlan}
            onSeatSelect={onSeatSelect}
            selectedSeats={selectedSeats}
          />
        ) : (
          <SectionLayer
            seatingPlan={seatingPlan}
            onSelectSection={onSelectSection}
          />
        )}
      </Stage>
    </div>
  );
};

export default Canvas;
