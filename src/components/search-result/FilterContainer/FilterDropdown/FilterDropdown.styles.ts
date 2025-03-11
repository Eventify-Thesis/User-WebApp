import { Button, Input, Radio } from "antd";
import styled from "styled-components";

interface FilterData {
  location: string;
  isFree: boolean;
  categories: string[];
}

export interface FilterDropdownProps {
  filterData: FilterData;
  setFilterData: (data: FilterData) => void;
  children: React.ReactNode;
}

export const DropdownContent = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  width: 280px;
`;

export const Section = styled.div`
  margin-top: 10px;
`;

export const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const StyledRadio = styled(Radio)`
  display: block;
  margin-bottom: 4px;
`;

export const StyledInput = styled(Input)`
  margin-top: 10px;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const StyledButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #d9d9d9;
`;

export const StyledPrimaryButton = styled(Button)`
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;

  &:hover {
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
`;