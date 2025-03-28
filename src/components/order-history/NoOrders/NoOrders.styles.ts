import styled from "styled-components";

export const NoOrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  text-align: center;
`;

export const ImageWrapper = styled.div`
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%; /* Makes the image circular */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2e; /* Optional: background to match theme */
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Text = styled.p`
  color: #b0b0b0;
  font-size: 16px;
  font-weight: bold;
`;