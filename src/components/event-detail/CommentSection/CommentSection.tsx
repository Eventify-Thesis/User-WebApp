import React, { useState } from 'react';
import {
  Paper,
  Title,
  Stack,
  LoadingOverlay,
  Alert,
  Text,
  Box,
  Group,
  Badge,
  Divider,
  Center,
  ThemeIcon,
} from '@mantine/core';
import {
  IconMessage2,
  IconAlertTriangle,
  IconMessageCircle,
} from '@tabler/icons-react';
import { useGetComments } from '@/queries/useGetComments';
import { CommentList } from './CommentList';
import { RichTextCommentForm } from './RichTextCommentForm';
import { useUser } from '@clerk/clerk-react';

interface CommentSectionProps {
  eventId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ eventId }) => {
  const { user, isLoaded } = useUser();
  const { data: comments, isLoading, error } = useGetComments(eventId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <Paper
        p="xl"
        radius="lg"
        pos="relative"
        h={400}
        style={{
          background: 'linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%)',
          border: '1px solid #e9ecef',
        }}
      >
        <LoadingOverlay
          visible={true}
          overlayProps={{
            radius: 'lg',
            backgroundOpacity: 0.85,
            color: '#f8f9fc',
          }}
        />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        p="xl"
        radius="lg"
        style={{
          background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
          border: '1px solid #fecaca',
        }}
      >
        <Alert
          icon={<IconAlertTriangle size="1.2rem" />}
          title="Unable to load comments"
          color="red"
          variant="light"
          radius="md"
          styles={{
            root: { backgroundColor: 'transparent', border: 'none' },
            title: { color: '#dc2626', fontWeight: 600 },
            message: { color: '#7f1d1d' },
          }}
        >
          Failed to load comments. Please try again later.
        </Alert>
      </Paper>
    );
  }

  const commentCount = comments?.length || 0;

  return (
    <Paper
      p={0}
      radius="lg"
      style={{
        background: 'linear-gradient(135deg, #f8f9fc 0%, #ffffff 100%)',
        border: '1px solid #e9ecef',
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <Box
        p="xl"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Group justify="space-between" align="center">
          <Group gap="md">
            <ThemeIcon
              size={48}
              radius="lg"
              color="rgba(255, 255, 255, 0.2)"
              style={{ border: '2px solid rgba(255, 255, 255, 0.3)' }}
            >
              <IconMessage2 size={24} color="white" />
            </ThemeIcon>
            <Box>
              <Title order={2} c="white" fw={700}>
                Discussion
              </Title>
              <Text c="rgba(255, 255, 255, 0.8)" size="sm">
                Join the conversation about this event
              </Text>
            </Box>
          </Group>

          <Badge
            size="lg"
            variant="light"
            color="white"
            radius="lg"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
          </Badge>
        </Group>
      </Box>

      {/* Content Section */}
      <Box p="xl" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        <Stack gap="xl">
          {/* Comment Form */}
          {isLoaded && user ? (
            <Box>
              <RichTextCommentForm
                eventId={eventId}
                onSubmitting={setIsSubmitting}
                isSubmitting={isSubmitting}
              />
            </Box>
          ) : (
            <Alert
              variant="light"
              color="blue"
              radius="lg"
              icon={<IconMessageCircle size="1.2rem" />}
              styles={{
                root: {
                  backgroundColor: '#eff6ff',
                  border: '1px solid #dbeafe',
                },
                title: { color: '#1e40af' },
                message: { color: '#1e3a8a' },
              }}
            >
              <Text fw={500}>Please sign in to join the discussion</Text>
              <Text size="sm" c="dimmed" mt={4}>
                Share your thoughts and connect with other attendees
              </Text>
            </Alert>
          )}

          {/* Divider */}
          {isLoaded && user && commentCount > 0 && (
            <Divider
              label={
                <Text size="sm" fw={500} c="dimmed">
                  {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                </Text>
              }
              labelPosition="center"
              color="#e9ecef"
            />
          )}

          {/* Comments List */}
          {comments && comments.length > 0 ? (
            <CommentList
              comments={comments}
              eventId={eventId}
              currentUserId={user?.id}
            />
          ) : (
            <Center py={60}>
              <Stack align="center" gap="md">
                <ThemeIcon
                  size={64}
                  radius="lg"
                  color="gray.1"
                  style={{ border: '2px dashed #d1d5db' }}
                >
                  <IconMessageCircle size={32} color="#9ca3af" />
                </ThemeIcon>
                <Box ta="center">
                  <Text fw={600} c="#374151" size="lg" mb={4}>
                    No comments yet
                  </Text>
                  <Text c="#6b7280" size="sm">
                    Be the first to share your thoughts about this event
                  </Text>
                </Box>
              </Stack>
            </Center>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};
