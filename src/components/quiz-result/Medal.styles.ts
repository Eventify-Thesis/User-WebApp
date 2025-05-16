import styled from 'styled-components';

export const Medal = styled.div<{ rank: number }>`
  margin-top: -36px;
  background: ${({ rank }) =>
    rank === 1 ? '#f6ce3a' : rank === 2 ? '#b6b6b6' : '#ff914d'};
  color: white;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  border: 4px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  position: absolute;
  top: -28px;
`;