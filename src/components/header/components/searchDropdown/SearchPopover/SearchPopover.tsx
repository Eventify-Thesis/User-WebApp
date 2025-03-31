import React from 'react';
import { TrendingSearches } from '../TrendingSearched/TrendingSearched.tsx';
import { CategoryTabs } from '../CategoryTabs/CategoryTabs.tsx';
import { SuggestedEvents } from '../SuggestedEvents/SuggestedEvents.tsx';
import * as s from './SearchPopover.styles';

interface SearchPopoverProps {
  visible: boolean;
  onClose: () => void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({ visible, onClose }) => {
  return (
    <s.SearchPopoverWrapper
      getPopupContainer={(trigger) => trigger.parentElement || document.body}
      visible={visible}
      onVisibleChange={onClose}
      trigger="click"
      arrow={false}
      placement="bottomLeft"
      color="transparent"
      content={
        <s.ContentStyle>
          <TrendingSearches />
          <CategoryTabs />
          <SuggestedEvents />
        </s.ContentStyle>
      }
    />
  );
};

export default SearchPopover;
