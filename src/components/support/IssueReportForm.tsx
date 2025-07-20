import React, { useState, useRef } from 'react';
import {
  Button,
  Select,
  TextInput,
  Stack,
  Group,
  Paper,
  Title,
  Text,
  Alert,
  Loader,
  FileInput,
  Image,
  SimpleGrid,
  CloseButton,
  Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import {
  IconAlertCircle,
  IconBug,
  IconSend,
  IconPhoto,
  IconX,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useCreateIssueReport } from '@/mutations/useIssueReportMutations';
import {
  IssueCategory,
  IssuePriority,
  issueReportApi,
  CreateIssueReportRequest,
} from '@/api/issueReportApi';
import { uploadFile } from '@/services/fileUpload.service';

interface IssueReportFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const IssueReportForm: React.FC<IssueReportFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { t } = useTranslation();
  const createIssueReportMutation = useCreateIssueReport();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<File[]>([]);

  const form = useForm({
    initialValues: {
      title: '',
      category: IssueCategory.OTHER,
      priority: IssuePriority.MEDIUM,
    },
    validate: {
      title: (value) =>
        value.trim().length === 0 ? t('issueReport.form.validation.titleRequired') : null,
      category: (value) => (!value ? t('issueReport.form.validation.categoryRequired') : null),
    },
  });

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
    ],
    content: '',
  });

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploadingImages(files);
    const urls: string[] = [];

    try {
      for (const file of files) {
        const url = await uploadFile(file);
        urls.push(url);
      }

      setUploadedImages((prev) => [...prev, ...urls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages([]);
    }
  };

  const handleImageRemove = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!editor) return;

    const description = editor.getHTML();
    if (!description.trim() || description === '<p></p>') {
      form.setFieldError('description', t('issueReport.form.validation.descriptionRequired'));
      return;
    }

    const formValidation = form.validate();
    if (formValidation.hasErrors) return;

    setIsSubmitting(true);

    try {
      const data: CreateIssueReportRequest = {
        title: form.values.title,
        description,
        category: form.values.category as IssueCategory,
        priority: form.values.priority as IssuePriority,
        imageUrls: uploadedImages,
      };

      await createIssueReportMutation.mutateAsync(data);

      // Reset form
      form.reset();
      editor.commands.clearContent();
      setUploadedImages([]);
      onSuccess?.();
    } catch (error) {
      // Error handling is done in the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = issueReportApi.getCategoryOptions();
  const priorityOptions = issueReportApi.getPriorityOptions();

  return (
    <Paper p="xl" radius="lg" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Stack gap="lg">
        {/* Header */}
        <Group gap="md" align="center">
          <IconBug size={28} style={{ color: '#667eea' }} />
          <div>
            <Title order={2} style={{ color: '#1e293b', margin: 0 }}>
              {t('issueReport.title')}
            </Title>
            <Text size="sm" style={{ color: '#64748b', margin: 0 }}>
              {t('issueReport.subtitle')}
            </Text>
          </div>
        </Group>

        {/* Info Alert */}
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          color="blue"
          variant="light"
          radius="lg"
        >
          <Text size="sm">
            <strong>{t('issueReport.beforeReporting')}</strong> {t('issueReport.reportingGuidance')}
          </Text>
        </Alert>

        <form onSubmit={form.onSubmit(() => handleSubmit())}>
          <Stack gap="md">
            {/* Title */}
            <TextInput
              label={t('issueReport.form.title')}
              placeholder={t('issueReport.form.titlePlaceholder')}
              required
              size="md"
              {...form.getInputProps('title')}
              styles={{
                label: { fontWeight: 600, color: '#374151' },
                input: { borderRadius: '8px' },
              }}
            />

            {/* Category and Priority */}
            <Group grow>
              <Select
                label={t('issueReport.form.category')}
                placeholder={t('issueReport.form.categoryPlaceholder')}
                data={categoryOptions}
                required
                size="md"
                {...form.getInputProps('category')}
                styles={{
                  label: { fontWeight: 600, color: '#374151' },
                  input: { borderRadius: '8px' },
                }}
              />
              <Select
                label={t('issueReport.form.priority')}
                placeholder={t('issueReport.form.priorityPlaceholder')}
                data={priorityOptions}
                size="md"
                {...form.getInputProps('priority')}
                styles={{
                  label: { fontWeight: 600, color: '#374151' },
                  input: { borderRadius: '8px' },
                }}
              />
            </Group>

            {/* Description */}
            <div>
              <Text size="sm" fw={600} mb="xs" style={{ color: '#374151' }}>
                {t('issueReport.form.description')} *
              </Text>
              <RichTextEditor
                editor={editor}
                styles={{
                  root: { borderRadius: '8px' },
                  toolbar: { borderRadius: '8px 8px 0 0' },
                  content: {
                    minHeight: '200px',
                    '&[contenteditable=true]': {
                      '&:empty:before': {
                        content: `'${t('issueReport.form.descriptionPlaceholder')}'`,
                        color: '#9ca3af',
                        position: 'absolute',
                        pointerEvents: 'none',
                      },
                    },
                  },
                }}
              >
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
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
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
              </RichTextEditor>
              {form.errors.description && (
                <Text size="xs" c="red" mt="xs">
                  {form.errors.description}
                </Text>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <Text size="sm" fw={600} mb="xs" style={{ color: '#374151' }}>
                {t('issueReport.form.images')}
              </Text>
              <FileInput
                label=""
                placeholder={t('issueReport.form.imagesPlaceholder')}
                leftSection={<IconPhoto size={16} />}
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImages.length > 0}
                styles={{
                  input: {
                    borderRadius: '8px',
                    minHeight: '50px',
                    border: '2px dashed #e2e8f0',
                    cursor: 'pointer',
                  },
                }}
              />
              {uploadingImages.length > 0 && (
                <Text size="xs" c="blue" mt="xs">
                  {t('issueReport.form.uploadingImages', { count: uploadingImages.length })}
                </Text>
              )}

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <Text size="sm" fw={500} mb="xs" style={{ color: '#374151' }}>
                    {t('issueReport.form.uploadedImages', { count: uploadedImages.length })}
                  </Text>
                  <SimpleGrid cols={3} spacing="sm">
                    {uploadedImages.map((url, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <Image
                          src={url}
                          alt={`Evidence ${index + 1}`}
                          height={120}
                          radius="md"
                          style={{ border: '1px solid #e2e8f0' }}
                        />
                        <CloseButton
                          size="sm"
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '50%',
                          }}
                          onClick={() => handleImageRemove(index)}
                        />
                      </div>
                    ))}
                  </SimpleGrid>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <Group justify="flex-end" mt="lg">
              {onCancel && (
                <Button
                  variant="subtle"
                  color="gray"
                  size="md"
                  radius="lg"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  {t('issueReport.form.cancel')}
                </Button>
              )}
              <Button
                type="submit"
                leftSection={
                  isSubmitting ? (
                    <Loader size="xs" color="white" />
                  ) : (
                    <IconSend size={16} />
                  )
                }
                loading={isSubmitting}
                size="md"
                radius="lg"
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                {t('issueReport.form.submit')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};
