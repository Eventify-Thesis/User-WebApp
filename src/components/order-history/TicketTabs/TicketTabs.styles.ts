import styled from "styled-components";
import { Tabs } from "antd";

export const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    font-weight: bold;
    color: white;
    padding: 0px 32px; /* Increase horizontal padding */
    border-radius: 14px; /* Slightly rounded corners */
    background: #4d4d55;
    transition: all 0.3s ease;
    min-width: 160px; /* Make it longer */
    height: 30px; /* Reduce height */
    font-size: 16px;
  }

  .ant-tabs-tab-active {
    background: #4CAF50;
    color: white;
    font-weight: bold;
  }

  ant-tabs-nav-operations, .ant-tabs-ink-bar {
    display: none !important;
  }

  .ant-tabs-nav::before {
    border-bottom: none !important;
  }

  @media (max-width: 750px) {
    .ant-tabs-tab {
      min-width: 120px; /* Reduce width */
      height: 28px; /* Slightly lower height */
      font-size: 14px;
      padding: 0px 16px;
    }
  }

  @media (max-width: 500px) {
    .ant-tabs-tab {
      min-width: 90px; /* Further reduce width */
      height: 26px; /* Even lower height */
      font-size: 12px;
      padding: 0px 10px;
      margin-left: 6px important!; /* Reduce margin for smaller screens */
    }
  }
`;



export const SubTabs = styled(Tabs)`
  .ant-tabs-nav {
    display: flex;
    justify-content: center;
    border-bottom: none !important;
  }

  .ant-tabs-tab {
    font-weight: bold;
    color: gray;
    padding: 5px 12px;
    transition: all 0.3s ease;
    position: relative;
  }

  .ant-tabs-tab-active {
    color: white;
  }

  .ant-tabs-ink-bar {
    background: #4CAF50 !important; /* Green underline */
    height: 2px !important;
  }

  .ant-tabs-nav::before {
    border-bottom: none !important; /* Prevent extra white line */
  }
`;
