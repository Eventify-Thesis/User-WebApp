import { httpApi } from './http.api';

export interface Comment {
  id: number;
  eventId: number;
  userId: string;
  parentId: number | null;
  content: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  // User display fields (populated by backend)
  userFirstName?: string;
  userLastName?: string;
  userImageUrl?: string;
  // Like-related fields
  likeCount: number;
  isLikedByCurrentUser?: boolean;
}

export interface CreateCommentRequest {
  content: string;
  parentId?: number;
}

export interface UpdateCommentRequest {
  content: string;
}

export const commentApi = {
  getComments: async (eventId: string): Promise<Comment[]> => {
    const response = await httpApi.get(`/events/${eventId}/comments`);
    return response.data.data.result;
  },

  createComment: async (
    eventId: string,
    data: CreateCommentRequest,
  ): Promise<Comment> => {
    const response = await httpApi.post(`/events/${eventId}/comments`, data);
    return response.data;
  },

  updateComment: async (
    eventId: string,
    commentId: number,
    data: UpdateCommentRequest,
  ): Promise<Comment> => {
    const response = await httpApi.put(
      `/events/${eventId}/comments/${commentId}`,
      data,
    );
    return response.data;
  },

  deleteComment: async (eventId: string, commentId: number): Promise<void> => {
    await httpApi.delete(`/events/${eventId}/comments/${commentId}`);
  },

  getComment: async (eventId: string, commentId: number): Promise<Comment> => {
    const response = await httpApi.get(
      `/events/${eventId}/comments/${commentId}`,
    );
    return response.data;
  },

  likeComment: async (eventId: string, commentId: number): Promise<Comment> => {
    const response = await httpApi.post(
      `/events/${eventId}/comments/${commentId}/like`,
    );
    return response.data;
  },
};
