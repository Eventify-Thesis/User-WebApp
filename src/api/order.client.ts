import { httpApi } from '@/api/http.api';
import OrderModel from '@/domain/OrderModel';
import { IdParam } from '@/types/types';
import { mockOrders } from '@/mocks/orderHistory';

export const orderClient = {
  /** Function to get orders of userId by status and timeframe */
  getUserOrders: async (
    userId: IdParam,
    status: string,
    timeframe: 'UPCOMING' | 'PAST',
  ): Promise<OrderModel[]> => {
    const now = new Date(); // Current time
    const normalizedStatus = status.toLowerCase();

    return mockOrders.filter((order) => {
      if (order.userId !== userId) {
        return false;
      }

      // If status is "all", include all orders
      if (
        normalizedStatus !== 'all' &&
        order.orderStatus.toLowerCase() !== normalizedStatus
      ) {
        return false;
      }

      const eventDate = new Date(order.date);
      const [startHour, startMinute] = order.startTime.split(':').map(Number);
      eventDate.setHours(startHour, startMinute, 0, 0); // Set start time to event date

      const isPast = eventDate < now;
      return timeframe === 'PAST' ? isPast : !isPast;
    });

    // When API is implemented, use this:
    // const response = await httpApi.get<any>(`/users/${userId}/orders?status=${status}&timeframe=${timeframe}`);
    // return response.data.data;
  },

  /** Function to get a specific order by orderId **/
  getOrderById: async (orderId: IdParam): Promise<OrderModel | null> => {
    const order = mockOrders.find((order) => order.id === orderId);
    return order || null;

    // When API is implemented, use this:
    // const response = await httpApi.get<any>(`/orders/${orderId}`);
    // return response.data.data;
  },
};
