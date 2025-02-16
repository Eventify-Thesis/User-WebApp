import { BaseLayout } from '@/components/common/BaseLayout/BaseLayout';
import { LAYOUT } from '@/styles/themes/constants';
import { media } from '@/styles/themes/constants';
import styled, { css } from 'styled-components';
import { Header, Header } from './MainHeader.styles';

export const Header = styled(BaseLayout.Header)<Header>`
  line-height: 0;

  @media only screen and ${media.md} {
    padding: 0.5rem ${LAYOUT.desktop.paddingHorizontal};
    height: ${LAYOUT.desktop.headerHeight};
  }

  @media only screen and ${media.md} {
    ${(props) =>
      // props?.$isTwoColumnsLayoutHeader &&
      css`
        padding: 0;
      `}
  }
`;
