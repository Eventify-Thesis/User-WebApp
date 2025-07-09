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
  categories: Category[] = [],
) => {
  let fillColor = CONSTANTS.STYLE.DEFAULT.FILL;
  let strokeColor = CONSTANTS.STYLE.DEFAULT.STROKE;
  let strokeWidth = 2;

  // Apply category color if seat has a category
  const category = seat.category
    ? categories.find((c) => c.name === seat.category)
    : null;
  const categoryColor = category?.color;

  if (!isAvailable) {
    // Booked/unavailable seats - use the booked style for better visual distinction
    fillColor = CONSTANTS.STYLE.BOOKED.FILL;
    strokeColor = CONSTANTS.STYLE.BOOKED.STROKE;
    strokeWidth = 3;
  } else if (isSelected) {
    // Selected seats
    fillColor = CONSTANTS.STYLE.SELECTED.FILL;
    strokeColor = CONSTANTS.STYLE.SELECTED.STROKE;
    strokeWidth = 3;
  } else if (categoryColor) {
    // Available seats with category color
    fillColor = categoryColor;
    strokeColor = categoryColor;
    strokeWidth = 2;
  } else {
    // Default available seats
    fillColor = CONSTANTS.STYLE.DEFAULT.FILL;
    strokeColor = CONSTANTS.STYLE.DEFAULT.STROKE;
    strokeWidth = 2;
  }

  return {
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokeWidth,
  };
};
