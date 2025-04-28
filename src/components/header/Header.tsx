import React from 'react';
import { DesktopHeader } from './layouts/DesktopHeader';
import { MobileHeader } from './layouts/MobileHeader';
import { useResponsive } from '@/hooks/useResponsive';

export const Header: React.FC = () => {
  const { isTablet } = useResponsive();

  return isTablet ? <DesktopHeader /> : <MobileHeader />;
};
