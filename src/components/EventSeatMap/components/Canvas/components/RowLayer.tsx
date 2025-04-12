import React from 'react';
import { Layer, Circle, Text, Group } from 'react-konva';
import { getSeatStyles } from '../utils/styleUtils';
import { CONSTANTS } from '../constants';

interface RowLayerProps {
  seatingPlan: any;
  onSeatSelect: (seats: any[]) => void;
  selectedSeats: any[];
}

export const RowLayer: React.FC<RowLayerProps> = ({
  seatingPlan,
  onSeatSelect,
  selectedSeats,
}) => {
  const handleSeatClick = (seat: any) => {
    const isSelected = selectedSeats.some((s) => s.uuid === seat.uuid);
    if (isSelected) {
      onSeatSelect(selectedSeats.filter((s) => s.uuid !== seat.uuid));
    } else {
      onSeatSelect([...selectedSeats, seat]);
    }
  };
  console.log('render RowLayer');
  return (
    <Layer>
      {seatingPlan?.zones?.flatMap((zone: any) =>
        zone.rows?.map((row: any) => (
          <Group key={row.uuid}>
            {row.seats?.map((seat: any) => {
              const isSelected = selectedSeats.some(
                (s) => s.uuid === seat.uuid,
              );
              return (
                <Group key={seat.uuid}>
                  <Circle
                    x={seat.position.x}
                    y={seat.position.y}
                    radius={seat.radius || CONSTANTS.SEAT.RADIUS}
                    {...getSeatStyles(
                      seat,
                      isSelected,
                      false,
                      seatingPlan.categories,
                    )}
                    onClick={() => handleSeatClick(seat)}
                    onTap={() => handleSeatClick(seat)}
                    listening={true}
                  />
                  <Text
                    x={seat.position.x}
                    y={seat.position.y}
                    text={seat.number.toString()}
                    fontSize={12}
                    fill="#000"
                    align="center"
                    verticalAlign="middle"
                    offsetX={6}
                    offsetY={6}
                  />
                </Group>
              );
            })}
          </Group>
        )),
      )}
    </Layer>
  );
};

RowLayer.displayName = 'RowLayer';
