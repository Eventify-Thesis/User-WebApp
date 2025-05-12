import React, { useState } from "react";
import { HeaderSearch } from "../components/HeaderSearch/HeaderSearch";
import { SettingsDropdown } from "../components/settingsDropdown/SettingsDropdown";
import * as S from "../Header.styles";
import { UserButton } from '@clerk/clerk-react';
import { Logo } from '../components/Logo/Logo';
import { Box, Flex, Drawer } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import './MobileHeader.css';

export const MobileHeader: React.FC = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCreateEventClick = () => {
    window.location.href = `${import.meta.env.VITE_PLANNER_BASE_URL}/create-event`;
    setDrawerOpen(false);
  };

  const handleNavItemClick = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <Box className="mobile-header-container">
        <Flex className="mobile-header-content" align="center" justify="space-between">
          {/* Left side - Logo and Search */}
          <Flex className="header-left-side" align="center" gap="md">
            <Box className="logo-container" onClick={handleLogoClick}>
              <Logo />
            </Box>
            <Box className="search-container">
              <HeaderSearch />
            </Box>
          </Flex>

          {/* Right side - User controls */}
          <Flex className="header-right-side" align="center" gap="sm">
            <Box className="user-button">
              <UserButton />
            </Box>
            <Box className="settings-dropdown">
              <SettingsDropdown />
            </Box>
            <Box className="menu-burger">
              <S.MobileBurger onClick={() => setDrawerOpen(true)} isCross={isDrawerOpen} />
            </Box>
          </Flex>
        </Flex>
      </Box>

      <Drawer
        opened={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
        size="xs"
        title="Menu"
        classNames={{
          root: 'mobile-drawer-root',
          header: 'mobile-drawer-header',
          title: 'mobile-drawer-title',
          body: 'mobile-drawer-body',
          close: 'mobile-drawer-close'
        }}
      >
        <Box className="drawer-content">
          <Box className="drawer-nav-item" onClick={() => handleNavItemClick('/tickets')}>
            <S.NavIcon icon="ion:ticket-outline" />
            <span>Tickets</span>
          </Box>
          <Box className="drawer-nav-item" onClick={() => handleNavItemClick('/interested')}>
            <S.NavIcon icon="teenyicons:star-outline" />
            <span>Interested</span>
          </Box>
          <Box className="drawer-create-event" onClick={handleCreateEventClick}>
            <S.CEButton />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};