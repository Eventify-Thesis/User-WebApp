import React from 'react';
import { Layer, Circle, Text, Group, Rect } from 'react-konva';
import { getSeatStyles } from '../utils/styleUtils';
import { CONSTANTS } from '../constants';

interface RowLayerProps {
  seatingPlan: any;
  onSeatSelect: (seats: any) => void;
  selectedSeats: any[];
  availableSeats: Set<string>;
}

export const RowLayer: React.FC<RowLayerProps> = ({
  seatingPlan,
  onSeatSelect,
  selectedSeats,
  availableSeats,
}) => {
  const handleSeatClick = (seat: any) => {
    onSeatSelect(seat);
  };

  return (
    <Layer>
      {seatingPlan.zones.flatMap((zone) =>
        zone.rows.map((row) => {
          const minX = Math.min(...row.seats.map((s) => s.position.x));
          const maxX = Math.max(...row.seats.map((s) => s.position.x));
          const minY = Math.min(...row.seats.map((s) => s.position.y));
          const maxY = Math.max(...row.seats.map((s) => s.position.y));
          const width = maxX - minX;
          const height = maxY - minY;

          return (
            <Group key={row.uuid}>
              {/* Row Labels */}
              {row.seats.length > 0 && (
                <>
                  {(() => {
                    const firstSeat = row.seats[0];
                    const lastSeat = row.seats[row.seats.length - 1];
                    const angle =
                      Math.atan2(
                        lastSeat.position.y - firstSeat.position.y,
                        lastSeat.position.x - firstSeat.position.x,
                      ) *
                      (180 / Math.PI);

                    return (
                      <>
                        <Text
                          x={firstSeat.position.x - 30}
                          y={firstSeat.position.y}
                          text={row.rowNumber.toString()}
                          fontSize={14}
                          fill="white"
                          rotation={angle}
                          align="center"
                          verticalAlign="middle"
                        />
                        <Text
                          x={lastSeat.position.x + 30}
                          y={lastSeat.position.y}
                          text={row.rowNumber.toString()}
                          fontSize={14}
                          fill="white"
                          rotation={angle}
                          align="center"
                          verticalAlign="middle"
                        />
                      </>
                    );
                  })()}
                </>
              )}

              {row.seats.map((seat) => {
                const isSelected = selectedSeats.some(
                  (s) => s.uuid === seat.uuid,
                );
                const isAvailable = availableSeats.has(seat.uuid);

                return (
                  <React.Fragment key={seat.uuid}>
                    <Circle
                      x={seat.position.x}
                      y={seat.position.y}
                      radius={seat.radius || CONSTANTS.SEAT.RADIUS}
                      {...getSeatStyles(seat, isSelected, isAvailable)}
                      onClick={() => handleSeatClick(seat)}
                      onTap={() => handleSeatClick(seat)}
                      // listening={isAvailable}
                      opacity={isAvailable ? 1 : 0.5}
                    />
                  </React.Fragment>
                );
              })}
            </Group>
          );
        }),
      )}
    </Layer>
  );
};

RowLayer.displayName = 'RowLayer';
