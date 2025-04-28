import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Space,
  Input,
  Button,
  Typography,
  Spin,
  Empty,
} from 'antd';
import { ShopOutlined, TagOutlined, CalendarOutlined } from '@ant-design/icons';
import { useGetVouchers } from '@/queries/useGetVouchers';
import { VoucherModel } from '@/domain/VoucherModel';
import { useLanguage } from '@/hooks/useLanguage';
import {
  VoucherSection,
  VoucherCard,
  VoucherTag,
  VoucherInfo,
  VoucherHeader,
  VoucherDetails,
  CodeText,
} from './VoucherModal.styles';

const { Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

interface VoucherModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (code: string, name: string) => void;
  loading: boolean;
  eventId: number;
  showId: number;
  selectedVoucher?: string;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  open,
  onClose,
  onApply,
  loading,
  eventId,
  showId,
  selectedVoucher,
}) => {
  const [code, setCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: vouchers, isLoading } = useGetVouchers(eventId, showId);

  const { language } = useLanguage();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      language === 'en' ? 'en-US' : 'vi-VN',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
    );
  };

  const handleApply = () => {
    const selectedVoucherData = vouchers?.find((v) => v.discountCode === code);
    if (code && selectedVoucherData) {
      onApply(code, selectedVoucherData.name);
    } else if (code) {
      onApply(code, 'Custom Voucher');
    }
  };

  const handleSelectVoucher = (voucher: VoucherModel) => {
    setCode(voucher.discountCode);
    onApply(voucher.discountCode, voucher.name);
  };

  const renderVoucherCard = (voucher: VoucherModel) => (
    <VoucherCard
      key={voucher.id}
      className={selectedVoucher === voucher.discountCode ? 'selected' : ''}
      onClick={() => handleSelectVoucher(voucher)}
      hoverable
    >
      <VoucherInfo>
        <VoucherHeader>
          <Text strong>{voucher.name}</Text>
          <VoucherTag
            type={voucher.discountType === 'PERCENT' ? 'percent' : 'fixed'}
          >
            {voucher.discountType === 'PERCENT'
              ? `${voucher.discountValue}%`
              : `${new Intl.NumberFormat('vi-VN').format(
                  voucher.discountValue,
                )} ₫`}
          </VoucherTag>
        </VoucherHeader>
        <VoucherDetails>
          <Space>
            <TagOutlined /> <CodeText>{voucher.discountCode}</CodeText>
          </Space>
          <Space>
            <CalendarOutlined /> Valid until: {formatDate(voucher.endTime)}
          </Space>
        </VoucherDetails>
      </VoucherInfo>
    </VoucherCard>
  );

  const filteredVouchers = vouchers?.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.discountCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Modal
      title="Apply Voucher"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <VoucherSection>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <TagOutlined /> Available Vouchers
              </span>
            }
            key="1"
          >
            <div className="voucher-search">
              <Search
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%' }}
                allowClear
                size="large"
              />
            </div>
            <div className="voucher-list">
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin size="large" />
                </div>
              ) : !filteredVouchers?.length ? (
                <Empty
                  description="No vouchers available"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                filteredVouchers.map(renderVoucherCard)
              )}
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <ShopOutlined /> Enter Code
              </span>
            }
            key="2"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Input
                placeholder="Enter voucher code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ width: '100%' }}
                size="large"
              />
              <Button
                type="primary"
                onClick={handleApply}
                loading={loading}
                disabled={!code}
                block
                size="large"
              >
                Apply Code
              </Button>
            </Space>
          </TabPane>
        </Tabs>
      </VoucherSection>
    </Modal>
  );
};
