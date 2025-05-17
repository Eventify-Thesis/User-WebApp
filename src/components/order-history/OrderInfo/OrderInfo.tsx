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
            background: `linear-gradient(135deg, ${accentColor} 0%, rgba(255,255,255,0.9) 120%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: rem(16),
            position: 'relative',
            zIndex: 2,
            borderRight: '1px solid rgba(0,0,0,0.1)'
          }}
        >
          <Text 
            fw={800} 
            size="xl" 
            c="dark" 
            ta="center"
          >
            {date.split('/')[0]}
          </Text>
          <Text
            fw={800} 
            size="xl" 
            c="dark" 
            ta="center"
          >
            {date.split('/')[1]}
          </Text>
          <Text
            fw={800} 
            size="xl" 
            c="dark" 
            ta="center"
          >
            {date.split('/')[2]}
          </Text>
        </Box>

        {/* Right side - Content with image background */}
        <Box style={{ flex: 1, position: 'relative', minHeight: 160 }}>
          {/* Background image with enhanced gradient overlay for better text visibility */}
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
            }}
          />
          {/* Removed full-width overlay to allow image to be fully visible */}

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
            className="order-info-content"
          >
            <Stack gap="xs" justify="flex-start">
              {/* Title with background container that fits content */}
              <Box
                style={{
                  display: 'inline-block',
                  marginBottom: rem(4),
                }}
              >
                <Text 
                  fw={700} 
                  size="lg" 
                  lh={1.2} 
                  c="dark"
                  p="xs"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: rem(6),
                    backdropFilter: 'blur(2px)',
                    display: 'inline-block'
                  }}
                >
                  {title}
                </Text>
              </Box>

              {/* Status badges */}
              <Group gap="xs">
                <Badge
                  color={getStatusColor(status)}
                  leftSection={<IconCheck size={14} />}
                  variant="light"
                  radius="md"
                  size="md"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(2px)'
                  }}
                >
                  {status}
                </Badge>
                <Badge 
                  color="blue" 
                  variant="light"
                  leftSection={<IconTicket size={14} />}
                  radius="md"
                  size="md"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(2px)'
                  }}
                >
                  {OrderType}
                </Badge>
              </Group>
            </Stack>

            {/* Bottom info section with individual content wrapping */}
            <Stack gap="xs" mt="md">
              <Box
                style={{
                  display: 'inline-block'
                }}
              >
                <Flex 
                  align="center" 
                  gap="xs"
                  p="xs"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: rem(6),
                    backdropFilter: 'blur(2px)',
                    display: 'inline-flex'
                  }}
                >
                  <IconCalendar size={16} style={{ color: 'rgba(0,0,0,0.8)' }} />
                  <Text size="sm" c="dark" fw={600}>
                    {dateRange}
                  </Text>
                </Flex>
              </Box>
              
              <Box
                style={{
                  display: 'inline-block'
                }}
              >
                <Flex 
                  align="center" 
                  gap="xs"
                  p="xs"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: rem(6),
                    backdropFilter: 'blur(2px)',
                    display: 'inline-flex'
                  }}
                >
                  <IconMapPin size={16} style={{ color: 'rgba(0,0,0,0.8)' }} />
                  <Text size="sm" c="dark" fw={600}>
                    {location && location.length > 0 ? location : 'Online'}
                  </Text>
                </Flex>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Paper>
  );
};

export default OrderInfo;
