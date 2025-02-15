import React, { useEffect, useState } from 'react';
import { Header } from '../../../header/Header';
import MainSider from '../sider/MainSider/MainSider';
import MainContent from '../MainContent/MainContent';
import { MainHeader } from '../MainHeader/MainHeader';
import * as S from './MainLayout.styles';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const toggleSider = () => setSiderCollapsed(!siderCollapsed);

  return (
    <S.LayoutMaster>
      <MainSider
        isCollapsed={siderCollapsed}
        setCollapsed={setSiderCollapsed}
      />
      <S.LayoutMain>
        <MainHeader>
          <Header toggleSider={toggleSider} isSiderOpened={!siderCollapsed} />
        </MainHeader>
        <MainContent id="main-content">
          <div>
            <Outlet />
            <h1>Content Hello chill guy</h1>
          </div>
        </MainContent>
      </S.LayoutMain>
    </S.LayoutMaster>
  );
};

export default MainLayout;
