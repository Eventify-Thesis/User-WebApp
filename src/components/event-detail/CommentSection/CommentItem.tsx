import React, { useState } from 'react';
import {
  Box,
  Text,
  Group,
  ActionIcon,
  Menu,
  Avatar,
  Stack,
  Collapse,
  Button,
  Alert,
  Paper,
} from '@mantine/core';
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconCornerDownLeft,
  IconAlertTriangle,
  IconHeart,
  IconHeartFilled,
} from '@tabler/icons-react';
import { Comment } from '@/api/commentApi';
import {
  useDeleteComment,
  useUpdateComment,
  useLikeComment,
} from '@/mutations/useCommentMutations';
import { RichTextCommentForm } from './RichTextCommentForm';
// import { EditCommentForm } from './EditCommentForm';
import { useUser } from '@clerk/clerk-react';

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  eventId: string;
  currentUserId?: string;
  isReply?: boolean;
}

// Helper function to get user display name
const getUserDisplayName = (
  comment: Comment,
  isCurrentUser: boolean,
  currentUserName?: string,
) => {
  if (isCurrentUser && currentUserName) {
    return currentUserName;
  }

  // Use backend-provided user details if available
  if (comment.userFirstName || comment.userLastName) {
    const firstName = comment.userFirstName || '';
    const lastName = comment.userLastName || '';
    return `${firstName} ${lastName}`.trim();
  }

  // Fallback to formatted user ID
  if (comment.userId.length > 8) {
    const prefix = comment.userId.substring(0, 4);
    const suffix = comment.userId.substring(comment.userId.length - 4);
    return `User ${prefix}...${suffix}`;
  }

  return `User ${comment.userId}`;
};

// Helper function to get user avatar initials
const getUserInitials = (
  comment: Comment,
  isCurrentUser: boolean,
  currentUserName?: string,
) => {
  if (isCurrentUser && currentUserName) {
    const names = currentUserName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUserName.substring(0, 2).toUpperCase();
  }

  // Use backend-provided user details if available
  if (comment.userFirstName || comment.userLastName) {
    const firstName = comment.userFirstName || '';
    const lastName = comment.userLastName || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return (firstName || lastName).substring(0, 2).toUpperCase();
  }

  return comment.userId.substring(0, 2).toUpperCase();
};

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replies,
  eventId,
  currentUserId,
  isReply = false,
}) => {
  const { user } = useUser();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteCommentMutation = useDeleteComment();
  const likeCommentMutation = useLikeComment();
  const isOwnComment = currentUserId === comment.userId;

  // Get current user's display name
  const currentUserDisplayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'You';

  const displayName = getUserDisplayName(
    comment,
    isOwnComment,
    currentUserDisplayName,
  );
  const avatarInitials = getUserInitials(
    comment,
    isOwnComment,
    currentUserDisplayName,
  );

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setDeleteError(null);
      try {
        await deleteCommentMutation.mutateAsync({
          eventId,
          commentId: comment.id,
        });
      } catch (err: any) {
        setDeleteError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to delete comment',
        );
      }
    }
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  const handleEditSuccess = () => {
    setShowEditForm(false);
  };

  const handleLike = async () => {
    try {
      await likeCommentMutation.mutateAsync({
        eventId,
        commentId: comment.id,
      });
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60),
      );

      if (diffInMinutes < 1) return 'just now';
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      if (diffInMinutes < 1440)
        return `${Math.floor(diffInMinutes / 60)} hours ago`;
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    } catch {
      return 'some time ago';
    }
  };

  return (
    <Box
      style={{
        marginLeft: isReply ? '32px' : '0',
      }}
    >
      <Paper
        p="lg"
        radius="lg"
        style={{
          background: isReply
            ? 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: isReply ? '1px solid #e2e8f0' : '1px solid #cbd5e1',
          borderLeft: isReply ? '4px solid #667eea' : '1px solid #cbd5e1',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow =
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }}
      >
        <Stack gap="md">
          {/* Comment Header */}
          <Group justify="space-between" align="flex-start">
            <Group gap="md">
              <Avatar
                size={isReply ? 32 : 40}
                radius="xl"
                src={comment.userImageUrl}
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  border: '2px solid #e2e8f0',
                }}
              >
                {avatarInitials}
              </Avatar>
              <Box>
                <Group gap="xs" align="center">
                  <Text size="sm" fw={600} c="#1e293b">
                    {displayName}
                  </Text>
                  {comment.isEdited && (
                    <Text
                      size="xs"
                      c="#64748b"
                      style={{
                        background: '#f1f5f9',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontStyle: 'italic',
                      }}
                    >
                      edited
                    </Text>
                  )}
                </Group>
                <Text size="xs" c="#64748b">
                  {formatDate(comment.createdAt)}
                </Text>
              </Box>
            </Group>

            {isOwnComment && (
              <Menu shadow="lg" width={180} position="bottom-end">
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    radius="lg"
                    style={{
                      color: '#64748b',
                      '&:hover': {
                        background: '#f1f5f9',
                        color: '#334155',
                      },
                    }}
                  >
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown style={{ border: '1px solid #e2e8f0' }}>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={() => setShowEditForm(true)}
                    style={{ color: '#475569' }}
                  >
                    Edit comment
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    color="red"
                    onClick={handleDelete}
                  >
                    Delete comment
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>

          {/* Error Message */}
          {deleteError && (
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
              {deleteError}
            </Alert>
          )}

          {/* Comment Content */}
          {showEditForm ? (
            <Box
              p="md"
              style={{
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <RichTextCommentForm
                eventId={eventId}
                parentId={comment.parentId ?? undefined}
                placeholder="Edit your comment..."
                onSubmitting={setIsSubmitting}
                isSubmitting={isSubmitting}
                onCancel={() => setShowEditForm(false)}
                onSuccess={handleEditSuccess}
                initialContent={comment.content}
                isEditing={true}
                commentId={comment.id}
              />
            </Box>
          ) : (
            <Box>
              <Box
                style={{
                  fontSize: '14px',
                  color: '#334155',
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
            </Box>
          )}

          {/* Action Buttons */}
          {!showEditForm && user && (
            <Group gap="xs">
              <Button
                variant="subtle"
                size="xs"
                radius="lg"
                leftSection={
                  comment.isLikedByCurrentUser ? (
                    <IconHeartFilled size={14} />
                  ) : (
                    <IconHeart size={14} />
                  )
                }
                onClick={handleLike}
                loading={likeCommentMutation.isPending}
                style={{
                  color: comment.isLikedByCurrentUser ? '#e11d48' : '#64748b',
                  background: comment.isLikedByCurrentUser
                    ? '#fef2f2'
                    : 'transparent',
                  border: comment.isLikedByCurrentUser
                    ? '1px solid #fecaca'
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '12px',
                  height: '28px',
                  padding: '4px 8px',
                }}
              >
                {comment.likeCount > 0 ? comment.likeCount : 'Like'}
              </Button>
              <Button
                variant="subtle"
                size="xs"
                radius="lg"
                leftSection={<IconCornerDownLeft size={14} />}
                onClick={() => setShowReplyForm(!showReplyForm)}
                style={{
                  color: '#64748b',
                  background: showReplyForm ? '#eff6ff' : 'transparent',
                  border: showReplyForm
                    ? '1px solid #dbeafe'
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                💬 Reply
              </Button>
            </Group>
          )}

          {/* Reply Form */}
          <Collapse in={showReplyForm}>
            <Box mt="md">
              <RichTextCommentForm
                eventId={eventId}
                parentId={comment.id}
                placeholder="Write your reply here..."
                onSubmitting={setIsSubmitting}
                isSubmitting={isSubmitting}
                onCancel={() => setShowReplyForm(false)}
                onSuccess={handleReplySuccess}
              />
            </Box>
          </Collapse>
        </Stack>
      </Paper>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <Stack gap="md" mt="md">
          <Text size="xs" c="blue" fw={500}>
            💬 {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </Text>
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              eventId={eventId}
              currentUserId={currentUserId}
              isReply={true}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};
