import React from 'react';
import * as S from './SeeMoreButton.styles';

interface ViewAllProps{
  buttonName: string;
}

export const SeeMoreButton: React.FC<ViewAllProps> = ({ buttonName }) => {
  return (
    <S.SeeMoreButton>{buttonName}</S.SeeMoreButton>
  );
};
