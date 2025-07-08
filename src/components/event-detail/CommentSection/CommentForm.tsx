import React, { useState } from 'react';
import {
  Textarea,
  Button,
  Stack,
  Alert,
  Box,
  Group,
  Avatar,
  Text,
  Paper,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconSend,
  IconAlertTriangle,
  IconMoodSmile,
} from '@tabler/icons-react';
import { useCreateComment } from '@/mutations/useCommentMutations';
import { useForm } from '@mantine/form';
import { useUser } from '@clerk/clerk-react';

interface CommentFormProps {
  eventId: string;
  parentId?: number;
  placeholder?: string;
  onSubmitting: (isSubmitting: boolean) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  eventId,
  parentId,
  placeholder = 'Share your thoughts about this event...',
  onSubmitting,
  isSubmitting,
  onCancel,
  onSuccess,
}) => {
  const { user } = useUser();
  const createCommentMutation = useCreateComment();
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm({
    initialValues: {
      content: '',
    },
    validate: {
      content: (value) =>
        value.trim().length < 1 ? 'Comment cannot be empty' : null,
    },
  });

  const handleSubmit = async (values: { content: string }) => {
    if (isSubmitting) return;

    setError(null);
    onSubmitting(true);

    try {
      await createCommentMutation.mutateAsync({
        eventId,
        data: {
          content: values.content.trim(),
          parentId,
        },
      });

      form.reset();
      setIsFocused(false);
      onSuccess?.();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to post comment',
      );
    } finally {
      onSubmitting(false);
    }
  };

  const isReply = !!parentId;
  const hasContent = form.values.content.trim().length > 0;

  return (
    <Paper
      p="lg"
      radius="xl"
      style={{
        background: isFocused
          ? 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          : '#ffffff',
        border: isFocused ? '2px solid #667eea' : '2px solid #e2e8f0',
        transition: 'all 0.2s ease',
        transform: isFocused ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isFocused
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* User Avatar and Input Row */}
          <Group gap="md" align="flex-start">
            <Avatar
              size={isReply ? 32 : 40}
              radius="xl"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                border: '2px solid #e2e8f0',
              }}
            >
              {user?.firstName && user?.lastName
                ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                : user?.firstName?.charAt(0) ||
                  user?.emailAddresses?.[0]?.emailAddress?.charAt(0) ||
                  'U'}
            </Avatar>

            <Box style={{ flex: 1 }}>
              <Textarea
                placeholder={placeholder}
                minRows={isReply ? 2 : 3}
                maxRows={8}
                autosize
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                styles={{
                  input: {
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    color: '#334155',
                    '&::placeholder': {
                      color: '#94a3b8',
                      fontStyle: 'italic',
                    },
                    '&:focus': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  },
                }}
                {...form.getInputProps('content')}
              />
            </Box>
          </Group>

          {/* Error Message */}
          {error && (
            <Alert
              icon={<IconAlertTriangle size="1rem" />}
              color="red"
              variant="light"
              radius="lg"
              styles={{
                root: {
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                },
                title: { color: '#dc2626' },
                message: { color: '#7f1d1d' },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Action Buttons - Only show when focused or has content */}
          {(isFocused || hasContent) && (
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <Tooltip label="Add emoji" position="top">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="md"
                    radius="lg"
                  >
                    <IconMoodSmile size={18} />
                  </ActionIcon>
                </Tooltip>

                <Text size="xs" c="dimmed">
                  {form.values.content.length}/1000
                </Text>
              </Group>

              <Group gap="xs">
                {onCancel && (
                  <Button
                    variant="subtle"
                    color="gray"
                    size="sm"
                    radius="lg"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="submit"
                  leftSection={<IconSend size={16} />}
                  loading={isSubmitting}
                  disabled={!hasContent}
                  size="sm"
                  radius="lg"
                  style={{
                    background: hasContent
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#e2e8f0',
                    border: 'none',
                    color: hasContent ? 'white' : '#94a3b8',
                    transition: 'all 0.2s ease',
                    transform: hasContent ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {isReply ? '💬 Reply' : '✨ Post Comment'}
                </Button>
              </Group>
            </Group>
          )}

          {/* Encouraging message for first-time commenting */}
          {!hasContent && !isFocused && !isReply && (
            <Box
              p="sm"
              style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
                borderRadius: '12px',
                border: '1px solid #dbeafe',
              }}
            >
              <Text size="xs" c="#3b82f6" ta="center" fw={500}>
                💡 Share your experience, ask questions, or connect with other
                attendees
              </Text>
            </Box>
          )}
        </Stack>
      </form>
    </Paper>
  );
};
