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
      <BaseRow justify="space-between" align="middle" style={{ height: "100%" }}>
        <BaseCol>
          <BaseRow align="middle">
            <BaseCol xl={9} xxl={12} style={{ display: 'flex', justifyContent: 'center' }}>
                      <Logo />
                    </BaseCol>
            <BaseCol>
              <HeaderSearch />
            </BaseCol>
          </BaseRow>
        </BaseCol>

        <S.BurgerCol>
          <S.MobileBurger onClick={() => setDrawerOpen(true)} isCross={isDrawerOpen} />
        </S.BurgerCol>

        <BaseRow>
          <BaseCol>
            <UserButton />
          </BaseCol>
          <BaseCol>
            <SettingsDropdown />
          </BaseCol>
        </BaseRow>
      </BaseRow>

      {/* Styled Hamburger Menu Expansion */}
      <S.StyledDrawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={isDrawerOpen}
      >
        <S.NavItem>
          <S.NavIcon icon="ion:ticket-outline" />
          Tickets
        </S.NavItem>
        <S.NavItem>
          <S.NavIcon icon="teenyicons:star-outline" />
          Interested
        </S.NavItem>
        <S.CEButton />
      </S.StyledDrawer>
    </>
  );
};