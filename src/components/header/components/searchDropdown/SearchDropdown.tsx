import React, { useRef, useEffect, useState } from 'react';
import { FilterIcon } from '@/components/common/icons/FilterIcon';
import { HeaderActionWrapper } from '@/components/header/Header.styles';
import { Btn, InputSearch } from '../HeaderSearch/HeaderSearch.styles';
import { useTranslation } from 'react-i18next';
import SearchPopover from './SearchPopover/SearchPopover';
import { InputRef } from 'antd';

interface SearchDropdownProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
  isModalOpen?: boolean;
  setModalOpen?: (open: boolean) => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  query,
  setQuery,
  onSearch,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isModalOpen) {
      inputRef.current?.focus();
    }
  }, [isModalOpen]);

  return (
    <>
      <HeaderActionWrapper>
        <InputSearch
          ref={inputRef}
          width="100%"
          value={query}
          height="max-content"
          placeholder={t('header.search')}
          filter={
            <Btn
              size="small"
              type={isFilterOpen ? 'link' : 'text'}
              aria-label="Filter"
              icon={<FilterIcon />}
              onClick={() => setFilterOpen(!isFilterOpen)}
            />
          }
          onFocus={() => setModalOpen?.(true)} // ✅ Open modal, but input keeps focus
          onChange={(event) => setQuery(event.target.value)} // ✅ Allow typing
          enterButton={null}
          addonAfter={null}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSearch(query);
              setModalOpen?.(false);
            }
          }}
        />
      </HeaderActionWrapper>

      <SearchPopover
        visible={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default SearchDropdown;
