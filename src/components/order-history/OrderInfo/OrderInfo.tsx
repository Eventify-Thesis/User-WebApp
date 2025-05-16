import React, { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { formatDate } from '@/utils/dates';
import { Box, Text, Badge, Group, Flex, Paper, Stack, BackgroundImage, rem } from '@mantine/core';
import { IconCheck, IconCalendar, IconMapPin, IconTicket } from '@tabler/icons-react';
import './OrderInfo.css';

interface OrderInfoProps {
  date: string;
  title: string;
  status: string;
  OrderType: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl: string;
}

const OrderInfo: React.FC<OrderInfoProps> = ({
  date,
  title,
  status,
  OrderType,
  startTime,
  endTime,
  location,
  imageUrl,
}) => {
  const [accentColor, setAccentColor] = useState('#FFD700'); // Default gold accent
  
  useEffect(() => {
    if (!imageUrl) return;

    const fac = new FastAverageColor();
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = async () => {
      try {
        const color = await fac.getColorAsync(img);
        setAccentColor(color.hex);
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

  // Format dates for display
  const startDateFormatted = formatDate(startTime, 'MMM D, YYYY', 'Asia/Bangkok');
  const endDateFormatted = formatDate(endTime, 'MMM D, YYYY', 'Asia/Bangkok');
  const dateRange = startDateFormatted === endDateFormatted 
    ? startDateFormatted 
    : `${startDateFormatted} - ${endDateFormatted}`;

  // Get status color
  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('paid') || statusLower.includes('success')) return 'green';
    if (statusLower.includes('pending') || statusLower.includes('processing')) return 'yellow';
    if (statusLower.includes('cancel')) return 'red';
    return 'blue';
  };

  return (
    <Paper
      radius="lg"
      p={0}
      className="order-card-container"
      style={{ overflow: 'hidden', cursor: 'pointer' }}
      withBorder
      shadow="sm"
    >
      <Flex direction={{ base: 'column', sm: 'row' }} h="100%">
        {/* Left side - Date column with accent color */}
        <Box 
          w={{ base: '100%', sm: 80 }}
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, rgba(0,0,0,0.8) 120%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: rem(16),
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Text 
            fw={800} 
            size="xl" 
            c="white" 
            ta="center"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            {date}
          </Text>
        </Box>

        {/* Right side - Content with image background */}
        <Box style={{ flex: 1, position: 'relative', minHeight: 160 }}>
          {/* Background image with proper aspect ratio and gradient overlay */}
          <BackgroundImage 
            src={imageUrl || 'https://placehold.co/600x400/222/ccc?text=No+Image'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.85))',
                zIndex: 1
              }
            }}
          />

          {/* Content overlay */}
          <Box 
            p="md" 
            style={{ 
              position: 'relative', 
              zIndex: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Stack gap="xs" justify="flex-start">
              {/* Title with subtle text shadow for better readability */}
              <Text 
                fw={700} 
                size="lg" 
                lh={1.2} 
                c="white"
                style={{ 
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  marginBottom: rem(8)
                }}
              >
                {title}
              </Text>

              {/* Status badges */}
              <Group gap="xs">
                <Badge
                  color={getStatusColor(status)}
                  leftSection={<IconCheck size={14} />}
                  variant="filled"
                  radius="md"
                  size="md"
                >
                  {status}
                </Badge>
                <Badge 
                  color="blue" 
                  variant="filled"
                  leftSection={<IconTicket size={14} />}
                  radius="md"
                  size="md"
                >
                  {OrderType}
                </Badge>
              </Group>
            </Stack>

            {/* Bottom info section */}
            <Stack gap="xs" mt="md">
              <Flex align="center" gap="xs">
                <IconCalendar size={16} style={{ color: 'white', opacity: 0.9 }} />
                <Text size="sm" c="white" style={{ opacity: 0.9, fontWeight: 'bold' }}>
                  {dateRange}
                </Text>
              </Flex>
              
              <Flex align="center" gap="xs">
                <IconMapPin size={16} style={{ color: 'white', opacity: 0.9 }} />
                <Text size="sm" c="white" style={{ opacity: 0.9, fontWeight: 'bold' }}>
                  {location && location.length > 0 ? location : 'Online'}
                </Text>
              </Flex>
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Paper>
  );
};

export default OrderInfo;
