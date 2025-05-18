import styled from 'styled-components';

export const OtherPlayer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 24px;
  font-size: 1.1rem;
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  &:last-child { border-bottom: none; }
`;
