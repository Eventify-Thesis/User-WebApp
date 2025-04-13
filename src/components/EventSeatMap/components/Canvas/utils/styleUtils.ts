import { CONSTANTS } from '../constants';
import { Seat, Category } from '../../../types';

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

export const getSeatStyles = (
  seat: any,
  isSelected: boolean,
  isAvailable: boolean,
) => {
  let fillColor = CONSTANTS.STYLE.DEFAULT.FILL;
  let strokeColor = CONSTANTS.STYLE.DEFAULT.STROKE;

  if (!isAvailable) {
    fillColor = 'black';
    strokeColor = 'black';
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
