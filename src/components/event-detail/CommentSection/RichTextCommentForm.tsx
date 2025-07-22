import React, { useState, useRef } from 'react';
import {
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
  LoadingOverlay,
} from '@mantine/core';
import {
  IconSend,
  IconAlertTriangle,
  IconPhoto,
  IconPencil,
} from '@tabler/icons-react';
import './RichTextCommentForm.css';
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import {
  useCreateComment,
  useUpdateComment,
} from '@/mutations/useCommentMutations';
import { useUser } from '@clerk/clerk-react';
import { uploadFile } from '@/services/fileUpload.service';

interface RichTextCommentFormProps {
  eventId: string;
  parentId?: number;
  placeholder?: string;
  onSubmitting: (isSubmitting: boolean) => void;
  isSubmitting: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
  initialContent?: string;
  isEditing?: boolean;
  commentId?: number;
}

export const RichTextCommentForm: React.FC<RichTextCommentFormProps> = ({
  eventId,
  parentId,
  placeholder = 'Share your thoughts about this event...',
  onSubmitting,
  isSubmitting,
  onCancel,
  onSuccess,
  initialContent = '',
  isEditing = false,
  commentId,
}) => {
  const { user } = useUser();
  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(isEditing || !!initialContent);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isImageUploadClicked, setIsImageUploadClicked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'prose-link',
        },
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'comment-image',
        },
      }),
    ],
    content: initialContent,
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  // Reset the image upload flag after a delay to handle file dialog cancellation
  React.useEffect(() => {
    if (isImageUploadClicked) {
      const timer = setTimeout(() => {
        setIsImageUploadClicked(false);
      }, 3000); // Reset after 3 seconds if no file is selected
      
      return () => clearTimeout(timer);
    }
  }, [isImageUploadClicked]);

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      setIsImageUploadClicked(false);
      return;
    }

    setIsUploadingImage(true);
    setIsImageUploadClicked(false);
    setError(null);

    try {
      // Keep editor focused and form visible during upload
      editor?.commands.focus();

      // Upload file using the service
      const publicUrl = await uploadFile(file);

      // Insert image using TipTap Image node and maintain focus
      if (editor) {
        editor
          .chain()
          .focus()
          .setImage({ 
            src: publicUrl, 
            alt: 'Uploaded image',
            title: 'Uploaded image'
          })
          .run();
      }

      // Reset file input and keep form focused
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      // Ensure editor stays focused after upload
      setTimeout(() => {
        editor?.commands.focus();
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || !editor) return;

    const content = editor.getHTML();
    if (!content.trim() || content === '<p></p>') {
      setError('Comment cannot be empty');
      return;
    }

    setError(null);
    onSubmitting(true);

    try {
      if (isEditing && commentId) {
        await updateCommentMutation.mutateAsync({
          eventId,
          commentId,
          data: {
            content,
          },
        });
      } else {
        await createCommentMutation.mutateAsync({
          eventId,
          data: {
            content,
            parentId,
          },
        });
      }

      if (!isEditing) {
        editor.commands.clearContent();
        setIsFocused(false);
      }
      onSuccess?.();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || isEditing
          ? 'Failed to update comment'
          : 'Failed to post comment',
      );
    } finally {
      onSubmitting(false);
    }
  };

  const isReply = !!parentId;
  const hasContent = (editor?.getText()?.trim().length ?? 0) > 0;

  return (
    <Paper
      p="lg"
      radius="xl"
      pos="relative"
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
      <LoadingOverlay visible={isUploadingImage} />

      <Stack gap="md">
        {/* User Avatar and Editor Row */}
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
            {/* Placeholder when not focused */}
            {!isFocused && !hasContent && (
              <Box
                onClick={() => {
                  setIsFocused(true);
                  editor?.commands.focus();
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'text',
                  transition: 'all 0.2s ease',
                  minHeight: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                className="comment-placeholder"
              >
                <IconPencil size={16} style={{ color: '#94a3b8' }} />
                <Text
                  size="sm"
                  style={{
                    color: '#64748b',
                    fontStyle: 'italic',
                  }}
                >
                  {placeholder}
                </Text>
              </Box>
            )}

            {/* Rich text editor when focused or has content */}
            {(isFocused || hasContent) && (
              <div
                className="rich-text-editor"
                style={
                  {
                    '--placeholder-text': `"${placeholder}"`,
                  } as React.CSSProperties
                }
              >
                <RichTextEditor
                  editor={editor}
                  styles={{
                    toolbar: {
                      display:
                        isFocused || hasContent || isUploadingImage
                          ? 'flex'
                          : 'none',
                    },
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={(e) => {
                    // Don't collapse if clicking on toolbar, during upload, or image upload was just clicked
                    if (
                      !isUploadingImage &&
                      !isImageUploadClicked &&
                      !e.relatedTarget?.closest(
                        '.mantine-RichTextEditor-toolbar',
                      )
                    ) {
                      setIsFocused(false);
                    }
                  }}
                >
                  <RichTextEditor.Toolbar
                    sticky
                    stickyOffset={60}
                    onMouseDown={(e) => {
                      // Prevent toolbar clicks from blurring the editor
                      e.preventDefault();
                    }}
                  >
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Strikethrough />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Blockquote />
                      <RichTextEditor.Hr />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e.target.files?.[0] || null)
                        }
                        style={{ display: 'none' }}
                      />
                      <Tooltip label="Upload image">
                        <ActionIcon
                          variant="subtle"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsImageUploadClicked(true);
                            fileInputRef.current?.click();
                            // Keep the editor focused
                            setTimeout(() => {
                              editor?.commands.focus();
                            }, 0);
                          }}
                          loading={isUploadingImage}
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent focus loss
                          }}
                        >
                          <IconPhoto size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  <RichTextEditor.Content />
                </RichTextEditor>
              </div>
            )}
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
          <Group justify="flex-end" align="center">
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
                leftSection={<IconSend size={16} />}
                loading={isSubmitting}
                disabled={!hasContent}
                size="sm"
                radius="lg"
                onClick={handleSubmit}
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
                {isEditing
                  ? '💾 Update Comment'
                  : isReply
                  ? '💬 Reply'
                  : '✨ Post Comment'}
              </Button>
            </Group>
          </Group>
        )}
      </Stack>
    </Paper>
  );
};
