export interface ShowSchedule {
  id: number;
  showId: number;
  eventId: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}
