import styled from 'styled-components';

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoImage = styled.img`
  height: 40px; /* Default size */
  cursor: pointer;

  @media (max-width: 768px) {
    height: 28px; /* Smaller on tablets */
  }

  @media (max-width: 521px) {
    flex: 1; /* Hide logo on small screens */
  }
`;