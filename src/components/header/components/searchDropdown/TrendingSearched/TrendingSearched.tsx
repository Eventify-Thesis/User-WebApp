import React from 'react';
import styled from 'styled-components';
import { RiseOutlined } from '@ant-design/icons'; // Ant Design Trending Icon

const TrendingWrapper = styled.div`
  color: white;
  margin: 10px 0;
`;

const TrendingItem = styled.div`
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

  span {
    font-weight: 600;
  }
`;

const TrendingIcon = styled(RiseOutlined)`
  color: #27ae60; // Green trending icon
  font-size: 16px;
`;

const trendingKeywords = ['ntpmm', '8wonder', 'keshi'];

export const TrendingSearches: React.FC = () => {
  const handleClick = (keyword: string) => {
    console.log(`Clicked on: ${keyword}`);
    // You can trigger a search or navigate based on the keyword
  };

  return (
    <TrendingWrapper>
      {trendingKeywords.map((keyword, index) => (
        <TrendingItem key={index} onClick={() => handleClick(keyword)}>
          <TrendingIcon />
          <span>{keyword}</span>
        </TrendingItem>
      ))}
    </TrendingWrapper>
  );
};
