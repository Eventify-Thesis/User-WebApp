import { useState, useCallback, useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import { ChatBotService, ChatBotResponse } from '@/services/chatbot.service';

export const useChatBot = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const chatBotService = useMemo(() => new ChatBotService(), []);

  const sendMessage = useCallback(
    async (
      message: string,
      language: string = 'en',
    ): Promise<ChatBotResponse> => {
      setIsLoading(true);
      try {
        const response = await chatBotService.processMessage(
          message,
          userId,
          language,
        );
        return response;
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to process your message. Please try again.',
          color: 'red',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [chatBotService, userId],
  );

  const sendVoiceMessage = useCallback(
    async (audioBlob: Blob): Promise<string> => {
      setIsLoading(true);
      try {
        // Ensure the blob is a WAV file
        if (!audioBlob.type.includes('wav')) {
          throw new Error('Only WAV audio format is supported');
        }

        // Create a File object with proper name and type
        const audioFile = new File([audioBlob], 'recording.wav', {
          type: 'audio/wav',
        });

        // Create FormData and append the file
        const formData = new FormData();
        formData.append('file', audioFile);

        const result = await chatBotService.processVoiceMessage(formData);
        return result;
      } catch (error) {
        notifications.show({
          title: 'Voice Recognition Error',
          message:
            error instanceof Error
              ? error.message
              : 'Could not process voice input. Please try again.',
          color: 'red',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [chatBotService],
  );

  return {
    sendMessage,
    sendVoiceMessage,
    isLoading,
  };
};
