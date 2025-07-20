import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/hooks/reduxHooks';
import { BASE_COLORS } from '@/styles/themes/constants';
import { BaseButton as BaseButton } from '@/components/common/BaseButton/BaseButton';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

export const CreateEventButton: React.FC = (props) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const { t } = useTranslation();

  return (
    <Button
      type="default"
      icon={
        <Icon
          icon="mdi:event-add"
          width={'1.4rem'}
          style={{ verticalAlign: 'middle' }}
        />
      }
      target="_blank"
      $isDark={theme === 'dark'}
      {...props}
    >
      {t('header.createEvent')}
    </Button>
  );
};

const Button = styled(BaseButton)<{ $isDark: boolean }>`
  color: ${(props) => BASE_COLORS[props.$isDark ? 'white' : 'black']};
  background: ${(props) => BASE_COLORS[props.$isDark ? 'yellow' : 'yellow']};
  border-radius: 5px;
  padding-block: 0.5rem;
  height: max-content;
  display: flex;
  align-items: center;
  border: 1px solid transparent;

  & > * {
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
  }
  &:hover,
  &:active,
  &:focus {
    color: ${(props) => BASE_COLORS[props.$isDark ? 'black' : 'white']};
    background: ${(props) => BASE_COLORS[props.$isDark ? 'white' : 'black']};
  }
`;
