import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Text,
  Paper,
  Group,
  Box,
  Stack,
  Progress,
  SimpleGrid,
  RingProgress,
  Badge,
  useMantineTheme,
  Button,
  Loader,
} from '@mantine/core';
import { keyframes } from '@emotion/react';
import { createStyles } from '@mantine/styles';
import { notifications } from '@mantine/notifications';
import {
  IconClock,
  IconCheck,
  IconX,
  IconArrowRight,
  IconPointFilled,
  IconTrophy,
  IconPodium,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
// import { QuizAnswer } from '@/domain/QuizModel';
// import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import { useUser } from '@clerk/clerk-react';
import { LeaderboardModal } from '@/components/quiz/LeaderboardModal';
import { io, Socket } from 'socket.io-client';
import { showSuccess } from '@/utils/notifications';
import { notification } from 'antd';

const bounce = keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-15px)' },
});

// Create styles for components
const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
    padding: theme.spacing.xl,
    backgroundImage: 'linear-gradient(120deg, #1E2A78 0%, #3556DD 100%)',
    backgroundSize: 'cover',
    color: theme.white,
  },
  header: {
    marginBottom: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    margin: `${theme.spacing.xs}px 0`,
  },
  timerContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  questionCard: {
    backgroundColor: theme.colors.blue[7],
    color: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.lg,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    fontSize: '1.8rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  answerOption: {
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    height: '100%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    boxShadow: theme.shadows.md,
    color: theme.white,
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  selectedOption: {
    border: `4px solid ${theme.white}`,
    transform: 'scale(1.02)',
  },
  correctOption: {
    border: `4px solid ${theme.colors.green[5]}`,
    animation: `${bounce} 0.5s ease 1`,
  },
  incorrectOption: {
    opacity: 0.7,
  },
  answerText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 600,
    color: theme.white,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  resultIcon: {
    marginTop: theme.spacing.md,
  },
  footer: {
    marginTop: theme.spacing.xl,
  },
  timer: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1,
    textAlign: 'center',
  },
  progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  correct: {
    color: theme.colors.green[5],
    fontWeight: 700,
    fontSize: '1.2rem',
  },
  incorrect: {
    color: theme.colors.red[5],
    fontWeight: 700,
    fontSize: '1.2rem',
  },
  resultModal: {
    textAlign: 'center',
  },
  resultScore: {
    fontSize: '4rem',
    fontWeight: 800,
    color: theme.colors.yellow[4],
    margin: `${theme.spacing.xl}px 0`,
  },
  resultStatsItem: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.fn.rgba(theme.white, 0.1),
  },
}));

// Define answer option colors (Kahoot-like)
const ANSWER_COLORS = ['red', 'blue', 'yellow', 'green'];
const ANSWER_ICONS = [
  <IconPointFilled size={24} />,
  <IconPointFilled size={24} />,
  <IconPointFilled size={24} />,
  <IconPointFilled size={24} />,
];

interface Question {
  id: number;
  text: string;
  options: { id: number; text: string }[];
  correctOption: number;
  timeLimit?: number;
  explanation?: string;
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
  passingScore: number;
}

const Container2 = styled.div`
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background-color: #1e2a78;
  color: white;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

export function QuizPlayPage() {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  // State
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswerResult, setShowAnswerResult] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'
  >('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [question, setQuestion] = useState<Question | null>(null);

  const [isCorrect, setIsCorrect] = useState(false);
  const [quizEnded, setQuizEnded] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  // State to track if the timer is running
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Socket connection
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!code || isConnected) return;

    const socket = io(`${import.meta.env.VITE_EVENT_API_BASE_URL}/quiz`, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      auth: {
        code,
        userId: user?.id || 'anonymous',
        username: user?.fullName || 'Anonymous',
        isHost: false,
      },
    });
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionStatus('connected');

      socketRef.current?.emit('userJoinedQuiz', {
        code,
        userId: user?.id || 'anonymous',
        username: user?.fullName || 'Anonymous',
      });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };

    const handleUpdateGameStateUser = (data: any) => {
      console.log('Update game state user:', data);
      setCurrentQuestionIndex(data.questionIndex);
      setQuestion(data.question);
      setTotalQuestions(data.totalQuestions);
      const timeLeft = Math.max(
        0,
        data.timeLimit -
          Math.floor((Date.now() - data.currentQuestionStartTime) / 1000),
      );

      setTimeLeft(timeLeft);
      if (timeLeft > 0) {
        setIsTimerRunning(true);
      } else {
        console.log('Time up');
        setIsTimerRunning(false);
        setShowAnswerResult(true);
        setIsCorrect(false);
      }
    };

    const handleQuestionTimeUp = (data: any) => {
      handleTimeUp(data.question);
    };

    const handleNextQuestion = (data: any) => {
      console.log('Next question:', data);
      console.log('Current question:', question);
      setShowAnswerResult(true);
      setIsCorrect(selectedOption == question?.correctOption);

      setTimeout(() => {
        setShowAnswerResult(false);
        console.log('Next question:', data);
        setCurrentQuestionIndex(data.questionIndex);
        setQuestion(data.question);
        setSelectedOption(null);
        setTimeLeft(data.timeLimit || 30);
        setSelectedOption(null);
        setIsTimerRunning(true);
      }, 1000);
    };

    const handleQuestionEnded = (data: any) => {
      console.log('Question ended:', data);
      setShowAnswerResult(true);
      setIsCorrect(selectedOption == question?.correctOption);
      setIsTimerRunning(false);
      setLeaderboard(data.leaderboard);
      setLeaderboardModalOpen(true);
    };

    socketRef.current?.on('connect', handleConnect);
    socketRef.current?.on('disconnect', handleDisconnect);
    socketRef.current?.on('updateGameStateUser', handleUpdateGameStateUser);
    socketRef.current?.on('questionTimeUp', handleQuestionTimeUp);
    socketRef.current?.on('nextQuestion', handleNextQuestion);
    socketRef.current?.on('questionEnded', handleQuestionEnded);
    return () => {
      socketRef.current?.off('connect', handleConnect);
      socketRef.current?.off('disconnect', handleDisconnect);
      socketRef.current?.off('updateGameStateUser', handleUpdateGameStateUser);
      socketRef.current?.off('questionTimeUp', handleQuestionTimeUp);
      socketRef.current?.off('nextQuestion', handleNextQuestion);
      socketRef.current?.off('questionEnded', handleQuestionEnded);
    };
  }, []);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerId.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer reached 0, stop and show results
            setIsTimerRunning(false);
            notifications.show({
              title: "Time's Up!",
              message: "You didn't answer in time",
              color: 'orange',
              autoClose: 2000,
            });
            setShowAnswerResult(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000) as unknown as NodeJS.Timeout;
    }

    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, [timeLeft, isTimerRunning]);

  const handleTimeUp = (question: Question) => {
    if (selectedOption !== null) {
      return;
    }

    if (question.correctOption === selectedOption) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setShowAnswerResult(true);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswerResult || !socketRef.current || !question) {
      console.log('Cannot select option - already answered or missing data');
      return;
    }

    // Update UI immediately to show selection
    setSelectedOption(optionIndex);

    // Calculate time taken
    const timeLimit = question.timeLimit || 30;
    const timeTaken = timeLimit - timeLeft;
    setIsTimerRunning(false);

    // Submit answer to server
    socketRef.current?.emit('submitAnswer', {
      code,
      questionIndex: currentQuestionIndex,
      selectedOption: optionIndex,
      timeTaken: Math.min(timeTaken, timeLimit), // Ensure time taken doesn't exceed limit
    });
    console.log('Submitting answer for question:', question);

    // Show loading state until we get the result
    notification.success({
      message: 'Processing your answer...',
    });
  };

  const handleReconnect = () => {
    setIsConnected(false);
    setConnectionStatus('connecting');
  };

  if (!isConnected) {
    return (
      <Container2>
        <Paper
          p="xl"
          radius="lg"
          style={{
            backgroundColor: 'rgba(30, 42, 120, 0.7)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxWidth: '500px',
            margin: '0 auto',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {connectionStatus === 'connecting' ||
          connectionStatus === 'reconnecting' ? (
            // Connecting or reconnecting state
            <>
              <Loader size="xl" color="white" variant="dots" mb="lg" />
              <Title
                order={3}
                mb="md"
                ta="center"
                style={{ color: theme.white }}
              >
                {connectionStatus === 'connecting'
                  ? 'Connecting to game...'
                  : 'Reconnecting...'}
              </Title>
              <Text
                size="lg"
                fw={500}
                color="white"
                opacity={0.8}
                mb="xl"
                ta="center"
              >
                Please wait a moment
              </Text>
              <Progress
                mt="xl"
                value={100}
                animated
                size="lg"
                radius="xl"
                color="cyan"
                style={{ width: '240px' }}
              />
            </>
          ) : connectionStatus === 'error' && connectionError ? (
            // Connection error state
            <>
              <Box mb="lg">
                <IconX size={64} color={theme.colors.red[5]} />
              </Box>
              <Title
                order={3}
                mb="md"
                ta="center"
                style={{ color: theme.white }}
              >
                Connection Error
              </Title>
              <Text
                size="lg"
                fw={500}
                color="white"
                opacity={0.8}
                mb="xl"
                ta="center"
              >
                {connectionError}
              </Text>
              <Button
                color="blue"
                size="lg"
                leftSection={<IconArrowRight size={18} />}
                onClick={handleReconnect}
              >
                Reconnect
              </Button>
            </>
          ) : (
            // General loading or waiting state
            <>
              <Loader size="xl" color="white" variant="dots" mb="lg" />
              <Title
                order={3}
                mb="md"
                ta="center"
                style={{ color: theme.white }}
              >
                {!isConnected
                  ? 'Connecting to game...'
                  : 'Waiting for game to start...'}
              </Title>
              <Text
                size="lg"
                fw={500}
                color="white"
                opacity={0.8}
                mb="xl"
                ta="center"
              >
                Please wait a moment
              </Text>
              <Progress
                mt="xl"
                value={100}
                animated
                size="lg"
                radius="xl"
                color="cyan"
                style={{ width: '240px' }}
              />
            </>
          )}
        </Paper>
      </Container2>
    );
  }

  if (!question) {
    return (
      <Container2>
        <Paper
          p="xl"
          shadow="lg"
          radius="lg"
          style={{
            backgroundColor: 'rgba(30, 42, 120, 0.8)',
            backdropFilter: 'blur(8px)',
            maxWidth: '600px',
            margin: '0 auto',
            marginTop: '10vh',
          }}
        >
          <Stack align="center" gap="xl">
            <Title order={2} ta="center" style={{ color: theme.white }} mb="md">
              {t('quiz.waitingForQuestion')}
            </Title>

            <IconClock size={64} stroke={1.5} color={theme.colors.blue[2]} />

            <Text
              size="lg"
              fw={500}
              ta="center"
              color="white"
              opacity={0.9}
              px="md"
            >
              {isConnected
                ? 'Please wait for the host to start the game or advance to the next question.'
                : 'Connecting to the game server...'}
            </Text>

            <Button
              variant="gradient"
              gradient={{ from: 'cyan', to: 'blue' }}
              size="lg"
              radius="md"
              onClick={() => navigate(`/quiz-waiting-room/${code}`)}
              mt="md"
              leftSection={<IconArrowRight size={18} />}
            >
              Return to Waiting Room
            </Button>

            <Progress
              mt="lg"
              value={100}
              animated
              size="md"
              radius="xl"
              color="cyan"
              style={{ width: '80%' }}
            />
          </Stack>
        </Paper>
      </Container2>
    );
  }

  const correctOptionIndex = question?.correctOption;

  // Disconnection handling during active quiz
  if (quiz && !isConnected) {
    return (
      <Container2>
        <Paper
          p="xl"
          radius="lg"
          style={{
            backgroundColor: 'rgba(30, 42, 120, 0.7)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxWidth: '500px',
            margin: '0 auto',
            padding: '2rem',
          }}
        >
          <Stack align="center" gap="xl">
            {connectionStatus === 'reconnecting' ? (
              // Actively reconnecting
              <>
                <Loader color="cyan" size="xl" />
                <Title order={3} style={{ color: theme.white }}>
                  Reconnecting...
                </Title>
                <Text color="white" ta="center">
                  Attempting to reestablish connection to the game server
                </Text>
                <Progress
                  value={100}
                  animated
                  size="lg"
                  radius="xl"
                  color="blue"
                  style={{ width: '100%' }}
                />
              </>
            ) : (
              // Connection lost
              <>
                <IconX size={48} color={theme.colors.red[5]} />
                <Title order={3} style={{ color: theme.white }}>
                  Connection Lost
                </Title>
                <Text color="white" ta="center" mb="md">
                  {connectionError || 'Lost connection to the game server'}
                </Text>
                <Button
                  size="lg"
                  color="cyan"
                  leftSection={<IconArrowRight size={18} />}
                  onClick={handleReconnect}
                >
                  Reconnect
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Container2>
    );
  }

  return (
    <Container2>
      {/* Header */}
      <Box
        mb="xl"
        style={{
          borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
          paddingBottom: theme.spacing.md,
          marginBottom: theme.spacing.lg,
        }}
      >
        <Group justify="space-between" mb="md">
          <Badge size="lg" variant="filled" color="blue">
            Question {currentQuestionIndex + 1}/{totalQuestions}
          </Badge>
          <Group gap="sm">
            <Button
              variant="subtle"
              color="gray"
              size="compact-sm"
              onClick={() => setLeaderboardModalOpen(true)}
              leftSection={<IconPodium size={16} />}
            >
              Leaderboard
            </Button>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange' }}
            >
              <Group gap={5}>
                <IconTrophy size={16} />
                <Text>Score: {score}</Text>
              </Group>
            </Badge>
          </Group>
        </Group>

        <Title
          order={2}
          style={{ color: theme.white, marginBottom: theme.spacing.xs }}
        >
          {t('quiz.playing')}
        </Title>
      </Box>

      {/* Timer Display */}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        <RingProgress
          size={140}
          thickness={16}
          roundCaps
          sections={[
            {
              value: (timeLeft / (question?.timeLimit || 30)) * 100,
              color:
                timeLeft > 10 ? theme.colors.green[6] : theme.colors.orange[6],
            },
          ]}
          label={
            <Group justify="center" gap={5}>
              <IconClock size={28} stroke={1.5} color={theme.white} />
              <Text size="2rem" fw={700} lh={1} ta="center" color={theme.white}>
                {timeLeft}
              </Text>
            </Group>
          }
        />
      </Box>

      {/* Question Display */}
      <Paper
        radius="lg"
        shadow="lg"
        p="xl"
        mb="xl"
        style={{
          backgroundColor: theme.colors.blue[7],
          color: theme.white,
          textAlign: 'center',
        }}
      >
        <Text size="xl" fw={700} lh={1.3} ta="center">
          {question?.text}
        </Text>
      </Paper>

      {/* Answer Options - 2x2 Grid */}
      <SimpleGrid cols={2} spacing="xl">
        {question?.options.map((option: any, index: number) => (
          <Paper
            key={index}
            shadow="lg"
            p="xl"
            radius="md"
            style={{
              backgroundColor: theme.colors[ANSWER_COLORS[index]][6],
              cursor: selectedOption === null ? 'pointer' : 'default',
              transform: selectedOption === index ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
              border: showAnswerResult
                ? (index === correctOptionIndex &&
                    `4px solid ${theme.colors.green[5]}`) ||
                  (selectedOption === index &&
                    index !== correctOptionIndex &&
                    `4px solid ${theme.colors.red[5]}`) ||
                  'none'
                : undefined,
              opacity:
                showAnswerResult &&
                index !== correctOptionIndex &&
                index !== selectedOption
                  ? 0.7
                  : 1,
              animation:
                showAnswerResult && index === correctOptionIndex
                  ? `${bounce} 0.5s ease 1`
                  : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
            onClick={() => handleOptionSelect(index)}
          >
            {ANSWER_ICONS[index]}
            <Text size="lg" fw={600} ta="center" color={theme.white} mt="sm">
              {option.text}
            </Text>

            {showAnswerResult && index === correctOptionIndex && (
              <Badge size="lg" color="green" variant="filled" mt="md">
                <Group gap={5}>
                  <IconCheck size={16} />
                  <Text>Correct Answer</Text>
                </Group>
              </Badge>
            )}

            {showAnswerResult &&
              selectedOption === index &&
              index !== correctOptionIndex && (
                <Badge size="lg" color="red" variant="filled" mt="md">
                  <Group gap={5}>
                    <IconX size={16} />
                    <Text>Wrong Answer</Text>
                  </Group>
                </Badge>
              )}
          </Paper>
        ))}
      </SimpleGrid>

      {/* Footer status */}
      {showAnswerResult && (
        <Box
          mt="xl"
          style={{
            textAlign: 'center',
            padding: theme.spacing.xl,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: 'auto',
          }}
        >
          <Badge
            size="xl"
            variant="gradient"
            gradient={{
              from: isCorrect ? 'teal' : 'red',
              to: isCorrect ? 'green' : 'pink',
            }}
            p="md"
          >
            <Group gap={8}>
              {isCorrect ? <IconCheck size={20} /> : <IconX size={20} />}
              <Text fw={700}>{isCorrect ? 'Correct!' : 'Incorrect!'}</Text>
            </Group>
          </Badge>
          <Text mt="lg" color="white" size="lg" fw={500}>
            Waiting for next question...
          </Text>
          <Progress
            mt="md"
            value={100}
            animated
            size="sm"
            radius="xl"
            color="cyan"
            style={{ width: '200px', margin: '0 auto' }}
          />
        </Box>
      )}
      {/* Leaderboard Modal */}
      <LeaderboardModal
        opened={leaderboardModalOpen}
        onClose={() => setLeaderboardModalOpen(false)}
        leaderboard={leaderboard}
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestionIndex}
      />
    </Container2>
  );
}

export default QuizPlayPage;
