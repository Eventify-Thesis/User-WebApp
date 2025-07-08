import React from 'react';
import { Stack, Box, Text, Divider } from '@mantine/core';
import { Comment } from '@/api/commentApi';
import { CommentItem } from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  eventId: string;
  currentUserId?: string;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  eventId,
  currentUserId,
}) => {
  // Filter out replies (they will be shown within their parent comments)
  const rootComments = comments.filter((comment) => !comment.parentId);

  // Group replies by parent comment ID
  const repliesMap = comments.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) {
        acc[comment.parentId] = [];
      }
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {} as Record<number, Comment[]>);

  if (rootComments.length === 0) {
    return null;
  }

  return (
    <Box>
      <Stack gap="xl">
        {rootComments.map((comment, index) => (
          <Box key={comment.id}>
            <CommentItem
              comment={comment}
              replies={repliesMap[comment.id] || []}
              eventId={eventId}
              currentUserId={currentUserId}
            />

            {/* Add divider between comments (except for the last one) */}
            {index < rootComments.length - 1 && (
              <Divider
                mt="xl"
                color="#e2e8f0"
                variant="dashed"
                style={{ opacity: 0.6 }}
              />
            )}
          </Box>
        ))}
      </Stack>

      {/* Footer with some encouragement */}
      <Box
        mt="xl"
        p="md"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
        }}
      >
        <Text size="xs" c="#64748b" fw={500}>
          💭 Keep the conversation going! Share your thoughts and connect with
          fellow attendees.
        </Text>
      </Box>
    </Box>
  );
};
