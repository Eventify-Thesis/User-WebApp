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