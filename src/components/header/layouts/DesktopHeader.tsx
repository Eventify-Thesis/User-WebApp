import React from 'react';
import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import * as S from '../Header.styles';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { BaseCol } from '@/components/common/BaseCol/BaseCol';
import logo from '@/assets/logo.png';
interface DesktopHeaderProps {}

export const Logo: React.FC = () => {
  return (
    <S.LogoWrapper>
      <S.LogoImage src={logo} alt="logo" />
    </S.LogoWrapper>
  );
};

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({}) => {
  const leftSide = (
    <S.SearchColumn xl={12} xxl={14}>
      <BaseRow justify="space-between">
        <BaseCol xl={9} xxl={12}>
          <Logo />
        </BaseCol>
        <BaseCol xl={15} xxl={12}>
          <HeaderSearch />
        </BaseCol>
      </BaseRow>
    </S.SearchColumn>
  );

  return (
    <BaseRow justify="space-between" align="middle">
      {leftSide}
      <BaseCol>
        <S.CEButton />
      </BaseCol>

      <S.ProfileColumn xl={8} xxl={7}>
        <BaseRow align="middle" justify="end" gutter={[4, 4]}>
          <S.NavRow gutter={[12, 0]} align="middle">
            <S.NavItem>
              <S.NavIcon icon="ion:ticket-outline" />
              Tickets
            </S.NavItem>
            <S.NavItem>
              <S.NavIcon icon="teenyicons:star-outline" />
              Interested
            </S.NavItem>
            <BaseCol>
              <ProfileDropdown />
            </BaseCol>
          </S.NavRow>
          <BaseCol>
            <BaseRow gutter={[{ xxl: 5 }, { xxl: 5 }]}>
              <BaseCol>
                <SettingsDropdown />
              </BaseCol>
            </BaseRow>
          </BaseCol>
        </BaseRow>
      </S.ProfileColumn>
    </BaseRow>
  );
};
