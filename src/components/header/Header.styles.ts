import styled, { css } from 'styled-components';
import { BurgerIcon } from '@/components/common/Burger/BurgerIcon';
import { CreateEventButton } from '@/components/header/components/CreateEventButton/CreateEventButton';
import { FONT_SIZE, LAYOUT, media } from '@/styles/themes/constants';
import { BaseCollapse } from '../common/BaseCollapse/BaseCollapse';
import { BaseCol } from '../common/BaseCol/BaseCol';
import { BaseRow } from '../common/BaseRow/BaseRow';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Drawer } from 'antd';

export const HeaderActionWrapper = styled.div`
  cursor: pointer;

  & > .ant-btn > span[role='img'],
  .ant-badge {
    font-size: 1.25rem;

    @media only screen and ${media.md} {
      font-size: 1.625rem;
    }
  }

  & .ant-badge {
    display: inline-block;
  }
`;

export const DropdownCollapse = styled(BaseCollapse)`
  & > .ant-collapse-item > .ant-collapse-header {
    font-weight: 600;
    font-size: 0.875rem;

    color: var(--primary-color);

    @media only screen and ${media.md} {
      font-size: 1rem;
    }
  }

  & > .ant-collapse-item-disabled > .ant-collapse-header {
    cursor: default;

    & > span[role='img'] {
      display: none;
    }
  }
`;

export const BurgerCol = styled(BaseCol)`
  z-index: 999;
  display: flex;
`;

export const MobileBurger = styled(BurgerIcon)`
  width: 1.75rem;
  height: 1.75rem;
  margin-right: -0.5rem;
  color: var(--text-secondary-color);

  ${(props) =>
    props.isCross &&
    css`
      color: var(--text-secondary-color);
    `};
`;

export const SearchColumn = styled(BaseCol)`
  padding: ${LAYOUT.desktop.paddingVertical} ${LAYOUT.desktop.paddingHorizontal};
`;

interface ProfileColumn {
  // $isTwoColumnsLayout: boolean;
}

export const ProfileColumn = styled(BaseCol)<ProfileColumn>`
  @media only screen and ${media.md} {
    ${(props) =>
      css`
        padding: 0 ${LAYOUT.desktop.paddingHorizontal};
      `}
  }
`;

export const NavRow = styled(BaseRow)`
`;

export const NavItem = styled(BaseCol)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: Montserrat, sans-serif;
  font-size: ${FONT_SIZE.md};
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 1050px) {
    font-size: 0; /* Hide text on desktop */
  }

  @media (max-width: 767px) {
    font-size: ${FONT_SIZE.xl}; /* Show text beside icon */
    gap: 0.5rem; /* Space between icon and text */
    flex-direction: row; /* Align icon and text in a row */
  }
`;

export const NavIcon = styled(Icon)`
  color: white;
  width: 24px;
  height: 24px;
  margin-bottom: 5px;
`;

export const CEButton = styled(CreateEventButton)`
  display: flex
`;
export const StyledDrawer = styled(Drawer)`
  .ant-drawer-content {
    background-color: #111827; /* Dark background */
    color: white;
  }

  .ant-drawer-header {
    background-color: #1f2937; /* Slightly lighter dark for contrast */
    border-bottom: 1px solid #374151; /* Subtle border */
  }

  .ant-drawer-title {
    color: white;
  }

  .ant-drawer-close {
    color: white;
  }

  /* Force dark background for the drawer body */
  .ant-drawer-body {
    background-color: #111827 !important;
    color: white;
  }
`;
