import styled from 'styled-components';

export const VoucherSection = styled.div`
  margin: 16px 0;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  
  .ant-tabs-content {
    padding: 16px 0;
  }

  .voucher-list {
    max-height: 400px;
    overflow-y: auto;
    margin-top: 16px;
  }

  .voucher-search {
    margin-bottom: 16px;
  }
`;

export const VoucherTag = styled.div`
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
`;
