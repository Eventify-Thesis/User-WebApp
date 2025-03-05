import React from "react";
import { Modal, Radio, Switch, Button, Checkbox } from "antd";

interface FilterData {
  location: string;
  isFree: boolean;
  categories: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterData: FilterData;
  setFilterData: (data: FilterData) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filterData,
  setFilterData,
}) => {
  const handleApply = () => {
    onClose();
  };

  return (
    <Modal
      title="Bộ lọc"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="reset" onClick={() => setFilterData({ location: "Toàn quốc", isFree: false, categories: [] })}>
          Thiết lập lại
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Áp dụng
        </Button>,
      ]}
    >
      <div>
        <h4>Vị trí</h4>
        <Radio.Group
          value={filterData.location}
          onChange={(e) =>
            setFilterData({ ...filterData, location: e.target.value })
          }
        >
          <Radio value="Toàn quốc">Toàn quốc</Radio>
          <Radio value="Hồ Chí Minh">Hồ Chí Minh</Radio>
          <Radio value="Hà Nội">Hà Nội</Radio>
          <Radio value="Đà Lạt">Đà Lạt</Radio>
          <Radio value="Vị trí khác">Vị trí khác</Radio>
        </Radio.Group>
      </div>

      <div style={{ marginTop: 10 }}>
        <h4>Giá tiền</h4>
        <Switch
          checked={filterData.isFree}
          onChange={(checked) => setFilterData({ ...filterData, isFree: checked })}
        />{" "}
        Miễn phí
      </div>

      <div style={{ marginTop: 10 }}>
        <h4>Thể loại</h4>
        <Checkbox.Group
          value={filterData.categories}
          onChange={(values) =>
            setFilterData({ ...filterData, categories: values as string[] })
          }
          options={["Nhạc sống", "Sân khấu & Nghệ thuật", "Thể Thao", "Khác"]}
        />
      </div>
    </Modal>
  );
};

export default FilterModal;
