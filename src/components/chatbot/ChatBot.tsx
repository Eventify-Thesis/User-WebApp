import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextInput,
  ActionIcon,
  Stack,
  Text,
  Group,
  Avatar,
  ScrollArea,
  Transition,
  Affix,
  Tooltip,
  Badge,
  Loader,
  Button,
  Select,
  Card,
  Image,
  Center,
  List,
  ThemeIcon,
} from '@mantine/core';
import {
  IconSend,
  IconMicrophone,
  IconMicrophoneOff,
  IconMessageChatbot,
  IconX,
  IconUser,
  IconLanguage,
  IconCalendar,
  IconMapPin,
  IconTag,
  IconExternalLink,
  IconPoint,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useChatBot } from '../../hooks/useChatBot';
import styles from './ChatBot.module.css';
import { useUser } from '@clerk/clerk-react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { EventResult } from '@/api/chat.client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
  suggestions?: string[];
  searchResults?: any[];
  hasSearchResults?: boolean;
}

interface ChatBotProps {
  onSearch?: (query: string) => void;
}

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

// Language-specific messages
const getLanguageMessages = (language: string) => {
  const messages = {
    en: {
      greeting:
        'Hello! I can help you find events. Try asking me something like "What events are happening this weekend?" or use voice search!',
      suggestions: [
        'Free events this weekend',
        'Music concerts',
        'Food festivals',
        'Events in Hanoi',
      ],
      typing: 'Typing...',
      placeholder: 'Ask about events...',
      voiceTooltip: 'Voice search',
      stopRecording: 'Stop recording',
      online: 'Online',
      changeLanguage: 'Change Language',
      speechRecognized: 'Speech recognized',
      foundEvents: 'Found',
      events: 'events',
      moreEvents: 'more events',
      errorMessage: 'Sorry, I encountered an error. Please try again.',
      voiceError: 'Could not access microphone. Please check permissions.',
      processingError: 'Failed to process audio. Please try again.',
    },
    vi: {
      greeting:
        'Xin chào! Tôi có thể giúp bạn tìm kiếm sự kiện. Hãy thử hỏi tôi như "Có sự kiện gì diễn ra cuối tuần này?" hoặc sử dụng tìm kiếm bằng giọng nói!',
      suggestions: [
        'Sự kiện miễn phí cuối tuần',
        'Hòa nhạc',
        'Lễ hội ẩm thực',
        'Sự kiện ở Hà Nội',
      ],
      typing: 'Đang nhập...',
      placeholder: 'Hỏi về sự kiện...',
      voiceTooltip: 'Tìm kiếm bằng giọng nói',
      stopRecording: 'Dừng ghi âm',
      online: 'Trực tuyến',
      changeLanguage: 'Đổi ngôn ngữ',
      speechRecognized: 'Đã nhận dạng giọng nói',
      foundEvents: 'Tìm thấy',
      events: 'sự kiện',
      moreEvents: 'sự kiện khác',
      errorMessage: 'Xin lỗi, tôi gặp lỗi. Vui lòng thử lại.',
      voiceError: 'Không thể truy cập microphone. Vui lòng kiểm tra quyền.',
      processingError: 'Không thể xử lý âm thanh. Vui lòng thử lại.',
    },
  };
  return messages[language as keyof typeof messages] || messages.en;
};

// Format inline markdown (bold, italic)
const formatInlineMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let partIndex = 0;

  // Handle bold text **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the bold part
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText) {
        parts.push(<span key={`text-${partIndex++}`}>{beforeText}</span>);
      }
    }

    // Add bold text
    parts.push(
      <Text key={`bold-${partIndex++}`} component="span" fw={700}>
        {match[1]}
      </Text>,
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      parts.push(<span key={`text-${partIndex++}`}>{remainingText}</span>);
    }
  }

  return parts.length > 0 ? parts : [text];
};

// Add markdown parsing function
const parseMarkdownText = (text: string) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      elements.push(<br key={`br-${index}`} />);
      return;
    }

    // Handle bullet points
    if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
      const bulletText = trimmedLine.substring(1).trim();
      const formattedText = formatInlineMarkdown(bulletText);

      elements.push(
        <List.Item
          key={`bullet-${index}`}
          icon={
            <ThemeIcon size={16} radius="xl" variant="light">
              <IconPoint size={12} />
            </ThemeIcon>
          }
        >
          <Text size="sm">{formattedText}</Text>
        </List.Item>,
      );
    } else {
      // Handle regular text with inline formatting
      const formattedText = formatInlineMarkdown(trimmedLine);
      elements.push(
        <Text key={`text-${index}`} size="sm" mb="xs">
          {formattedText}
        </Text>,
      );
    }
  });

  // Wrap bullet points in List component
  const processedElements: React.ReactNode[] = [];
  let bulletItems: React.ReactNode[] = [];

  elements.forEach((element, index) => {
    if (React.isValidElement(element) && element.type === List.Item) {
      bulletItems.push(element);
    } else {
      if (bulletItems.length > 0) {
        processedElements.push(
          <List key={`list-${index}`} spacing="xs" size="sm" withPadding>
            {bulletItems}
          </List>,
        );
        bulletItems = [];
      }
      processedElements.push(element);
    }
  });

  // Handle remaining bullet items
  if (bulletItems.length > 0) {
    processedElements.push(
      <List key="list-final" spacing="xs" size="sm" withPadding>
        {bulletItems}
      </List>,
    );
  }

  return processedElements;
};

export const ChatBot: React.FC<ChatBotProps> = ({ onSearch }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [opened, { toggle, close }] = useDisclosure(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { sendMessage, sendVoiceMessage, isLoading } = useChatBot(user?.id);

  // Get current language messages
  const langMessages = getLanguageMessages(selectedLanguage);

  // Initialize messages when component mounts or language changes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: langMessages.greeting,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: langMessages.suggestions,
      },
    ]);
  }, [selectedLanguage]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (
    text: string,
    sender: 'user' | 'bot',
    suggestions?: string[],
    searchResults?: any[],
    hasSearchResults?: boolean,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      suggestions,
      searchResults,
      hasSearchResults,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleEventClick = (event: EventResult) => {
    navigate(`${event.url}-${event.id}`);
    close(); // Close the chat when navigating
  };

  const formatEventDate = (dateString: string) => {
    if (!dateString) return 'Date TBA';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Date TBA';
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const userMessage = messageText || inputValue.trim();
    if (!userMessage || isSending) return;

    setInputValue('');
    setIsSending(true);
    addMessage(userMessage, 'user');

    // Show typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await sendMessage(userMessage, selectedLanguage);

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));

      // Add bot response
      addMessage(
        response.text,
        'bot',
        response.suggestions,
        response.searchResults,
        response.hasSearchResults,
      );

      // Trigger search if callback provided and we have a search query (but no search results in chat)
      if (onSearch && response.searchQuery && !response.hasSearchResults) {
        onSearch(response.searchQuery);
      }
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));
      addMessage(langMessages.errorMessage, 'bot');
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000, // Request 16kHz directly
        },
      });

      // Check supported MIME types
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      // Create MediaRecorder with specific MIME type and settings
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 256000,
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });

        let audioContext: AudioContext | null = null;
        try {
          // Convert to WAV format
          audioContext = new AudioContext({
            sampleRate: 16000, // Force 16kHz context
          });
          const arrayBuffer = await audioBlob.arrayBuffer();

          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // Create WAV file
          const wavBlob = await convertToWav(audioBuffer);

          if (wavBlob.size < 44) {
            throw new Error('Generated WAV file is too small');
          }

          const transcribedText = await sendVoiceMessage(wavBlob);
          if (transcribedText && transcribedText.trim()) {
            // Auto-fill the input field with transcribed text
            setInputValue(transcribedText.trim());
            // Show a brief notification
            notifications.show({
              title: langMessages.speechRecognized,
              message: `"${transcribedText.trim()}"`,
              color: 'blue',
              autoClose: 3000,
            });
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          notifications.show({
            title: 'Error',
            message: langMessages.processingError,
            color: 'red',
          });
        } finally {
          stream.getTracks().forEach((track) => track.stop());
          audioContext?.close();
        }
      };

      // Request data every 100ms
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access error:', error);
      notifications.show({
        title: 'Error',
        message: langMessages.voiceError,
        color: 'red',
      });
    }
  };

  // Helper function to convert AudioBuffer to WAV format
  const convertToWav = async (audioBuffer: AudioBuffer): Promise<Blob> => {
    const numChannels = 1; // Mono
    const sampleRate = audioBuffer.sampleRate; // Use the actual sample rate
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = audioBuffer.length * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // RIFF chunk length
    view.setUint32(4, 36 + dataSize, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, format, true);
    // channel count
    view.setUint16(22, numChannels, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, byteRate, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, blockAlign, true);
    // bits per sample
    view.setUint16(34, bitDepth, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, dataSize, true);

    // Write the PCM samples
    const offset = 44;
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < channelData.length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      const value = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset + i * 2, value, true);
    }

    const wavBlob = new Blob([buffer], { type: 'audio/wav' });

    return wavBlob;
  };

  // Helper function to write strings to DataView
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={!opened}>
          {(transitionStyles) => (
            <Tooltip label="Chat with AI Assistant" position="left">
              <ActionIcon
                size={60}
                radius="xl"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                className={styles.chatToggle}
                style={transitionStyles}
                onClick={toggle}
              >
                <IconMessageChatbot size={30} />
              </ActionIcon>
            </Tooltip>
          )}
        </Transition>
      </Affix>

      {/* Chat Window */}
      <Transition transition="slide-up" mounted={opened}>
        {(transitionStyles) => (
          <Affix position={{ bottom: 20, right: 20 }}>
            <Paper
              shadow="xl"
              radius="lg"
              className={styles.chatWindow}
              style={{
                ...transitionStyles,
                width: 420,
                height: 650,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <Group
                justify="space-between"
                p="md"
                style={{ borderBottom: '1px solid #e9ecef' }}
              >
                <Group>
                  <Avatar
                    size="sm"
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                  >
                    <IconMessageChatbot size={16} />
                  </Avatar>
                  <div>
                    <Text size="sm" fw={600}>
                      AI Event Assistant
                    </Text>
                    <Badge size="xs" variant="light" color="green">
                      {langMessages.online}
                    </Badge>
                  </div>
                </Group>
                <Group gap="xs">
                  <Tooltip label={langMessages.changeLanguage}>
                    <Select
                      size="xs"
                      data={LANGUAGES}
                      value={selectedLanguage}
                      onChange={(value) => setSelectedLanguage(value || 'en')}
                      leftSection={<IconLanguage size={14} />}
                      style={{ width: 120 }}
                      comboboxProps={{ withinPortal: false }}
                    />
                  </Tooltip>
                  <ActionIcon variant="subtle" onClick={close}>
                    <IconX size={16} />
                  </ActionIcon>
                </Group>
              </Group>

              {/* Messages */}
              <ScrollArea
                flex={1}
                p="md"
                ref={scrollAreaRef}
                style={{ maxHeight: 450 }}
              >
                <Stack gap="md">
                  {messages.map((message) => (
                    <div key={message.id}>
                      <Group
                        align="flex-start"
                        justify={
                          message.sender === 'user' ? 'flex-end' : 'flex-start'
                        }
                      >
                        {message.sender === 'bot' && (
                          <Avatar
                            size="sm"
                            radius="xl"
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'cyan' }}
                          >
                            <IconMessageChatbot size={12} />
                          </Avatar>
                        )}

                        <Box
                          style={{
                            maxWidth: '80%',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            backgroundColor:
                              message.sender === 'user' ? '#228be6' : '#f1f3f4',
                            color:
                              message.sender === 'user' ? 'white' : 'black',
                          }}
                        >
                          {message.isTyping ? (
                            <Group gap="xs">
                              <Loader size="xs" />
                              <Text size="sm">{langMessages.typing}</Text>
                            </Group>
                          ) : (
                            <>
                              {parseMarkdownText(message.text)}
                              {message.hasSearchResults &&
                                message.searchResults &&
                                message.searchResults.length > 0 && (
                                  <Box mt="md">
                                    <Text size="xs" c="dimmed" mb="sm" fw={500}>
                                      {langMessages.foundEvents}{' '}
                                      {message.searchResults.length}{' '}
                                      {langMessages.events}:
                                    </Text>
                                    <Stack gap="sm">
                                      {message.searchResults
                                        .slice(0, 3)
                                        .map((event, index) => (
                                          <Card
                                            key={index}
                                            padding="sm"
                                            radius="md"
                                            withBorder
                                            style={{
                                              cursor: 'pointer',
                                              transition: 'all 0.2s ease',
                                              backgroundColor: '#ffffff',
                                            }}
                                            onClick={() =>
                                              handleEventClick(event)
                                            }
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.transform =
                                                'translateY(-2px)';
                                              e.currentTarget.style.boxShadow =
                                                '0 4px 12px rgba(0,0,0,0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.transform =
                                                'translateY(0)';
                                              e.currentTarget.style.boxShadow =
                                                '';
                                            }}
                                          >
                                            <Group gap="sm" align="flex-start">
                                              {event.eventLogoUrl && (
                                                <Image
                                                  src={event.eventLogoUrl}
                                                  alt={event.title}
                                                  width={50}
                                                  height={50}
                                                  radius="md"
                                                  fit="cover"
                                                />
                                              )}
                                              <Box flex={1}>
                                                <Group
                                                  justify="space-between"
                                                  align="flex-start"
                                                >
                                                  <Text
                                                    size="sm"
                                                    fw={600}
                                                    lineClamp={2}
                                                    style={{ color: '#1c7ed6' }}
                                                  >
                                                    {event.title}
                                                  </Text>
                                                  <ActionIcon
                                                    size="xs"
                                                    variant="subtle"
                                                    color="gray"
                                                  >
                                                    <IconExternalLink
                                                      size={12}
                                                    />
                                                  </ActionIcon>
                                                </Group>

                                                <Stack gap={4} mt="xs">
                                                  <Group gap="xs">
                                                    <IconCalendar
                                                      size={12}
                                                      color="#666"
                                                    />
                                                    <Text size="xs" c="dimmed">
                                                      {formatEventDate(
                                                        event.start_time ||
                                                          event.startTime,
                                                      )}
                                                    </Text>
                                                  </Group>

                                                  <Group gap="xs">
                                                    <IconMapPin
                                                      size={12}
                                                      color="#666"
                                                    />
                                                    <Text
                                                      size="xs"
                                                      c="dimmed"
                                                      lineClamp={1}
                                                    >
                                                      {event.city ||
                                                        'Location TBA'}
                                                    </Text>
                                                  </Group>

                                                  {event.category && (
                                                    <Group gap="xs">
                                                      <IconTag
                                                        size={12}
                                                        color="#666"
                                                      />
                                                      <Badge
                                                        size="xs"
                                                        variant="light"
                                                        color="blue"
                                                      >
                                                        {event.category}
                                                      </Badge>
                                                    </Group>
                                                  )}
                                                </Stack>
                                              </Box>
                                            </Group>
                                          </Card>
                                        ))}
                                      {message.searchResults.length > 3 && (
                                        <Center>
                                          <Text
                                            size="xs"
                                            c="dimmed"
                                            ta="center"
                                          >
                                            +{message.searchResults.length - 3}{' '}
                                            {langMessages.moreEvents}
                                          </Text>
                                        </Center>
                                      )}
                                    </Stack>
                                  </Box>
                                )}
                            </>
                          )}
                        </Box>

                        {message.sender === 'user' && (
                          <Avatar size="sm" radius="xl" color="gray">
                            <IconUser size={12} />
                          </Avatar>
                        )}
                      </Group>

                      {/* Suggestions */}
                      {message.sender === 'bot' &&
                        message.suggestions &&
                        !message.isTyping && (
                          <Box mt="xs" ml={message.sender === 'bot' ? 40 : 0}>
                            <Group gap="xs">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  size="xs"
                                  variant="light"
                                  onClick={() =>
                                    handleSuggestionClick(suggestion)
                                  }
                                  disabled={isSending}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </Group>
                          </Box>
                        )}
                    </div>
                  ))}
                </Stack>
              </ScrollArea>

              {/* Input */}
              <Box p="md" style={{ borderTop: '1px solid #e9ecef' }}>
                <Group gap="xs">
                  <TextInput
                    flex={1}
                    placeholder={langMessages.placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading || isSending}
                    rightSection={isSending ? <Loader size="xs" /> : null}
                  />
                  <Tooltip
                    label={
                      isRecording
                        ? langMessages.stopRecording
                        : langMessages.voiceTooltip
                    }
                  >
                    <ActionIcon
                      variant={isRecording ? 'filled' : 'light'}
                      color={isRecording ? 'red' : 'blue'}
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isLoading || isSending}
                    >
                      {isRecording ? (
                        <IconMicrophoneOff size={16} />
                      ) : (
                        <IconMicrophone size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                  <ActionIcon
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading || isSending}
                    loading={isSending}
                  >
                    <IconSend size={16} />
                  </ActionIcon>
                </Group>
              </Box>
            </Paper>
          </Affix>
        )}
      </Transition>
    </>
  );
};
