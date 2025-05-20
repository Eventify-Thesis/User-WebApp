import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
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
  Modal,
  Loader,
  Center,
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
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { QuizAnswer } from '@/domain/QuizModel';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';
import { useUser } from '@clerk/clerk-react';
import { useSocket } from '@/contexts/SocketContext';

const bounce = keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-15px)' },
});

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
  const { socket, isConnected, connect, currentCode } = useSocket();

  // State
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswerResult, setShowAnswerResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizEnded, setQuizEnded] = useState<boolean>(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  // Connect to WebSocket
  useEffect(() => {
    if (!code) return;

    // Connect to socket only if not already connected to the same code
    if (!socket || currentCode !== code) {
      console.log('Connecting to socket for quiz code:', code);
      connect(code);
    } else {
      console.log('Reusing existing socket connection for quiz code:', code);
    }

    // Socket event handlers
    if (socket) {
      // Clean up previous listeners to prevent duplicates
      socket.off('joinedQuiz');
      socket.off('quizStarted');
      socket.off('questionStarted');
      socket.off('answerResult');
      socket.off('quizEnded');
      socket.off('hostDisconnected');
      socket.off('error');

      // Join the quiz room
      socket.emit('joinedGame', {
        code,
        userId: user?.id,
        username: user?.username || 'Anonymous',
      });

      socket.on('hostDisconnected', () => {
        notifications.show({
          title: 'Host Disconnected',
          message:
            'The quiz host has disconnected. Please wait or try rejoining.',
          color: 'red',
        });

        // Clear current question state
        setQuiz(null);
        setTimeLeft(0);
        if (timerId.current) {
          clearInterval(timerId.current);
        }
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
        notifications.show({
          title: 'Error',
          message: error.message || 'An error occurred',
          color: 'red',
        });
      });

      socket.on('questionStarted', (data) => {
        if (data.questionIndex === currentQuestionIndex) return;
        console.log('Question started:', data);
        setIsLoading(false);
        setCurrentQuestionIndex(data.questionIndex);
        setTotalQuestions(data.totalQuestions);

        // Update quiz state with new question
        setQuiz((prevQuiz) => {
          if (!prevQuiz) {
            return {
              id: 0,
              title: 'Quiz',
              questions: [data.question],
              passingScore: 0,
            };
          }

          // Update the question at current index
          const updatedQuestions = [...prevQuiz.questions];
          updatedQuestions[data.questionIndex] = data.question;

          return {
            ...prevQuiz,
            questions: updatedQuestions,
          };
        });

        // Reset question state
        setTimeLeft(data.timeLimit || 30);
        setSelectedOption(null);
        setShowAnswerResult(false);
        setIsCorrect(false);

        // Start timer
        startTimer(data.timeLimit || 30);
      });

      socket.on('answerResult', (data) => {
        console.log('Answer result:', data);

        // Stop the timer when result is received
        if (timerId.current) {
          clearInterval(timerId.current);
        }

        setIsCorrect(data.isCorrect);
        setScore((prevScore) => prevScore + (data.score || 0));
        setShowAnswerResult(true);

        // Show feedback notification
        notifications.show({
          title: data.isCorrect ? 'Correct!' : 'Incorrect',
          message: data.isCorrect
            ? `You earned ${data.score} points!`
            : 'Better luck on the next question!',
          color: data.isCorrect ? 'green' : 'red',
          autoClose: 2000,
        });
      });

      socket.on('quizEnded', (data) => {
        console.log('Quiz ended:', data);

        // Stop any running timers
        if (timerId.current) {
          clearInterval(timerId.current);
        }

        setQuizEnded(true);

        // Show final score notification
        notifications.show({
          title: 'Quiz Completed! 🎉',
          message: `Your final score: ${score} points`,
          color: 'blue',
          autoClose: 5000,
        });

        // Save final state before navigation
        const finalState = {
          score,
          totalQuestions,
          answeredQuestions: currentQuestionIndex + 1,
          leaderboard: data.leaderboard,
        };

        // Navigate to results with state
        navigate(`/quiz-results/${code}`, {
          state: {
            ...finalState,
            completedAt: data.endTime || Date.now(),
          },
        });
      });

      // Cleanup on unmount
      return () => {
        // Clear all timers
        if (timerId.current) {
          clearInterval(timerId.current);
        }

        if (resultTimeoutRef.current) {
          clearTimeout(resultTimeoutRef.current);
        }

        // Remove all socket listeners
        if (socket) {
          socket.off('joinedQuiz');
          socket.off('quizStarted');
          socket.off('questionStarted');
          socket.off('answerResult');
          socket.off('quizEnded');
          socket.off('hostDisconnected');
          socket.off('error');

          // Notify server about disconnection if quiz hasn't ended
          if (!quizEnded) {
            socket.emit('leaveQuiz', { code });
          }
        }
      };
    }
  }, [
    code,
    navigate,
    socket,
    connect,
    score,
    currentQuestionIndex,
    totalQuestions,
    quizEnded,
  ]);

  useEffect(() => {
    let timerId: number | undefined;

    if (timeLeft && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Timer reached 0, stop and show results
            // setIsTimerRunning(false);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timeLeft]);

  const handleTimeUp = () => {
    if (!quiz || !quiz.questions[currentQuestionIndex] || !socket) return;

    // Submit timeout answer
    socket.emit('submitAnswer', {
      code,
      questionId: quiz.questions[currentQuestionIndex].id,
      questionIndex: currentQuestionIndex,
      selectedOption: -1, // -1 indicates timeout/no answer
      timeTaken: quiz.questions[currentQuestionIndex].timeLimit || 30,
    });

    // Show timeout notification
    notifications.show({
      title: "Time's Up!",
      message: "You didn't answer in time",
      color: 'orange',
      autoClose: 2000,
    });
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswerResult || selectedOption !== null || !socket || !quiz) return;

    setSelectedOption(optionIndex);

    // Calculate time taken
    const timeLimit = quiz.questions[currentQuestionIndex].timeLimit || 30;
    const timeTaken = timeLimit - timeLeft;

    // Submit answer
    socket.emit('submitAnswer', {
      code,
      questionId: quiz.questions[currentQuestionIndex].id,
      questionIndex: currentQuestionIndex,
      selectedOption: optionIndex,
      timeTaken: Math.min(timeTaken, timeLimit), // Ensure time taken doesn't exceed limit
    });
  };

  // Add a reconnection attempt function
  const handleReconnect = () => {
    if (!socket || !code) return;

    setIsLoading(true);
    connect(code);

    // Attempt to rejoin the quiz
    socket.emit('joinQuizByCode', {
      code,
      userId: user?.id,
      username: user?.username || 'Anonymous',
    });
  };

  if (!isConnected || isLoading) {
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
          <Loader size="xl" color="white" variant="dots" mb="lg" />
          <Title order={3} mb="md" ta="center" style={{ color: theme.white }}>
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
        </Paper>
      </Container2>
    );
  }

  if (!quiz || !quiz.questions[currentQuestionIndex]) {
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

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const correctOptionIndex = currentQuestion.correctOption;
  const isAnswerCorrect = selectedOption === correctOptionIndex;

  if (!isConnected) {
    return (
      <Container2>
        <Center style={{ flexDirection: 'column', height: '100vh' }}>
          <Text color="red" mb="xl">
            Lost connection to the game server
          </Text>
          <Button color="blue" onClick={handleReconnect} mb="xl">
            Reconnect
          </Button>
        </Center>
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
              value: (timeLeft / (currentQuestion.timeLimit || 30)) * 100,
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
          {currentQuestion.text}
        </Text>
      </Paper>

      {/* Answer Options - 2x2 Grid */}
      <SimpleGrid cols={2} spacing="xl">
        {currentQuestion.options.map((option: any, index: number) => (
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
    </Container2>
  );
}

export default QuizPlayPage;
