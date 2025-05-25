import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import CategoryCard from "./CategoryCard/CategoryCard";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import dalat from '@/assets/images/searchBarLocation/dalat.jpg';
import hanoi from '@/assets/images/searchBarLocation/hanoi.jpg';
import hcm from '@/assets/images/searchBarLocation/hcm.jpg';
import otherLocation from '@/assets/images/searchBarLocation/otherLocation.jpg';
import music from '@/assets/images/category/music.jpg';
import art from '@/assets/images/category/art.jpg';
import sport from '@/assets/images/category/sport.jpg';
import otherCategory from '@/assets/images/category/otherCategory.jpg';
const { TabPane } = Tabs;

const CategoryGrid = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 10px;
`;

// Custom styled Tabs
const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    color: white;
  }

  .ant-tabs-tab {
    color: white !important;
    font-weight: bold;
  }

  /* Ensures selected tab text remains white */
  .ant-tabs-tab.ant-tabs-tab-active,
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: white !important;
  }

  /* Prevents blue color when clicking a tab */
  .ant-tabs-tab .ant-tabs-tab-btn:focus,
  .ant-tabs-tab .ant-tabs-tab-btn:hover {
    color: white !important;
  }

  /* Changes the active tab's underline to green */
  .ant-tabs-ink-bar {
    background-color: #27ae60 !important;
  }
`;


export const CategoryTabs: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
const categories = [
  { title: t('searchBar.music') , type:"music", image: music },
  { title: t('searchBar.theaterArts'),type:"art", image: art },
  { title: t('searchBar.sports'), type:"sport", image: sport },
  { title: t('searchBar.others'),type:"", image: otherCategory },
];

const locations = [
  { title: t('searchBar.hcm'),type:"ho chi minh", image: hcm },
  { title: t('searchBar.hanoi'),type:"ha noi", image: hanoi },
  { title: t('searchBar.dalat'),type:"da lat", image: dalat },
  { title: t('searchBar.otherLocations'),type:"", image: otherLocation },
];
  return (
    <StyledTabs defaultActiveKey="1">
      <TabPane tab={t('searchBar.browseByCategory')} key="1">
        <CategoryGrid>
          {categories.map((item) => (
            <CategoryCard key={item.title} title={item.title} image={item.image} 
            onClick={() => navigate(`/search-result?categories=${encodeURIComponent(item.type.trim())}`)} />
          ))}
        </CategoryGrid>
      </TabPane>
      <TabPane tab={t('searchBar.browseByLocation')}  key="2">
        <CategoryGrid>
          {locations.map((item) => (
            <CategoryCard key={item.title} title={item.title} image={item.image} 
            onClick={() => navigate(`/search-result?city=${encodeURIComponent(item.type.trim())}`)} />
          ))}
        </CategoryGrid>
      </TabPane>
    </StyledTabs>
  )
};