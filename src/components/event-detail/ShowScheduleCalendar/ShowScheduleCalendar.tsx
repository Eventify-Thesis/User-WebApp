import React from 'react';
import './ShowScheduleCalendar.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { ShowSchedule } from '@/types/show-schedule';
import './ShowScheduleCalendar.css';

interface ShowScheduleCalendarProps {
  showStartTime: string;
  showEndTime: string;
  schedules: ShowSchedule[];
  error?: any;
}

const ShowScheduleCalendar: React.FC<ShowScheduleCalendarProps> = ({
  showStartTime,
  showEndTime,
  schedules,
  error,
}) => {
  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Error"
        color="red"
        variant="filled"
      >
        Failed to load schedules. Please try again later.
      </Alert>
    );
  }

  const events = schedules.map((schedule) => ({
    id: schedule.id,
    title: schedule.title,
    start: schedule.startTime,
    end: schedule.endTime,
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  }));

  return (
    <Box className="calendar-responsive" style={{ height: '600px' }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridDay"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        initialDate={showStartTime}
        validRange={{
          start: showStartTime,
          end: showEndTime,
        }}
        titleFormat={{
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }}
        eventColor="#000"
        eventTextColor="#000"
        height="100%"
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
      />
    </Box>
  );
};

export default ShowScheduleCalendar;
