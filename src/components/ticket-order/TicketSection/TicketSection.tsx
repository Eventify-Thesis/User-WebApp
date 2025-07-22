import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderModel } from '@/domain/OrderModel';
import { formatDate } from '@/utils/dates';
import {
  Text,
  Group,
  Badge,
  Modal,
  Box,
  Paper,
  Title,
  Stack,
  Button,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import {
  IconCalendarEvent,
  IconTicket,
  IconClock,
  IconScan,
  IconAlertCircle,
  IconDownload,
} from '@tabler/icons-react';
import '@mantine/carousel/styles.css';
import QRCode from 'react-qr-code';

interface TicketSectionProps {
  order: OrderModel;
}

const TicketSection: React.FC<TicketSectionProps> = ({ order }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);

  const showQRCode = (qrUrl: string) => {
    setSelectedQR(qrUrl);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedQR(null);
  };

  const downloadQRCode = () => {
    if (!selectedQR) return;
    
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    canvas.width = 400;
    canvas.height = 400;
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 400, 400);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `ticket-qr-${order.publicId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const { event } = order;
  const { show } = order;

  return (
    <Box>
      <Title order={3} mb="lg">
        {t('ticketSection.tickets')}
      </Title>
      <Carousel
        slideSize="100%"
        slideGap="md"
        loop
        align="start"
        controlsOffset="xs"
        styles={{
          control: {
            backgroundColor: '#fff',
            border: '1px solid #e9ecef',
            color: '#000',
            '&[data-inactive]': {
              opacity: 0,
              cursor: 'default',
            },
          },
        }}
      >
        {order.attendees.map((attendee) => (
          <Carousel.Slide key={attendee.publicId}>
            <Paper shadow="sm" p="lg" radius="md" withBorder>
              <Group justify="space-between" mb="lg">
                <Box>
                  <Badge color="pink" variant="filled" size="lg" mb="xs">
                    {attendee.firstName + ' ' + attendee.lastName}
                  </Badge>
                  <Text size="sm" c="gray.6" mt="xs">
                    #{order.publicId}
                  </Text>
                </Box>
                <Text fw={700} size="xl">
                  {t('ticketSection.seat')}: {attendee.seatNumber || 'N/A'}
                </Text>
              </Group>

              <Box mt="md">
                <Group gap="lg">
                  <Box>
                    <Text fw={500} size="sm" mb="xs">
                      {t('ticketSection.venue')}
                    </Text>
                    <Group gap="xs">
                      <IconCalendarEvent size={16} color="gray" />
                      <Text size="sm">{event.venueName}</Text>
                    </Group>
                  </Box>

                  <Box>
                    <Text fw={500} size="sm" mb="xs">
                      {t('ticketSection.row')}
                    </Text>
                    <Group gap="xs">
                      <IconTicket size={16} color="gray" />
                      <Text size="sm">{attendee.rowLabel || 'N/A'}</Text>
                    </Group>
                  </Box>

                  <Box>
                    <Text fw={500} size="sm" mb="xs">
                      {t('ticketSection.time')}
                    </Text>
                    <Group gap="xs">
                      <IconClock size={16} color="gray" />
                      <Text size="sm">
                        {formatDate(
                          show.startTime,
                          'DD-MM-YYYY HH:mm',
                          'Asia/Bangkok',
                        )}{' '}
                        -{' '}
                        {formatDate(
                          show.endTime,
                          'DD-MM-YYYY HH:mm',
                          'Asia/Bangkok',
                        )}
                      </Text>
                    </Group>
                  </Box>
                </Group>

                <Box mt="xl">
                  <Paper
                    p="md"
                    style={{
                      cursor: 'pointer',
                      background: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      transition: 'all 0.2s ease',
                      borderRadius: '8px',
                      '&:hover': {
                        background: '#e9ecef',
                      },
                    }}
                    onClick={() => showQRCode(attendee.publicId)}
                  >
                    <Group justify="center" gap="md">
                      <IconTicket size={20} />
                      <Text fw={500}>{t('ticketSection.qrPrompt')}</Text>
                    </Group>
                  </Paper>
                </Box>
              </Box>
            </Paper>
          </Carousel.Slide>
        ))}
      </Carousel>

      <Modal
        opened={isModalVisible}
        onClose={handleClose}
        centered
        size="md"
        padding="xl"
        styles={{
          header: {
            display: 'none',
          },
          body: {
            padding: 'var(--mantine-spacing-xl)',
          },
        }}
      >
        <Stack align="center" gap="lg">
          <IconScan size={48} color="var(--mantine-color-blue-6)" />
          <Title order={2} ta="center">
            {t('ticketSection.scanQRCode')}
          </Title>

          <Paper withBorder p="xl" style={{ background: '#fff' }}>
            {selectedQR && (
              <QRCode
                id="qr-code-svg"
                value={selectedQR}
                size={200}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              />
            )}
          </Paper>

          <Group gap="xs" c="dimmed">
            <IconAlertCircle size={16} />
            <Text size="sm">{t('ticketSection.scanInstructions')}</Text>
          </Group>

          <Group justify="center" grow>
            <Button 
              variant="filled" 
              color="blue" 
              leftSection={<IconDownload size={16} />}
              onClick={downloadQRCode}
            >
              Download QR Code
            </Button>
            <Button variant="subtle" color="gray" onClick={handleClose}>
              {t('common.close')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
};

export default TicketSection;
