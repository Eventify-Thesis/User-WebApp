import React from 'react';
import { Card, Space, Typography } from 'antd';
import { Circle, Stage, Layer } from 'react-konva';
import { Category } from '../../types';
import { CONSTANTS } from '../Canvas/constants';
import './SeatLegend.css';

const { Text } = Typography;

interface SeatLegendProps {
  categories: Category[];
}

interface LegendItemProps {
  color: string;
  strokeColor: string;
  label: string;
  showX?: boolean;
}

const LegendItem: React.FC<LegendItemProps> = ({
  color,
  strokeColor,
  label,
  showX = false,
}) => (
  <div className="legend-item">
    <Stage width={40} height={40}>
      <Layer>
        <Circle
          x={20}
          y={20}
          radius={15}
          fill={color}
          stroke={strokeColor}
          strokeWidth={2}
        />
        {showX && (
          <>
            <Circle x={13} y={13} radius={1.5} fill="#FFFFFF" />
            <Circle x={27} y={27} radius={1.5} fill="#FFFFFF" />
            <Circle x={27} y={13} radius={1.5} fill="#FFFFFF" />
            <Circle x={13} y={27} radius={1.5} fill="#FFFFFF" />
          </>
        )}
      </Layer>
    </Stage>
    <Text className="legend-label">{label}</Text>
  </div>
);

export const SeatLegend: React.FC<SeatLegendProps> = ({ categories }) => {
  return (
    <Card className="seat-legend" size="small" title="Seat Legend">
      <Space direction="vertical" size="small">
        {/* Available seats */}
        <LegendItem
          color={CONSTANTS.STYLE.DEFAULT.FILL}
          strokeColor={CONSTANTS.STYLE.DEFAULT.STROKE}
          label="Available"
        />

        {/* Selected seats */}
        <LegendItem
          color={CONSTANTS.STYLE.SELECTED.FILL}
          strokeColor={CONSTANTS.STYLE.SELECTED.STROKE}
          label="Selected"
        />

        {/* Booked/Unavailable seats */}
        <LegendItem
          color={CONSTANTS.STYLE.BOOKED.FILL}
          strokeColor={CONSTANTS.STYLE.BOOKED.STROKE}
          label="Booked/Unavailable"
          showX={true}
        />

        {/* Category seats */}
        {categories && categories.length > 0 && (
          <>
            <div className="legend-divider" />
            <Text strong style={{ fontSize: '12px' }}>
              Categories:
            </Text>
            {categories.map((category) => (
              <LegendItem
                key={category.name}
                color={category.color}
                strokeColor={category.color}
                label={category.name}
              />
            ))}
          </>
        )}
      </Space>
    </Card>
  );
};
