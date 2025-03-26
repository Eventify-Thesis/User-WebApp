import styled from "styled-components";
import { FrownOutlined } from "@ant-design/icons";

export const Container = styled.div`
  background-color: black;
  min-height: 100vh;
  padding: 20px;
  color: white;
  box-sizing: border-box;

  @media (max-width: 991px) {
    padding: 0 40px;
  }

  @media (max-width: 640px) {
    padding: 0 20px;
  }
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  color: rgb(214, 205, 32);
  margin-bottom: 20px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  background: #222;
  color: white;
  outline: none;

  &::placeholder {
    color: #aaa;
  }
`;

export const NoEventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

export const SadIcon = styled(FrownOutlined)`
  font-size: 48px;
  color: gray;
  margin-bottom: 10px;
`;

export const NoEventsText = styled.span`
  font-size: 18px;
  color: gray;
  text-align: center;
`;