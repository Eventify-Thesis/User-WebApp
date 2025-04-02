
import styled from 'styled-components';
import { RiseOutlined } from '@ant-design/icons'; // Ant Design Trending Icon

export const TrendingWrapper = styled.div`
  color: white;
  margin: 10px 0;
`;

export const TrendingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

export const TrendingIcon = styled(RiseOutlined)`
  color: #27ae60; // Green trending icon
  font-size: 16px;
`;

export const TrendingText = styled.span`
  font-weight: 600;
`;