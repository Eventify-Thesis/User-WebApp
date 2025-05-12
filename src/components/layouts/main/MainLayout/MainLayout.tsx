import React, { useState } from 'react';
import { Header } from '../../../header/Header';
import { Outlet } from 'react-router-dom';
import { UnauthHeader } from '@/components/header/UnauthHeader';
import { useAuth } from '@clerk/clerk-react';
import { AppShell, Box } from '@mantine/core';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const toggleSider = () => setSiderCollapsed(!siderCollapsed);
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  return (
    <AppShell header={{ height: 70 }} padding={0} className="main-layout">
      <AppShell.Header className="main-header">
        {isSignedIn ? (
          <Header />
        ) : (
          <UnauthHeader
            isSiderOpened={!siderCollapsed}
            toggleSider={toggleSider}
          />
        )}
      </AppShell.Header>

      <AppShell.Main className="main-content">
        <Box className="content-container">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
