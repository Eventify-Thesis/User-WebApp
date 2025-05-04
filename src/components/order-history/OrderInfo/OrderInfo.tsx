import React, { useEffect, useState } from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { FastAverageColor } from 'fast-average-color';
import * as s from './OrderInfo.styles';
import { countReset } from 'console';
import { formatDate } from '@/utils/dates';

interface OrderInfoProps {
  date: string;
  title: string;
  status: string;
  OrderType: string;
  time: string;
  location: string;
  imageUrl: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({
  date,
  title,
  status,
  OrderType,
  time,
  location,
  imageUrl,
}) => {
  const [primaryColor, setPrimaryColor] = useState('#4a4a55');

  useEffect(() => {
    if (!imageUrl) return;

    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = async () => {
      try {
        const color = await fac.getColorAsync(img);
        setPrimaryColor(color.hex);
      } catch (error) {
        console.error('Error extracting color:', error);
      }
    };

    img.onerror = () => {
      console.error('Error loading image', imageUrl);
    };

    return () => {
      fac.destroy();
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  const isLightColor = (color: string) => {
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 180;
  };

  const textColor = isLightColor(primaryColor) ? '#000' : '#fff';

  return (
    <s.OrderContainer $primaryColor={primaryColor}>
      <s.DateBox $primaryColor={primaryColor} $textColor={textColor}>
        <div>{formatDate(date, 'dd', 'Asia/Bangkok')}</div>
        <div>{formatDate(date, 'MM', 'Asia/Bangkok')}</div>
        <div>{formatDate(date, 'yyyy', 'Asia/Bangkok')}</div>
      </s.DateBox>
      <s.OrderInfoContainer
        $imageUrl={imageUrl}
        $primaryColor={primaryColor}
        $textColor={textColor}
      >
        <h3>{title}</h3>
        <s.TagsContainer>
          <Tag color="green">
            <CheckCircleOutlined /> {status}
          </Tag>
          <Tag color="blue">{OrderType}</Tag>
        </s.TagsContainer>
        <p>
          <CalendarOutlined /> {time}
        </p>
        <p>
          <EnvironmentOutlined /> {location}
        </p>
      </s.OrderInfoContainer>
    </s.OrderContainer>
  );
};

export default OrderInfo;
