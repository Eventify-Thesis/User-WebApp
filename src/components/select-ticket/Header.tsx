import React from 'react';
import { Typography, Space, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: '16px 0',
        marginBottom: 24,
        borderBottom: '1px solid #f0f0f0',
        position: 'relative',
      }}
    >
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{
          fontWeight: 'bold',
          position: 'absolute',
          left: 0,
          top: '50%',
          color: 'white',
          transform: 'translateY(-50%)',
        }}
      >
        Back
      </Button>
      <Title
        level={4}
        style={{
          fontWeight: 'bold',
          margin: 0,
          textAlign: 'center',
          color: 'var(--primary-color)',
        }}
      >
        Choose Ticket
      </Title>
    </div>
  );
};

export default Header;
