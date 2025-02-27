import styled from 'styled-components';

export const SeeMoreButton = styled.button`
  border-radius: 8px;
  border: 2px solid #2b293d;
  background-color: #fff;
  align-self: center;
  margin-top: 30px; /* Reduced margin */
  width: 250px; /* Decreased width */
  max-width: 100%;
  padding: 12px 30px; /* Less padding */
  font-family:
    Open Sans,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 18px; /* Reduced font size */
  color: #2b293d;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #2b293d; /* Change background on hover */
    color: #fff; /* Change text color on hover */
  }

  @media (max-width: 991px) {
    padding: 12px 20px;
    margin-top: 30px;
  }
`;
