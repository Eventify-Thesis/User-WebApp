import React, { memo } from 'react';
import { Layer, Group, Rect, Text, Circle } from 'react-konva';
import { SeatingPlan, Selection, EditorTool } from '../../../types/index';
import { getSeatStyles } from '../utils/styleUtils';
import { CONSTANTS } from '../constants';

interface RowLayerProps {
  seatingPlan: SeatingPlan;
  selection: Selection;
  currentTool: EditorTool;
  onSelect: (type: 'row' | 'seat', id: string, event?: any) => void;
  onDragStart: (id: string, type: 'row' | 'seat') => void;
  onDragEnd: (e: any, type: 'row' | 'seat') => void;
  onSeatDoubleClick: () => void;
}

export const RowLayer = memo(
  ({
    seatingPlan,
    selection,
    currentTool,
    onSelect,
    onDragStart,
    onDragEnd,
    onSeatDoubleClick,
  }: RowLayerProps) => {
    return (
      <Layer>
        {seatingPlan.zones.flatMap((zone) =>
          zone.rows.map((row) => {
            const isSelected = selection.selectedItems.rows.includes(row.uuid);
            const minX = Math.min(...row.seats.map((s) => s.position.x));
            const maxX = Math.max(...row.seats.map((s) => s.position.x));
            const minY = Math.min(...row.seats.map((s) => s.position.y));
            const maxY = Math.max(...row.seats.map((s) => s.position.y));
            const width = maxX - minX;
            const height = maxY - minY;

            return (
              <Group key={row.uuid}>
                <Rect
                  x={minX - CONSTANTS.ROW.PADDING.x}
                  y={minY - CONSTANTS.ROW.PADDING.y}
                  width={width + 2 * CONSTANTS.ROW.PADDING.x}
                  height={height + 2 * CONSTANTS.ROW.PADDING.y}
                  fill={isSelected ? 'rgba(100, 150, 255, 0.1)' : 'transparent'}
                  stroke={isSelected ? '#4444ff' : 'transparent'}
                  strokeWidth={2}
                  onClick={(e) => onSelect('row', row.uuid, e)}
                  onMouseEnter={(e) => {
                    if (currentTool === EditorTool.SELECT_ROW) {
                      e.target.getStage()!.container().style.cursor = 'pointer';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.getStage()!.container().style.cursor = 'default';
                  }}
                  draggable={currentTool === EditorTool.SELECT_ROW}
                  onDragStart={() => onDragStart(row.uuid, 'row')}
                  onDragEnd={(e) => onDragEnd(e, 'row')}
                />

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
                            fill={isSelected ? '#4444ff' : '#666'}
                            rotation={angle}
                            align="center"
                            verticalAlign="middle"
                          />
                          <Text
                            x={lastSeat.position.x + 30}
                            y={lastSeat.position.y}
                            text={row.rowNumber.toString()}
                            fontSize={14}
                            fill={isSelected ? '#4444ff' : '#666'}
                            rotation={angle}
                            align="center"
                            verticalAlign="middle"
                          />
                        </>
                      );
                    })()}
                  </>
                )}

                {row.seats.map((seat) => (
                  <React.Fragment key={seat.uuid}>
                    <Circle
                      x={seat.position.x}
                      y={seat.position.y}
                      radius={seat.radius || CONSTANTS.SEAT.RADIUS}
                      {...getSeatStyles(
                        seat,
                        selection.selectedItems.seats.includes(seat.uuid) ||
                          isSelected,
                        isSelected,
                        seatingPlan.categories,
                      )}
                      draggable={currentTool === EditorTool.SELECT_SEAT}
                      onClick={(e) => onSelect('seat', seat.uuid, e)}
                      onDblClick={onSeatDoubleClick}
                      onMouseEnter={(e) => {
                        if (currentTool === EditorTool.SELECT_SEAT) {
                          e.target.getStage()!.container().style.cursor =
                            'pointer';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.getStage()!.container().style.cursor =
                          'default';
                      }}
                      onDragStart={() => onDragStart(seat.uuid, 'seat')}
                      onDragEnd={(e) => onDragEnd(e, 'seat')}
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
                  </React.Fragment>
                ))}
              </Group>
            );
          }),
        )}
      </Layer>
    );
  },
);

RowLayer.displayName = 'RowLayer';
