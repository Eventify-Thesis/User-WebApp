import React from 'react';
import { Layer, Circle, Text, Group, Line } from 'react-konva';
import { getSeatStyles } from '../utils/styleUtils';
import { CONSTANTS } from '../constants';
import { Seat, Zone, Row } from '../../../types';

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
    // Only allow selection of available seats
    if (availableSeats.has(seat.uuid)) {
      onSeatSelect(seat);
    }
  };

  const renderSeatWithIndicator = (
    seat: any,
    isSelected: boolean,
    isAvailable: boolean,
  ) => {
    const seatStyles = getSeatStyles(
      seat,
      isSelected,
      isAvailable,
      seatingPlan.categories || [],
    );
    const radius = seat.radius || CONSTANTS.SEAT.RADIUS;

    return (
      <Group key={seat.uuid}>
        {/* Main seat circle */}
        <Circle
          x={seat.position.x}
          y={seat.position.y}
          radius={radius}
          {...seatStyles}
          onClick={() => handleSeatClick(seat)}
          onTap={() => handleSeatClick(seat)}
          opacity={isAvailable ? 1 : 0.7}
          listening={isAvailable}
        />

        {/* Seat number text */}
        <Text
          x={seat.position.x}
          y={seat.position.y}
          text={seat.number}
          fontSize={10}
          fill={isAvailable ? '#333' : '#666'}
          align="center"
          verticalAlign="middle"
          offsetX={5}
          offsetY={5}
          listening={false}
        />

        {/* X mark for booked/unavailable seats */}
        {!isAvailable && (
          <Group>
            <Line
              points={[
                seat.position.x - radius * 0.5,
                seat.position.y - radius * 0.5,
                seat.position.x + radius * 0.5,
                seat.position.y + radius * 0.5,
              ]}
              stroke="#FFFFFF"
              strokeWidth={3}
              lineCap="round"
              listening={false}
            />
            <Line
              points={[
                seat.position.x + radius * 0.5,
                seat.position.y - radius * 0.5,
                seat.position.x - radius * 0.5,
                seat.position.y + radius * 0.5,
              ]}
              stroke="#FFFFFF"
              strokeWidth={3}
              lineCap="round"
              listening={false}
            />
          </Group>
        )}
      </Group>
    );
  };

  return (
    <Layer>
      {seatingPlan.zones.flatMap((zone: Zone) =>
        zone.rows.map((row: Row) => {
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
                          listening={false}
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
                          listening={false}
                        />
                      </>
                    );
                  })()}
                </>
              )}

              {/* Render seats with enhanced styling and indicators */}
              {row.seats.map((seat: Seat) => {
                const isSelected = selectedSeats.some(
                  (s) => s.uuid === seat.uuid,
                );
                const isAvailable = availableSeats.has(seat.uuid);

                return renderSeatWithIndicator(seat, isSelected, isAvailable);
              })}
            </Group>
          );
        }),
      )}
    </Layer>
  );
};

RowLayer.displayName = 'RowLayer';
