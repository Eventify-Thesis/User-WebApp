import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT, media } from '@/styles/themes/constants';
import { BaseInput } from '../BaseInput/BaseInput';
import { BaseSpace } from '../../BaseSpace/BaseSpace';

export const SearchInput = styled(BaseInput.Search)`
  /* Apply the height to the wrapper, not the input */
  .ant-input-affix-wrapper {
    height: 40px !important; /* Or any desired height */
    display: flex;
    align-items: center;
    padding: 0 12px; /* Horizontal padding only */
  }

  /* Input styles */
  & input {
    font-weight: 600;
    background-color: var(--background-color);
    padding: 0; /* Remove padding here, let the wrapper handle it */
    line-height: 1.5;
    box-sizing: border-box;
    height: auto !important; /* Allow it to expand naturally */
  }

  /* Make sure the prefix icon is aligned */
  & .ant-input-prefix {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }

  /* Ensure the suffix (filter button) is aligned */
  & .ant-input-suffix {
    display: flex;
    align-items: center;
  }

  /* For the search button (if used) */
  .ant-input-search-button {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media only screen and ${media.md} {
    .ant-input-affix-wrapper {
      height: 44px !important; /* Slightly taller on larger screens if needed */
      padding: 0 16px;
    }
    & input {
      font-size: 1rem;
    }
  }
`;

export const Space = styled(BaseSpace)`
  & > .ant-space-item:last-of-type {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
