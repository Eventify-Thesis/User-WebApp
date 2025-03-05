import React, { useState } from "react";
import { Modal, Button } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { Dayjs } from "dayjs";
import { DatePicker } from "antd";
import styled from "styled-components";

const { RangePicker } = DatePicker;

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDates: [Dayjs | null, Dayjs | null];
  setSelectedDates: (dates: [Dayjs | null, Dayjs | null]) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  selectedDates,
  setSelectedDates,
}) => {
  const [tempDates, setTempDates] = useState<[Dayjs | null, Dayjs | null] | null>(
    selectedDates
  );

  // Handle date selection
  const handleDateChange: RangePickerProps["onChange"] = (dates) => {
    setTempDates(dates as [Dayjs | null, Dayjs | null]);
  };

  // Handle Apply
  const handleApply = () => {
    if (tempDates) {
        setSelectedDates(tempDates); // Save the selected dates
    }
    onClose();
};


  // Handle Reset
  const handleReset = () => {
    setTempDates([null,null]);
    setSelectedDates([null,null]);
  };

  return (
    <Modal
      title="Chọn thời gian"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="reset" onClick={handleReset}>
          Thiết lập lại
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Áp dụng
        </Button>,
      ]}
    >
      <PickerContainer>
        <RangePicker
          value={tempDates}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          style={{ width: "100%" }}
          showTime={false}
        />
      </PickerContainer>
    </Modal>
  );
};

// Styled components for responsiveness
const PickerContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export default CalendarModal;
