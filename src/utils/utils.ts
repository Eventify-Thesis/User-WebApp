import { NotificationType } from '@/components/common/BaseNotification/BaseNotification';
import { Priority } from '@//constants/enums/priorities';
import { CurrencyTypeEnum, Severity } from '@/interfaces/interfaces';
import { BaseBadgeProps } from '@/components/common/BaseBadge/BaseBadge';
import { currencies } from '@/constants/config/currencies';

export const camelize = (string: string): string => {
  return string
    .split(' ')
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1),
    )
    .join('');
};

export const getCurrencyPrice = (
  price: number | string,
  currency: CurrencyTypeEnum,
  isIcon = true,
): string => {
  const currencySymbol = currencies[currency][isIcon ? 'icon' : 'text'];

  return isIcon ? `${currencySymbol}${price}` : `${price} ${currencySymbol}`;
};

type MarkArea = {
  xAxis: number;
};

export const getMarkAreaData = (data: string[] | number[]): MarkArea[][] =>
  data.map((el, index) => [
    {
      xAxis: 2 * index,
    },
    {
      xAxis: 2 * index + 1,
    },
  ]);

export const capitalize = (word: string): string =>
  `${word[0].toUpperCase()}${word.slice(1)}`;

export const hexToRGB = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  return `${r}, ${g}, ${b}`;
};

export const getDifference = (
  value: number,
  prevValue: number,
): string | null =>
  prevValue !== 0
    ? `${((Math.abs(value - prevValue) / prevValue) * 100).toFixed(0)}%`
    : '100%';

export const normalizeProp = (
  prop: string | number | [number, number],
): string =>
  typeof prop === 'number'
    ? `${prop}px`
    : (Array.isArray(prop) && `${prop[0]}px ${prop[1]}px`) || prop.toString();

export const defineColorByPriority = (priority: Priority): string => {
  switch (priority) {
    case Priority.INFO:
      return 'var(--primary-color)';
    case Priority.LOW:
      return 'var(--success-color)';
    case Priority.MEDIUM:
      return 'var(--warning-color)';
    case Priority.HIGH:
      return 'var(--error-color)';
    default:
      return 'var(--success-color)';
  }
};

export const defineColorBySeverity = (
  severity: NotificationType | undefined,
  rgb = false,
): string => {
  const postfix = rgb ? 'rgb-color' : 'color';
  switch (severity) {
    case 'error':
    case 'warning':
    case 'success':
      return `var(--${severity}-${postfix})`;
    case 'info':
    default:
      return `var(--primary-${postfix})`;
  }
};

export const mergeBy = (a: any[], b: any[], key: string): any[] =>
  a
    .filter((elem) => !b.find((subElem) => subElem[key] === elem[key]))
    .concat(b);

export const getSmoothRandom = (factor: number, start: number): number => {
  const halfEnvelope = 1 / factor / 2;
  const max = Math.min(1, start + halfEnvelope);
  const min = Math.max(0, start - halfEnvelope);

  return Math.random() * (max - min) + min;
};

export const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt(((R * (100 + percent)) / 100).toString());
  G = parseInt(((G * (100 + percent)) / 100).toString());
  B = parseInt(((B * (100 + percent)) / 100).toString());

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
};

export const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    (r /= 255), (g /= 255), (b /= 255);
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }
    return {
      h,
      s,
      l,
    };
  } else {
    throw new Error('Non valid HEX color');
  }
};

export const formatNumberWithCommas = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export const msToH = (ms: number): number => Math.floor(ms / 3600000);

export const hToMS = (h: number): number => h * 3600000;

export const mapBadgeStatus = (status: BaseBadgeProps['status']): Severity => {
  if (!status || status === 'default' || status === 'processing') {
    return 'info';
  }

  return status;
};

export const formatDate = (date: Date | string, region = 'en-US'): string => {
  return new Date(date).toLocaleDateString(region, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const calculateDateDifference = (dateString: string): string => {
  const inputDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - inputDate.getTime();

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'today';
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays === -1) return 'tomorrow';
  if (diffInDays > 1 && diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays > -7 && diffInDays < -1) return `in ${-diffInDays} days`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks === 1) return '1 week ago';
  if (diffInWeeks > 1) return `${diffInWeeks} weeks ago`;
  if (diffInWeeks === -1) return 'in 1 week';
  if (diffInWeeks < -1) return `in ${-diffInWeeks} weeks`;

  const diffInMonths = Math.floor(diffInDays / 30.44); // Average days in a month
  if (diffInMonths === 1) return '1 month ago';
  if (diffInMonths > 1) return `${diffInMonths} months ago`;
  if (diffInMonths === -1) return 'in 1 month';
  if (diffInMonths < -1) return `in ${-diffInMonths} months`;

  const diffInYears = Math.floor(diffInDays / 365.25); // Average days in a year
  if (diffInYears === 1) return '1 year ago';
  if (diffInYears > 1) return `${diffInYears} years ago`;
  if (diffInYears === -1) return 'in 1 year';
  if (diffInYears < -1) return `in ${-diffInYears} years`;
};

export const formatOptionString = (inputString: string): string => {
  // 1. Split into words based on underscores
  const words = inputString.toLowerCase().split('_');

  // 2. Capitalize the first letter of each word
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  // 3. Join the words with spaces
  const formattedString = capitalizedWords.join(' ');

  return formattedString;
};

/**
 * Converts a string to a URL-friendly slug:
 * - Converts to lowercase
 * - Removes accents (Vietnamese and other Unicode)
 * - Replaces non-alphanumeric characters with dashes
 * - Trims leading/trailing dashes
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD') // split accented characters into base + diacritics
    .replace(/\p{Diacritic}/gu, '') // remove diacritics
    .replace(/[^\p{L}\p{N}]+/gu, '-') // replace non-letter/number with dash
    .replace(/^-+|-+$/g, '') // trim leading/trailing dashes
    .toLowerCase();
}
