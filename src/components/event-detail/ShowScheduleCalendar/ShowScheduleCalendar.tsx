import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Group,
  Stack,
  Text,
  Card,
  Badge,
  Title,
  Modal,
  Divider,
  Button,
  Menu,
  ActionIcon,
} from '@mantine/core';
import {
  IconClock,
  IconCalendar,
  IconFileText,
  IconCalendarPlus,
  IconDownload,
  IconChevronDown,
} from '@tabler/icons-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventClickArg } from '@fullcalendar/core';
import { ShowSchedule } from '@/types/show-schedule';
import { formatDate } from '@/utils/dates';
import './ShowScheduleCalendar.css';
import EventModel from '@/domain/EventModel';

interface ShowScheduleCalendarProps {
  event: EventModel;
  showStartTime: string;
  showEndTime: string;
  schedules: ShowSchedule[];
  error?: Error | null;
}

// Utility function to format time for display
const formatTimeRange = (startTime: string, endTime: string) => {
  const start = formatDate(startTime, 'HH:mm', 'Asia/Bangkok');
  const end = formatDate(endTime, 'HH:mm', 'Asia/Bangkok');
  const date = formatDate(startTime, 'DD MMM YYYY', 'Asia/Bangkok');
  return { start, end, date };
};

// Utility function to get show time boundaries in hours
const getShowTimeBoundaries = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;

  return { startHour, endHour };
};

// Calendar export utilities
const formatDateForCalendar = (date: string): string => {
  return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

const createCalendarEvent = (schedule: ShowSchedule, showTitle?: string) => {
  const startDate = formatDateForCalendar(schedule.startTime);
  const endDate = formatDateForCalendar(schedule.endTime);
  const title = encodeURIComponent(schedule.title);
  const description = encodeURIComponent(
    `${schedule.description || 'No description provided'}${
      showTitle ? `\n\nPart of: ${showTitle}` : ''
    }`,
  );

  return {
    title,
    description,
    startDate,
    endDate,
    location: encodeURIComponent('Event Show'),
  };
};

const generateGoogleCalendarUrl = (
  event: ReturnType<typeof createCalendarEvent>,
) => {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  return `${baseUrl}&text=${event.title}&dates=${event.startDate}/${event.endDate}&details=${event.description}&location=${event.location}`;
};

const generateICSFile = (schedules: ShowSchedule[], showTitle?: string) => {
  const events = schedules.map((schedule) =>
    createCalendarEvent(schedule, showTitle),
  );

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Event Schedule//Event Schedule//EN',
    'CALSCALE:GREGORIAN',
  ];

  console.log(events);

  events.forEach((event, index) => {
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${Date.now()}-${index}@event-schedule.com`,
      `DTSTART:${event.startDate}`,
      `DTEND:${event.endDate}`,
      `SUMMARY:${decodeURIComponent(event.title)}`,
      `DESCRIPTION:${decodeURIComponent(event.description)}`,
      `LOCATION:${decodeURIComponent(event.location)}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
    );
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
};

const downloadICSFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const ShowScheduleCalendar: React.FC<ShowScheduleCalendarProps> = ({
  event,
  showStartTime,
  showEndTime,
  schedules,
  error,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ShowSchedule | null>(
    null,
  );

  // Parse show times
  const showStart = new Date(showStartTime);
  const showEnd = new Date(showEndTime);

  // Get formatted time range for display
  const timeRange = formatTimeRange(showStartTime, showEndTime);
  const { startHour, endHour } = getShowTimeBoundaries(
    showStartTime,
    showEndTime,
  );

  // Transform schedules for FullCalendar
  const calendarEvents = schedules.map((schedule) => ({
    id: String(schedule.id),
    title: schedule.title,
    start: schedule.startTime,
    end: schedule.endTime,
    extendedProps: {
      description: schedule.description,
      scheduleId: schedule.id,
    },
  }));

  // Add effect to apply time range styling after calendar renders
  useEffect(() => {
    const timer = setTimeout(() => {
      applyTimeRangeStyling();
    }, 100);

    return () => clearTimeout(timer);
  }, [showStartTime, showEndTime]);

  // Function to apply time range styling
  const applyTimeRangeStyling = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    // Get all time slots
    const timeSlots = document.querySelectorAll('.fc-timegrid-slot');

    timeSlots.forEach((slot) => {
      const timeElement = slot.getAttribute('data-time');
      if (timeElement) {
        const slotTime = parseFloat(timeElement.replace(':', '.'));

        // Remove existing classes
        slot.classList.remove('outside-show-range', 'within-show-range');

        // Add appropriate class based on time range
        if (slotTime < startHour || slotTime > endHour) {
          slot.classList.add('outside-show-range');
        } else {
          slot.classList.add('within-show-range');
        }
      }
    });
  };

  // Handle event click to show details
  const handleEventClick = (clickInfo: EventClickArg) => {
    const scheduleId =
      clickInfo.event.extendedProps?.scheduleId || clickInfo.event.id;

    // Find the schedule using both original ID and string conversion
    let schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) {
      schedule = schedules.find((s) => String(s.id) === String(scheduleId));
    }

    if (schedule) {
      setSelectedSchedule(schedule);
      setModalOpen(true);
    }
  };

  // Export functions
  const exportSingleScheduleToGoogle = (schedule: ShowSchedule) => {
    const event = createCalendarEvent(schedule, 'Event Show');
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank');
  };

  const exportSingleScheduleToICS = (schedule: ShowSchedule) => {
    const icsContent = generateICSFile([schedule], 'Event Show');
    downloadICSFile(
      icsContent,
      `schedule-${schedule.title.replace(/[^a-zA-Z0-9]/g, '-')}`,
    );
  };

  const exportShowToGoogleCalendar = () => {
    const baseUrl =
      'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const url = `${baseUrl}&text=${event.eventName}&dates=${showStartTime}/${showEndTime}&details=${event.eventDescription}&location=${event.venueName}`;
    window.open(url, '_blank');
  };

  const exportAllSchedulesToICS = () => {
    const icsContent = generateICSFile(schedules, 'Event Show');
    downloadICSFile(icsContent, 'show-schedule');
  };

  if (error) {
    return <Text color="red">Error loading schedules: {error.message}</Text>;
  }

  return (
    <Stack gap={0} h="100%">
      {/* Show Information Card */}
      <Card
        className="schedule-info-card"
        radius={0}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}
      >
        <Group justify="space-between" align="flex-start">
          <Box>
            <Group gap="xs" mb="sm">
              <IconCalendar size={20} />
              <Title order={3} fw={600}>
                Show Schedule
              </Title>
            </Group>
            <Group gap="md">
              <Group gap="xs">
                <IconClock size={16} />
                <Text size="sm">{timeRange.date}</Text>
              </Group>
              <Badge variant="light" color="blue" size="lg">
                {timeRange.start} - {timeRange.end}
              </Badge>
            </Group>
          </Box>
          <Group gap="sm">
            <Badge variant="light" color="green" size="lg">
              {schedules.length}{' '}
              {schedules.length === 1 ? 'Schedule' : 'Schedules'}
            </Badge>

            {/* Export All Schedules Menu */}
            {schedules.length > 0 && (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    variant="white"
                    leftSection={<IconCalendarPlus size={16} />}
                    rightSection={<IconChevronDown size={14} />}
                    size="sm"
                  >
                    Add to Calendar
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Export All Schedules</Menu.Label>
                  <Menu.Item
                    leftSection={<IconCalendar size={14} />}
                    onClick={exportShowToGoogleCalendar}
                  >
                    Google Calendar
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconDownload size={14} />}
                    onClick={exportAllSchedulesToICS}
                  >
                    Download .ics file
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Compatible with</Menu.Label>
                  <Menu.Item disabled>
                    <Text size="xs" c="dimmed">
                      Apple Calendar, Outlook, etc.
                    </Text>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </Card>

      {/* Calendar */}
      <Box flex={1} style={{ overflow: 'hidden' }}>
        <Paper
          className="show-schedule-calendar"
          shadow="none"
          p={0}
          radius={0}
          h="100%"
        >
          <Box h="100%">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              initialView="timeGridWeek"
              dayMaxEvents={true}
              events={calendarEvents}
              editable={false}
              selectable={false}
              eventClick={handleEventClick}
              // Restrict time display to show time range with some padding
              slotMinTime={
                Math.max(0, startHour - 2)
                  .toString()
                  .padStart(2, '0') + ':00:00'
              }
              slotMaxTime={
                Math.min(24, endHour + 2)
                  .toString()
                  .padStart(2, '0') + ':00:00'
              }
              height="100%"
              // Restrict valid date range to show dates only
              validRange={{
                start: showStart,
                end: new Date(showEnd.getTime() + 24 * 60 * 60 * 1000), // Add one day to include end date
              }}
              // Enhanced styling
              eventColor="#667eea"
              eventTextColor="#ffffff"
              eventBorderColor="#5a67d8"
              // Enable more granular time selection
              slotDuration="00:15:00" // 15-minute slots
              slotLabelInterval="01:00"
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                meridiem: 'short',
              }}
              allDaySlot={false} // Hide all-day slot to focus on hourly scheduling
              nowIndicator={true} // Show current time indicator
              weekNumbers={false}
              businessHours={{
                // Highlight show time range as business hours
                startTime:
                  showStart.getHours().toString().padStart(2, '0') +
                  ':' +
                  showStart.getMinutes().toString().padStart(2, '0'),
                endTime:
                  showEnd.getHours().toString().padStart(2, '0') +
                  ':' +
                  showEnd.getMinutes().toString().padStart(2, '0'),
              }}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short',
              }}
              // Callback to apply custom styling after render
              datesSet={applyTimeRangeStyling}
              eventDidMount={applyTimeRangeStyling}
            />
          </Box>
        </Paper>
      </Box>

      {/* Schedule Details Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          <Group gap="xs">
            <IconCalendar size={20} />
            <Text size="lg" fw={600}>
              Schedule Details
            </Text>
          </Group>
        }
        size="md"
        centered
      >
        {selectedSchedule && (
          <Stack gap="md">
            {/* Title */}
            <Box>
              <Text size="xl" fw={700} mb="xs">
                {selectedSchedule.title}
              </Text>
            </Box>

            <Divider />

            {/* Time Information */}
            <Box>
              <Group gap="xs" mb="sm">
                <IconClock size={18} color="#667eea" />
                <Text fw={600} c="blue.7">
                  Schedule Time
                </Text>
              </Group>
              <Stack gap="xs" pl="md">
                <Group gap="md">
                  <Text size="sm" c="dimmed">
                    Start:
                  </Text>
                  <Badge variant="light" color="green" size="md">
                    {formatDate(
                      selectedSchedule.startTime,
                      'DD MMM YYYY HH:mm A',
                      'Asia/Bangkok',
                    )}
                  </Badge>
                </Group>
                <Group gap="md">
                  <Text size="sm" c="dimmed">
                    End:
                  </Text>
                  <Badge variant="light" color="red" size="md">
                    {formatDate(
                      selectedSchedule.endTime,
                      'DD MMM YYYY HH:mm A',
                      'Asia/Bangkok',
                    )}
                  </Badge>
                </Group>
                <Group gap="md">
                  <Text size="sm" c="dimmed">
                    Duration:
                  </Text>
                  <Text size="sm" fw={500}>
                    {Math.round(
                      (new Date(selectedSchedule.endTime).getTime() -
                        new Date(selectedSchedule.startTime).getTime()) /
                        (1000 * 60),
                    )}{' '}
                    minutes
                  </Text>
                </Group>
              </Stack>
            </Box>

            <Divider />

            {/* Description */}
            <Box>
              <Group gap="xs" mb="sm">
                <IconFileText size={18} color="#667eea" />
                <Text fw={600} c="blue.7">
                  Description
                </Text>
              </Group>
              <Paper p="md" bg="gray.0" radius="md">
                <Text size="sm" style={{ lineHeight: 1.6 }}>
                  {selectedSchedule.description ||
                    'No description provided for this schedule.'}
                </Text>
              </Paper>
            </Box>

            <Divider />

            {/* Export Actions */}
            <Box>
              <Group gap="xs" mb="sm">
                <IconCalendarPlus size={18} color="#667eea" />
                <Text fw={600} c="blue.7">
                  Add to Calendar
                </Text>
              </Group>
              <Group gap="sm">
                <Button
                  variant="light"
                  leftSection={<IconCalendar size={16} />}
                  onClick={() => exportSingleScheduleToGoogle(selectedSchedule)}
                  size="sm"
                >
                  Google Calendar
                </Button>
                <Button
                  variant="outline"
                  leftSection={<IconDownload size={16} />}
                  onClick={() => exportSingleScheduleToICS(selectedSchedule)}
                  size="sm"
                >
                  Download .ics
                </Button>
              </Group>
              <Text size="xs" c="dimmed" mt="xs">
                .ics files work with Apple Calendar, Outlook, and most calendar
                apps
              </Text>
            </Box>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};

export default ShowScheduleCalendar;
