import { Card } from "antd";
import styled from "styled-components";

export const StyledCard = styled(Card)<{ isTopCard?: boolean }>`
  background: #4a4a55;
  color: #fff;
  position: relative;
  margin: 0 auto;
  border-radius: 0px;
  overflow: hidden;
  max-width: 1000px;

  ${({ isTopCard }) =>
    isTopCard &&
    `
    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 50px; /* Adjust size */
      height: 50px;
      background: #333; /* Same as the page background */
      border-radius: 50%;
      top: -25px; /* Half of width/height to move it outside */
    }

    &::before {
      left: -25px; /* Move left circle */
    }

    &::after {
      right: -25px; /* Move right circle */
    }
  `}

  .ant-card-head-title {
    color: #fff;
    font-size: 16px;
  }

  .ant-table {
    background: #333;
    color: #fff;
  }

  .ant-table-thead > tr > th {
    background: #444 !important;
    color: #fff !important;
  }

  .ant-table-tbody > tr > td {
    background: none !important;
    color: #fff !important;
  }
`;

export const ScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
`;