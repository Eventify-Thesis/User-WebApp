import React from 'react';
import * as s from './TrendingSearched.styles';
import { useGetTrendingKeywords } from "@/queries/useGetTrendingKeywords";

export const TrendingSearches: React.FC = () => {
  const { data: trendingKeywords, isLoading, isError } = useGetTrendingKeywords();

  
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading trending searches</p>;

  const handleClick = (keyword: string) => {
    console.log(`Clicked on: ${keyword}`);
    // You can trigger a search or navigate based on the keyword
  };

  return (
    <s.TrendingWrapper>
      {trendingKeywords?.map((keyword, index) => (
        <s.TrendingItem key={index} onClick={() => handleClick(keyword)}>
          <s.TrendingIcon />
          <s.TrendingText>{keyword}</s.TrendingText>
        </s.TrendingItem>
      ))}
    </s.TrendingWrapper>
  );
};
