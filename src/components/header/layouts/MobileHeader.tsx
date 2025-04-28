import React from "react";
import { NotificationsDropdown } from "../components/notificationsDropdown/NotificationsDropdown";
import { ProfileDropdown } from "../components/profileDropdown/ProfileDropdown/ProfileDropdown";
import { HeaderSearch } from "../components/HeaderSearch/HeaderSearch";
import { SettingsDropdown } from "../components/settingsDropdown/SettingsDropdown";
import * as S from "../Header.styles";
import { BaseRow } from "@/components/common/BaseRow/BaseRow";
import { BaseCol } from "@/components/common/BaseCol/BaseCol";
import { UserButton } from '@clerk/clerk-react';
import { Logo } from '../components/Logo/Logo';
import { useState } from "react";

export const MobileHeader: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <BaseRow align="middle" style={{ width: '100%', padding: '0 12px' }}>
        {/* Left side - Logo and Search */}
        <BaseCol style={{ display: 'flex', alignItems: 'center' }}>
          <Logo style={{ marginRight: 16 }} />
          <HeaderSearch />
        </BaseCol>

        {/* Right side - User controls */}
        <BaseCol style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserButton />
          <SettingsDropdown />
          <S.MobileBurger onClick={() => setDrawerOpen(true)} isCross={isDrawerOpen} />
        </BaseCol>
      </BaseRow>

      <S.StyledDrawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={isDrawerOpen}
        width={280}
      >
        <S.NavItem onClick={() => window.location.href = '/tickets'}>
          <S.NavIcon icon="ion:ticket-outline" />
          Tickets
        </S.NavItem>
        <S.NavItem onClick={() => window.location.href = '/interested'}>
          <S.NavIcon icon="teenyicons:star-outline" />
          Interested
        </S.NavItem>
        <S.CEButton />
      </S.StyledDrawer>
    </>
  );
};