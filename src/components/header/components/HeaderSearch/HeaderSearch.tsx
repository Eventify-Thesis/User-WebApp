import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { SearchDropdown } from '../searchDropdown/SearchDropdown';
import { BaseButton } from '@/components/common/BaseButton/BaseButton';
import { useResponsive } from '@/hooks/useResponsive';
import { useSearchSemanticEvents } from '@/queries/useSearchSemanticEvents';
import { useNavigate } from 'react-router-dom';
import * as S from './HeaderSearch.styles';

export const HeaderSearch: React.FC = () => {
  const { mobileOnly, isTablet } = useResponsive();
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/search-result?query=');
  };

  return (
    <>
      {mobileOnly && (
        <BaseButton
          type="text"
          icon={<S.SearchIcon onClick={handleSearch} />}
        />
      )}

      {isTablet && (
        <SearchDropdown
          query=""
          setQuery={() => {}}
          onSearch={handleSearch}
        />
      )}
    </>
  );
};
