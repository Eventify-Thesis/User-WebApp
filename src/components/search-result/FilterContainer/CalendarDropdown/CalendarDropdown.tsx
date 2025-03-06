import React, { useState } from "react";
import { Dropdown, Button } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { Dayjs } from "dayjs";
import { DatePicker } from "antd";
import styled from "styled-components";

const { RangePicker } = DatePicker;

interface CalendarDropdownProps {
  selectedDates: [Dayjs | null, Dayjs | null];
  setSelectedDates: (dates: [Dayjs | null, Dayjs | null]) => void;
  children: React.ReactNode; 
}

const CalendarDropdown: React.FC<CalendarDropdownProps> = ({
  selectedDates,
  setSelectedDates,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [tempDates, setTempDates] = useState<[Dayjs | null, Dayjs | null] | null>(selectedDates);

  // Handle date selection
  const handleDateChange: RangePickerProps["onChange"] = (dates) => {
    setTempDates(dates as [Dayjs | null, Dayjs | null]);
  };

  // Handle Apply
  const handleApply = () => {
    if (tempDates) {
      setSelectedDates(tempDates); // Save the selected dates
    }
    setVisible(false);
  };

  // Handle Reset
  const handleReset = () => {
    setTempDates([null, null]);
    setSelectedDates([null, null]);
  };

  return (
    <Dropdown
      open={visible}
      onOpenChange={setVisible}
      trigger={["click"]} // Ensure the dropdown stays open on click
      dropdownRender={() => (
        <DropdownContent>
          <RangePicker
            value={tempDates}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            style={{ width: "100%" }}
          />
          <ButtonContainer>
            <Button onClick={handleReset}>Thiết lập lại</Button>
            <Button type="primary" onClick={handleApply}>
              Áp dụng
            </Button>
          </ButtonContainer>
        </DropdownContent>
      )}
    >
      { children }
    </Dropdown>
  );
};

// Styled components
const DropdownContent = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  width: 280px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export default CalendarDropdown;
