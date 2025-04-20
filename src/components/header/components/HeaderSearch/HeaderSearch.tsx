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
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(false);

  const {
    data: searchResults,
    isLoading,
    refetch,
  } = useSearchSemanticEvents(query, 4);

  const handleSearch = (text: string) => {
    setQuery(text);
    setTriggerSearch(true);
    if (text.trim()) {
      navigate(`/search-result?query=${encodeURIComponent(text.trim())}`);
    }
  };

  useEffect(() => {
    if (triggerSearch && query) {
      refetch();
      setTriggerSearch(false);
    }
  }, [triggerSearch, query, refetch]);

  // Close modal on route change
  useEffect(() => {
    setModalOpen(false);
  }, [pathname]);

  return (
    <>
      {mobileOnly && (
        <>
          <BaseButton
            type={isModalOpen ? 'link' : 'text'}
            icon={<S.SearchIcon onClick={() => setModalOpen(true)} />}
          />
          <S.SearchModal
            open={isModalOpen}
            footer={null}
            onCancel={() => setModalOpen(false)}
            destroyOnClose
            style={{ height: '100%' }}
          >
            <SearchDropdown
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              isModalOpen={isModalOpen}
              setModalOpen={setModalOpen}
            />
          </S.SearchModal>
        </>
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
