import React, { useEffect, useState } from 'react';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import * as S from '../Header.styles';
import { Logo } from '../components/Logo/Logo';
import { UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Flex, Tooltip } from '@mantine/core';
import './DesktopHeader.css';
interface DesktopHeaderProps {}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({}) => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1050);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1050);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCreateEventClick = () => {
    const plannerBaseUrl = import.meta.env.VITE_PLANNER_BASE_URL;

    if (!plannerBaseUrl) {
      console.error('VITE_PLANNER_BASE_URL is not configured');
      // Fallback: show an alert or handle the error gracefully
      alert('Event creation is currently unavailable. Please contact support.');
      return;
    }

    const targetUrl = `${plannerBaseUrl}/create-event`;

    // Open in new tab instead of redirecting current page
    try {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to navigate to create event page:', error);
      alert(
        'Failed to navigate to event creation. Please try again or contact support.',
      );
    }
  };

  const leftSide = (
    <Flex className="header-left-side" align="center">
      <Box className="logo-container" onClick={handleLogoClick}>
        <Logo />
      </Box>
      <Box className="search-container">
        <HeaderSearch />
      </Box>
    </Flex>
  );

  return (
    <Container fluid className="desktop-header-container">
      <Flex
        className="desktop-header-content"
        align="center"
        justify="space-between"
      >
        {leftSide}

        <Flex className="header-right-side" align="center" gap="md">
          <Box className="create-event-button" onClick={handleCreateEventClick}>
            <S.CEButton />
          </Box>

          <Flex className="nav-items" align="center" gap="md">
            <Tooltip label="Tickets" position="bottom" disabled={isLargeScreen}>
              <Box className="nav-item" onClick={() => navigate('/tickets')}>
                <S.NavIcon icon="ion:ticket-outline" />
                <span className="nav-text">Tickets</span>
              </Box>
            </Tooltip>

            <Tooltip
              label="Interested"
              position="bottom"
              disabled={isLargeScreen}
            >
              <Box className="nav-item" onClick={() => navigate('/interested')}>
                <S.NavIcon icon="teenyicons:star-outline" />
                <span className="nav-text">Interested</span>
              </Box>
            </Tooltip>

            <Box className="user-button">
              <UserButton showName={isLargeScreen} appearance={{}} />
            </Box>

            <Box className="settings-dropdown">
              <SettingsDropdown />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};
