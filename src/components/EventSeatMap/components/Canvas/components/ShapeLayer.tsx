import { memo } from 'react';
import { Layer, Text, Rect, Circle, Ellipse, Line, Group } from 'react-konva';
import { SeatingPlan, Shape, Point } from '../../../types/index';
import { getShapeStyles } from '../utils/styleUtils';

interface ShapeLayerProps {
  seatingPlan: SeatingPlan;
}

interface ShapeTextProps {
  text: {
    text: string;
    position?: Point;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    align?: string;
    verticalAlign?: string;
  };
  shape: Shape;
}

const ShapeText = memo(({ text, shape }: ShapeTextProps) => {
  if (!text?.text) return null;

  let centerX = shape.position.x;
  let centerY = shape.position.y;

  // Calculate center based on shape type
  switch (shape.type) {
    case 'rectangle':
      centerX += (shape.size?.width || 0) / 2;
      centerY += (shape.size?.height || 0) / 2;
      break;
    case 'circle':
      centerX = shape.position.x;
      centerY = shape.position.y;
      break;
    case 'ellipse':
      centerX = shape.position.x;
      centerY = shape.position.y;
      break;
    case 'polygon':
      if (shape.points && shape.points.length > 0) {
        // Calculate centroid for polygon
        const points = shape.points;
        let sumX = 0;
        let sumY = 0;
        points.forEach((point) => {
          sumX += point.x;
          sumY += point.y;
        });
        centerX = sumX / points.length;
        centerY = sumY / points.length;
      }
      break;
  }

  // Use provided position or fallback to shape center
  const x = text.position?.x ?? centerX;
  const y = text.position?.y ?? centerY;

  return (
    <Text
      x={x}
      y={y}
      text={text.text}
      fill={text.color || '#000000'}
      fontSize={text.fontSize || 14}
      fontFamily={text.fontFamily || 'Arial'}
      align={text.align || 'center'}
      verticalAlign={text.verticalAlign || 'middle'}
      offsetX={
        text.align === 'left'
          ? 0
          : text.align === 'right'
          ? text.text.length * 7
          : text.text.length * 3.5
      }
      offsetY={
        text.verticalAlign === 'top'
          ? 0
          : text.verticalAlign === 'bottom'
          ? 14
          : 7
      }
      onDragMove={(e) => {
        // Update text position when dragged
        const position = {
          x: e.target.x(),
          y: e.target.y(),
        };
        text.position = position;
      }}
    />
  );
});

export const ShapeLayer = memo(({ seatingPlan }: ShapeLayerProps) => {
  return (
    <>
      {seatingPlan.zones.flatMap((zone) =>
        zone.areas.map((area) => {
          const isSelected = false; // Not implementing selection in user app
          const shapeStyles = getShapeStyles(area, isSelected);
          // const isSelected = selection.selectedItems.areas.includes(area.uuid);
          // const commonProps = {
          //   draggable:
          //     currentTool === EditorTool.SELECT_ROW ||
          //     currentTool === EditorTool.SELECT_SHAPE,
          //   onClick: (e: any) => onSelect('shape', area.uuid, e),
          //   onDragStart: (e: any) => handleDragStart(e, area.uuid),
          //   onDragMove: (e: any) => handleDragMove(e, area.uuid),
          //   onDragEnd: (e: any) => handleDragEnd(e, area.uuid),
          //   onMouseEnter: (e: any) => {
          //     if (
          //       currentTool === EditorTool.SELECT_ROW ||
          //       currentTool === EditorTool.SELECT_SHAPE
          //     ) {
          //       e.target.getStage()!.container().style.cursor = 'pointer';
          //     }
          //   },
          //   onMouseLeave: (e: any) => {
          //     e.target.getStage()!.container().style.cursor = 'default';
          //   },
          //   ...getShapeStyles(area, isSelected),
          // };

          switch (area.type) {
            case 'rectangle':
              return (
                <Group key={area.uuid} rotation={area.rotation}>
                  <Rect
                    id={area.uuid}
                    x={area.position.x}
                    y={area.position.y}
                    width={area.size?.width || 0}
                    height={area.size?.height || 0}
                    fill={shapeStyles.fill}
                    stroke={shapeStyles.stroke}
                    strokeWidth={shapeStyles.strokeWidth}
                  />
                  <ShapeText text={area.text} shape={area} />
                </Group>
              );
            case 'circle':
              return (
                <Group key={area.uuid} rotationDeg={area.rotation || 0}>
                  <Circle
                    id={area.uuid}
                    x={area.position.x}
                    y={area.position.y}
                    radius={area.radius || 15}
                    {...shapeStyles}
                  />
                  <ShapeText text={area.text} shape={area} />
                </Group>
              );
            case 'ellipse':
              return (
                <Group key={area.uuid} rotationDeg={area.rotation || 0}>
                  <Ellipse
                    id={area.uuid}
                    x={area.position.x}
                    y={area.position.y}
                    radiusX={area.size?.width ? area.size.width / 2 : 0}
                    radiusY={area.size?.height ? area.size.height / 2 : 0}
                    fill={shapeStyles.fill}
                    stroke={shapeStyles.stroke}
                    strokeWidth={shapeStyles.strokeWidth}
                  />
                  <ShapeText text={area.text} shape={area} />
                </Group>
              );
            case 'polygon':
              return (
                <Group key={area.uuid} rotationDeg={area.rotation || 0}>
                  <Line
                    id={area.uuid}
                    points={area.points ? area.points.flatMap(p => [p.x, p.y]) : []}
                    closed={true}
                    fill={shapeStyles.fill}
                    stroke={shapeStyles.stroke}
                    strokeWidth={shapeStyles.strokeWidth}
                  />
                  <ShapeText text={area.text} shape={area} />
                </Group>
              );
            case 'text':
              return (
                <Group key={area.uuid} rotationDeg={area.rotation || 0}>
                  <Text
                    key={area.uuid}
                    id={area.uuid}
                    x={area.position.x}
                    y={area.position.y}
                    text={area.text.text || ''}
                    fontSize={area.fontSize || 16}
                    fontFamily={area.fontFamily || 'Arial'}
                    fill={area.fill || shapeStyles.fill}
                  />
                </Group>
              );
            default:
              return null;
          }
        }),
      )}
    </>
  );
});

ShapeLayer.displayName = 'ShapeLayer';
