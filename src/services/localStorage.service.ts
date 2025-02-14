const avatarImg = process.env.REACT_APP_ASSETS_BUCKET + '/avatars/avatar5.webp';

import Cookies from 'js-cookie';

export const persistToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const readToken = (): string | null => {
  console.log('Cookies.get(access_token)', Cookies.get('access_token'));
  return Cookies.get('access_token') || null;
};

// export const persistUser = (user: UserModel): void => {
//   localStorage.setItem('user', JSON.stringify(user));
// };

// export const readUser = (): UserModel | null => {
//   const userStr = localStorage.getItem('user');
//   return userStr ? JSON.parse(userStr) : testUser;
// };

export const deleteToken = (): void => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};
export const deleteUser = (): void => localStorage.removeItem('user');
