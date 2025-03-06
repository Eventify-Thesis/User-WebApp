import { useState } from "react";
import styled from "styled-components";
import { Button } from "antd";
import { FilterOutlined, CalendarOutlined } from "@ant-design/icons";
import CalendarDropdown from "./CalendarDropdown/CalendarDropdown";
import FilterDropdown from "./FilterDropdown/FilterDropdown";
import type { Dayjs } from "dayjs";

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 5px;
  background: white;
  border: 1px solid #d9d9d9;
  padding: 4px 12px;
  height: auto;
`;

interface EventFiltersProps {
  selectedDates: [Dayjs | null, Dayjs | null];
  setSelectedDates: (dates: [Dayjs | null, Dayjs | null]) => void;
  filterData: { location: string; isFree: boolean; categories: string[] };
  setFilterData: (data: { location: string; isFree: boolean; categories: string[] }) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  selectedDates,
  setSelectedDates,
  filterData,
  setFilterData,
}) => {

  // Function to format the date label for the button
  const formatDateLabel = () => {
    if (!selectedDates || !selectedDates[0] || !selectedDates[1]) {
      return "Tất cả các ngày";
    }
     return `${selectedDates[0]
    .locale("vi")
    .format("DD [tháng] MM, YYYY")} - ${selectedDates[1]
    .locale("vi")
    .format("DD [tháng] MM, YYYY")}`;
  };

  return (
    <FilterContainer>
      <span>Kết quả tìm kiếm:</span>
      
      <CalendarDropdown
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      >
        <StyledButton><CalendarOutlined /> {formatDateLabel()}</StyledButton>
      </CalendarDropdown>

      <FilterDropdown
        filterData={filterData}
        setFilterData={setFilterData}
      >
        <StyledButton><FilterOutlined /> Bộ lọc</StyledButton>
      </FilterDropdown>
    </FilterContainer>
  );
};

export default EventFilters;
