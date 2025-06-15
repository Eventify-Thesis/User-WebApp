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
  const { pathname } = useLocation();
  const [query, setQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSearch = (text: string) => {
    setQuery(text);
    navigate(`/search-result?query=${encodeURIComponent(text.trim())}`);
  };
  useEffect(() => {
    setModalOpen(false);
  }, [pathname]);

  return (
    <>
      {mobileOnly && (
        <BaseButton
          type="text"
          icon={<S.SearchIcon onClick={() => handleSearch(query)} />}
        />
      )}

      {isTablet && (
        <SearchDropdown
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
        />
      )}
    </>
  );
};
