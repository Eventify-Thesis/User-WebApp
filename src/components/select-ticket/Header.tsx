import React from 'react';
import { Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: '20px 0',
        marginBottom: 24,
        borderBottom: '1px solid #e9ecef',
        position: 'relative',
        background: '#ffffff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
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
          color: '#495057',
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
          color: '#212529',
        }}
      >
        Choose Ticket
      </Title>
    </div>
  );
};

export default Header;
