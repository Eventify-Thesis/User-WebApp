import styled from 'styled-components';

export const PodiumBlock = styled.div<{ rank: number }>`
  background: ${({ rank }) =>
    rank === 1 ? '#f6ce3a' : rank === 2 ? '#b6b6b6' : '#ff914d'};
  color: #1e2a78;
  width: 190px;
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  position: relative;
  height: ${({ rank }) =>
    rank === 1 ? '250px' : rank === 2 ? '200px' : '180px'};
  z-index: ${({ rank }) => (rank === 1 ? 2 : 1)};
`;