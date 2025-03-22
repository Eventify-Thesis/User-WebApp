export default interface TicketModel {
    id: string;
    orderId: string; // orderId
    date: Date;
    status: string;
    ticketType: string;
    startTime: string; // "HH:mm" (24-hour format)
    endTime: string; // "HH:mm" (24-hour format)
    location: string;
    eventName: string;
    area: string;
    row: string;
    seat: string;
    qrCode: string;
}
