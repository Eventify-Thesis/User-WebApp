import { CONSTANTS } from '../constants';
import { Category } from '../../../types';

export const getShapeStyles = (item: any, isSelected: boolean) => {
  return {
    fill: item.fill
      ? item.fill
      : isSelected
      ? CONSTANTS.STYLE.SELECTED.FILL
      : CONSTANTS.STYLE.DEFAULT.FILL,
    stroke: item.stroke
      ? item.stroke
      : isSelected
      ? CONSTANTS.STYLE.SELECTED.STROKE
      : item.stroke || CONSTANTS.STYLE.DEFAULT.STROKE,
    strokeWidth: isSelected ? 2 : 1,
  };
};

export const getSectionStyles = (
  item: any,
  isSelected: boolean,
  categories: Category[],
) => {
  let fillColor = CONSTANTS.STYLE.DEFAULT.FILL;
  let strokeColor = CONSTANTS.STYLE.DEFAULT.STROKE;
  let strokeWidth = item.strokeWidth || 1;

  const baseFill = isSelected
    ? CONSTANTS.STYLE.SELECTED.FILL
    : CONSTANTS.STYLE.DEFAULT.FILL;
  const baseStroke = isSelected
    ? CONSTANTS.STYLE.SELECTED.STROKE
    : CONSTANTS.STYLE.DEFAULT.STROKE;
  const baseStrokeWidth = isSelected
    ? item.strokeWidth * 2 || 2
    : item.strokeWidth || 1;

  // Apply category color if exists
  const category = item.category
    ? categories.find((c) => c.name === item.category)
    : null;
  const categoryColor = category?.color;

  // Determine final values
  fillColor = categoryColor || item.fill || baseFill;
  strokeColor = item.stroke || baseStroke;
  strokeWidth = baseStrokeWidth;

  return {
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
  };
};

export const getSeatStyles = (
  seat: any,
  isSelected: boolean,
  isAvailable: boolean,
) => {
  let fillColor = CONSTANTS.STYLE.DEFAULT.FILL;
  let strokeColor = CONSTANTS.STYLE.DEFAULT.STROKE;

  if (!isAvailable) {
    fillColor = CONSTANTS.STYLE.UNAVAILABLE.FILL;
    strokeColor = CONSTANTS.STYLE.UNAVAILABLE.STROKE;
  } else if (isSelected) {
    fillColor = CONSTANTS.STYLE.SELECTED.FILL;
    strokeColor = CONSTANTS.STYLE.SELECTED.STROKE;
  }

  return {
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: 2,
  };
};
