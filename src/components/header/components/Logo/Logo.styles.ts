import styled from 'styled-components';

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoImage = styled.img`
  height: 40px; /* Default size */

  @media (max-width: 768px) {
    height: 28px; /* Smaller on tablets */
  }

  @media (max-width: 521px) {
    display: none; /* Hide logo on small screens */
  }
`;