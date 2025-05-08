import styled from 'styled-components';
import { Card } from 'antd';

export const VoucherSection = styled.div`
  .voucher-search {
    margin-bottom: 16px;
  }

  .voucher-list {
    max-height: 400px;
    overflow-y: auto;
    padding: 4px;
  }

  .ant-tabs-nav {
    margin-bottom: 24px;
  }
`;

export const VoucherCard = styled(Card)`
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border: 1px solid #1890ff;
    background-color: #e6f7ff;
  }

  .ant-card-body {
    padding: 16px;
  }
`;

export const VoucherTag = styled.div<{ type: 'percent' | 'fixed' }>`
  background-color: ${props => props.type === 'percent' ? '#e6f7ff' : '#f6ffed'};
  border: 1px solid ${props => props.type === 'percent' ? '#91d5ff' : '#b7eb8f'};
  color: ${props => props.type === 'percent' ? '#1890ff' : '#52c41a'};
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
`;

export const VoucherInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const VoucherHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const VoucherDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
`;

export const CodeText = styled.div`
  font-family: 'SF Mono', 'Courier New', Courier, monospace;
  color: #1890ff;
  font-weight: 500;
`;
