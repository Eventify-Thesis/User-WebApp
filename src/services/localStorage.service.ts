import Cookies from 'js-cookie';

export const persistToken = (token: string): void => {
  Cookies.set('__session', token);
};

export const readToken = (): string | null => {
  return Cookies.get('__session') || null;
};

export const deleteToken = (): void => {
  Cookies.remove('__session');
};

export const saveBookingCode = (showId: number | string, code: string): void => {
  localStorage.setItem(`bookingCode_${showId}`, code);
};

export const getBookingCode = (showId: number | string): string | null => {
  return localStorage.getItem(`bookingCode_${showId}`);
};

export const removeBookingCode = (showId: number | string): void => {
  localStorage.removeItem(`bookingCode_${showId}`);
};
