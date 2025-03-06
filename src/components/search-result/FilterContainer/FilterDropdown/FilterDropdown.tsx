import React, { useState } from "react";
import { Dropdown, Button, Radio, Switch, Checkbox, Input } from "antd";
import styled from "styled-components";

interface FilterData {
  location: string;
  isFree: boolean;
  categories: string[];
}

interface FilterDropdownProps {
  filterData: FilterData;
  setFilterData: (data: FilterData) => void;
  children: React.ReactNode;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterData,
  setFilterData,
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [tempData, setTempData] = useState(filterData);
  const [customLocation, setCustomLocation] = useState(
    filterData.location === "Vị trí khác" ? filterData.location : ""
  );

  const handleApply = () => {
    // Update location with custom input if "Vị trí khác" is selected
    const updatedLocation =
      tempData.location === "Vị trí khác" ? customLocation : tempData.location;

    setFilterData({ ...tempData, location: updatedLocation });
    setVisible(false);
    console.log(tempData);
    console.log(customLocation)
  };

  const handleReset = () => {
    setTempData({ location: "Toàn quốc", isFree: false, categories: [] });
    setCustomLocation("");
  };

  return (
    <Dropdown
      open={visible}
      onOpenChange={setVisible}
      trigger={["click"]}
      dropdownRender={() => (
        <DropdownContent>
          <div>
            <h4>Vị trí</h4>
            <Radio.Group
              value={tempData.location}
              onChange={(e) => {
                const newLocation = e.target.value;
                setTempData({ ...tempData, location: newLocation });

                if (newLocation !== "Vị trí khác") {
                  setCustomLocation(""); // Clear custom location if switching away
                }
              }}
            >
              <Radio value="Toàn quốc">Toàn quốc</Radio>
              <Radio value="Hồ Chí Minh">Hồ Chí Minh</Radio>
              <Radio value="Hà Nội">Hà Nội</Radio>
              <Radio value="Đà Lạt">Đà Lạt</Radio>
              <Radio value="Vị trí khác">Vị trí khác</Radio>
            </Radio.Group>

            {/* Show input field only if "Vị trí khác" is selected */}
            {tempData.location === "Vị trí khác" && (
              <StyledInput
                placeholder="Nhập vị trí mong muốn"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                autoFocus
              />
            )}
          </div>

          <div style={{ marginTop: 10 }}>
            <h4>Giá tiền</h4>
            <Switch
              checked={tempData.isFree}
              onChange={(checked) =>
                setTempData({ ...tempData, isFree: checked })
              }
            />{" "}
            Miễn phí
          </div>

          <div style={{ marginTop: 10 }}>
            <h4>Thể loại</h4>
            <Checkbox.Group
              value={tempData.categories}
              onChange={(values) =>
                setTempData({ ...tempData, categories: values as string[] })
              }
              options={["Nhạc sống", "Sân khấu & Nghệ thuật", "Thể Thao", "Khác"]}
            />
          </div>

          <ButtonContainer>
            <Button onClick={handleReset}>Thiết lập lại</Button>
            <Button type="primary" onClick={handleApply}>
              Áp dụng
            </Button>
          </ButtonContainer>
        </DropdownContent>
      )}
    >
      {children}
    </Dropdown>
  );
};

// Styled components
const DropdownContent = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  width: 280px;
`;

const StyledInput = styled(Input)`
  margin-top: 10px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export default FilterDropdown;
