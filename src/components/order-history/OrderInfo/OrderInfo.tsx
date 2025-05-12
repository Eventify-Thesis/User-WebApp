import React, { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { formatDate } from '@/utils/dates';
import { Box, Text, Badge, Group, Flex } from '@mantine/core';
import { IconCheck, IconCalendar, IconMapPin } from '@tabler/icons-react';
import './OrderInfo.css';

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
    <Box
      className="order-container"
      style={{
        backgroundColor: primaryColor,
        color: textColor,
      }}
    >
      <Box
        className="date-box"
        style={{
          backgroundColor: primaryColor,
          color: textColor,
        }}
      >
        <Text className="date-day">
          {formatDate(date, 'dd', 'Asia/Bangkok')}
        </Text>
        <Text className="date-month">
          {formatDate(date, 'MM', 'Asia/Bangkok')}
        </Text>
        <Text className="date-year">
          {formatDate(date, 'yyyy', 'Asia/Bangkok')}
        </Text>
      </Box>
      <Box
        className="order-info-container"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundColor: primaryColor,
          color: textColor,
        }}
      >
        <Text className="order-title">{title}</Text>
        <Group className="tags-container">
          <Badge
            color="green"
            leftSection={<IconCheck size={14} />}
            variant="filled"
          >
            {status}
          </Badge>
          <Badge color="blue" variant="filled">
            {OrderType}
          </Badge>
        </Group>
        <Flex className="order-detail">
          <IconCalendar size={16} />
          <Text>{time}</Text>
        </Flex>
        <Flex className="order-detail">
          <IconMapPin size={16} />
          <Text>{location}</Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default OrderInfo;
