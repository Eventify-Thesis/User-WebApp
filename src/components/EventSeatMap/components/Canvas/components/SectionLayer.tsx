import React, { memo } from 'react';
import { Group, Rect, Circle, Line, Text, Layer, Ellipse } from 'react-konva';
import {
  SeatingPlan,
  Selection,
  EditorTool,
  Point,
  Section,
} from '../../../types/index';
import { getMousePosition } from '../utils/mouseUtils';
import { getSectionStyles } from '../utils/styleUtils';

export interface SectionLayerProps {
  seatingPlan: SeatingPlan;
  onSelectSection: (section: any) => void;
}

interface SectionTextProps {
  text: {
    text: string;
    position?: Point;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    align?: string;
    verticalAlign?: string;
  };
  section: Section;
}

const SectionText = memo(({ text, section }: SectionTextProps) => {
  if (!text?.text) return null;

  let centerX = section.position.x;
  let centerY = section.position.y;

  // Calculate center based on shape type
  switch (section.type) {
    case 'rectangle':
      centerX += (section.size?.width || 0) / 2;
      centerY += (section.size?.height || 0) / 2;
      break;
    case 'circle':
      centerX = section.position.x;
      centerY = section.position.y;
      break;
    case 'ellipse':
      centerX = section.position.x;
      centerY = section.position.y;
      break;
    case 'polygon':
      if (section.points && section.points.length > 0) {
        // Calculate centroid for polygon
        const points = section.points;
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
        const stage = e.target.getStage();
        const position = {
          x: e.target.x(),
          y: e.target.y(),
        };
        text.position = position;
      }}
    />
  );
});

export const SectionLayer = memo(
  ({ seatingPlan, onSelectSection }: SectionLayerProps) => {
    return (
      <Layer>
        {seatingPlan.zones.flatMap((zone) =>
          zone.sections.map((section) => {
            const commonProps = {
              onClick: (e: any) => onSelectSection(section),

              ...getSectionStyles(section, false, seatingPlan.categories),
            };

            // Render based on section type
            switch (section.type) {
              case 'rectangle':
                return (
                  <Group key={section.uuid}>
                    <Rect
                      width={section.size.width}
                      height={section.size.height}
                      cornerRadius={section.cornerRadius || 4}
                      x={section.position.x}
                      y={section.position.y}
                      {...commonProps}
                    />
                    <SectionText text={section.text} section={section} />
                  </Group>
                );

              case 'circle':
                return (
                  <Group key={section.uuid}>
                    <Circle
                      {...commonProps}
                      id={section.uuid}
                      x={section.position.x}
                      y={section.position.y}
                      radius={section.radius || 0}
                    />
                    <SectionText text={section.text} section={section} />
                  </Group>
                );
              case 'ellipse':
                return (
                  <Group key={section.uuid}>
                    <Ellipse
                      {...commonProps}
                      id={section.uuid}
                      x={section.position.x}
                      y={section.position.y}
                      radiusX={section.size?.width ? section.size.width / 2 : 0}
                      radiusY={
                        section.size?.height ? section.size.height / 2 : 0
                      }
                    />
                    <SectionText text={section.text} section={section} />
                  </Group>
                );

              case 'polygon':
                if (!section.points || section.points.length < 3) return null;
                const flatPoints = section.points.flatMap((p: Point) => [
                  p.x - (section.position?.x || 0),
                  p.y - (section.position?.y || 0),
                ]);
                return (
                  <Group key={section.uuid}>
                    <Line {...commonProps} points={flatPoints} closed={true} />
                    {section.label && (
                      <Text
                        x={10}
                        y={10}
                        text={section.label}
                        fontSize={section.textSize || 16}
                        fill={section.textColor || '#333333'}
                        fontStyle="bold"
                      />
                    )}
                  </Group>
                );

              default:
                return null;
            }
          }),
        )}
      </Layer>
    );
  },
);

SectionLayer.displayName = 'SectionLayer';
