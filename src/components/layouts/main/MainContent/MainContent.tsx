import styled, { css } from 'styled-components';
import { LAYOUT, media } from '@/styles/themes/constants';
import { BaseLayout } from '@/components/common/BaseLayout/BaseLayout';

interface HeaderProps {
  // $isTwoColumnsLayout: boolean;
}

export default styled(BaseLayout.Content)<HeaderProps>`
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
