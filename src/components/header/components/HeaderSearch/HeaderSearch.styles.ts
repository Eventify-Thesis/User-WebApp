import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';
import { BaseModal } from '@/components/common/BaseModal/BaseModal';
import { BaseButton } from '@/components/common/BaseButton/BaseButton';
import { SearchInput } from '@/components/common/inputs/SearchInput/SearchInput';
import { BORDER_RADIUS, media } from '@/styles/themes/constants';

export const SearchIcon = styled(SearchOutlined)`
  &.anticon.anticon-search {
    display: block;
    font-size: 1.25rem;
    color: white; // Default color

    @media only screen and ${media.md} {
      font-size: 1.625rem;
      color: inherit;
    }

    @media (max-width: 1020px) {
      font-size: 1rem; /* Shrink icon on smaller screens */
    }
  }
`;

export const InputSearch = styled(SearchInput)`
  .ant-input-group-addon {
    display: none;
  }

    border-radius: 0.25rem !important;


  @media only screen and ${media.md} {
    .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
      border: 0;
      border-radius: 0.25rem !important;
      padding: 0.5625rem 1.25rem;
    }

    .ant-input-affix-wrapper {
      font-size: 1rem;
    }
  }

  /* Add shrinking effect for screens below 1020px */
  @media (max-width: 1020px) {
    .ant-input-group .ant-input-affix-wrapper:not(:last-child) {
      padding: 0.4rem 0.5rem; /* Reduce padding */
      font-size: 0.875rem; /* Decrease font size */
    }

    .ant-input-affix-wrapper {
      font-size: 0.875rem; /* Smaller font */
    }
  }
`;

export const SearchModal = styled(BaseModal)`
  border-radius: ${BORDER_RADIUS};

  & .ant-modal-body {
    padding: 0;
  }
`;

export const Btn = styled(BaseButton)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
