import React from 'react';
import { Popover, Tabs } from 'antd';
import styled from 'styled-components';
import { TrendingSearches } from './TrendingSearched/TrendingSearched.tsx';
import { CategoryTabs } from './CategoryTabs/CategoryTabs.tsx';
import { SuggestedEvents } from './SuggestedEvents/SuggestedEvents.tsx';

const { TabPane } = Tabs;

const SearchPopoverWrapper = styled(Popover)`
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.6) !important;
  border-radius: 12px;

  .ant-popover-content {
    background: rgba(0, 0, 0, 0.6) !important;
    backdrop-filter: blur(10px);
    border-radius: 12px;
  }

  .ant-popover-inner {
    padding: 0px !important;
    background: rgba(0, 0, 0, 0.85) !important;
    border-radius: 12px;
    color: white;
  }
`;

const ContentStyle = styled.div`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  min-width: 320px;
  max-width: 900px;
  max-height: 700px; /* Limits the height */
  overflow-y: auto; /* Enables scrolling inside */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent; /* Custom scrollbar */
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
  }
`;

interface SearchPopoverProps {
  visible: boolean;
  onClose: () => void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({ visible, onClose }) => {
  return (
    <SearchPopoverWrapper
      getPopupContainer={(trigger) => trigger.parentElement || document.body}
      visible={visible}
      onVisibleChange={onClose}
      trigger="click"
      arrow={false}
      placement="bottomLeft"
      color="transparent"
      content={
        <ContentStyle>
          <TrendingSearches />
          <CategoryTabs />
          <SuggestedEvents />
        </ContentStyle>
      }
    />
  );
};

export default SearchPopover;
