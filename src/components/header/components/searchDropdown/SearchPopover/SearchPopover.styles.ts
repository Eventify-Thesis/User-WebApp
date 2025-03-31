import { Popover } from 'antd';
import styled from 'styled-components';

export const SearchPopoverWrapper = styled(Popover)`
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.6) !important;
  border-radius: 12px;

  .ant-popover-content {
    background: rgba(0, 0, 0, 0.6) !important;
    backdrop-filter: blur(10px);
    border-radius: 12px;
  }

  .ant-popover-inner {
    padding: 0px !important;
    background: rgba(0, 0, 0, 0.85) !important;
    border-radius: 12px;
    color: white;
  }
`;

export const ContentStyle = styled.div`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  min-width: 320px;
  max-width: 900px;
  max-height: 700px; /* Limits the height */
  overflow-y: auto; /* Enables scrolling inside */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent; /* Custom scrollbar */
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
  }
`;
