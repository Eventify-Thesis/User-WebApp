import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Box,
  Center,
  Loader,
  Avatar,
  Badge,
  Card,
  Progress,
  SimpleGrid,
} from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { keyframes } from '@emotion/react';
import { notifications } from '@mantine/notifications';
import {
  IconUsers,
  IconHourglass,
  IconCrown,
  IconPointFilled,
} from '@tabler/icons-react';
import { useUser } from '@clerk/clerk-react';
import { useSocket } from '@/contexts/SocketContext';

// Animation keyframes
const float = keyframes({
  '0%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-10px)' },
  '100%': { transform: 'translateY(0px)' },
});

const pulse = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.3 },
  '100%': { opacity: 1 },
});

// @ts-ignore
const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: theme.spacing.xl,
    backgroundImage: 'linear-gradient(120deg, #3F51B5 0%, #4527A0 100%)',
    backgroundSize: 'cover',
    color: theme.white,
  },
  paper: {
    width: '100%',
    maxWidth: '500px',
    padding: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.fn.rgba(theme.white, 0.95),
    border: '2px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    color: theme.white,
    fontWeight: 800,
    fontSize: '2.5rem',
    marginBottom: theme.spacing.md,
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  subtitle: {
    color: theme.fn.rgba(theme.white, 0.8),
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
  },
  gameCode: {
    fontSize: '3rem !important',
    fontWeight: 'bold !important',
    letterSpacing: '0.5rem !important',
    color: 'blue !important',
    backgroundColor: theme.fn.rgba(theme.white, 0.9),
    padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xl,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '2px solid rgba(0, 0, 0, 0.05)',
  },
  waitingAnimation: {
    animation: `${pulse} 1.5s ease-in-out infinite`,
  },
  card: {
    width: '100%',
    marginTop: theme.spacing.lg,
    backgroundColor: theme.white,
    border: `1px solid ${theme.colors.gray[2]}`,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
  participantsList: {
    width: '100%',
    marginTop: theme.spacing.md,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  participant: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.fn.rgba(theme.white, 0.7),
    marginBottom: theme.spacing.xs,
    '&:hover': {
      backgroundColor: theme.fn.rgba(theme.white, 0.9),
    },
  },
  waitingStatus: {
    animation: `${pulse} 2s ease infinite`,
    fontSize: theme.fontSizes.xl,
    fontWeight: 600,
    color: theme.colors.blue[7],
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  playerCount: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    color: theme.colors.blue[7],
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  playerItem: {
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.colors.gray[1],
    },
  },
  joinMessage: {
    animation: `${float} 2s ease-in-out infinite`,
    color: theme.colors.blue[5],
    fontWeight: 600,
  },
}));

// Define participant interface
interface Participant {
  userId: string;
  username: string;
  joinTime: Date;
  isHost?: boolean;
}

export function QuizWaitingRoomPage() {
  const { classes } = useStyles();
  const { user } = useUser();
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { socket, isConnected, connect, currentCode } = useSocket();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isHostConnected, setIsHostConnected] = useState<boolean>(false);
  const [lastJoinedUser, setLastJoinedUser] = useState<string>('');
  const [showJoinMessage, setShowJoinMessage] = useState<boolean>(false);

  // Connect to WebSocket and join the quiz room
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
      socket.off('participantJoined');
      socket.off('quizStarted');
      socket.off('hostConnected');
      socket.off('hostDisconnected');

      socket.on('joinedQuiz', (data) => {
        setParticipants(data.participants || []);

        // Identify if host is present
        const hostParticipant = data.participants?.find((p: any) => p.isHost);
        setIsHostConnected(!!hostParticipant);

        notifications.show({
          title: 'Joined Successfully',
          message: `You've joined the quiz`,
          color: 'green',
        });
      });

      socket.on('participantJoined', (data) => {
        if (!participants.some((p) => p.userId === data.userId)) {
          setParticipants((prevParticipants) => [
            ...prevParticipants,
            {
              userId: data.userId,
              username: data.username,
              joinTime: new Date(),
            },
          ]);

          // Show the join message animation
          setLastJoinedUser(data.username);
          setShowJoinMessage(true);
          setTimeout(() => setShowJoinMessage(false), 3000);
        }

        notifications.show({
          title: 'New Player',
          message: `${data.username} has joined the game`,
          color: 'blue',
        });
      });

      socket.on('quizStarted', () => {
        console.log('Quiz started event received in waiting room');
        notifications.show({
          title: 'Game Started!',
          message: 'The quiz is starting now...',
          color: 'green',
        });

        // Navigate to the play page with the new Mantine UI
        navigate(`/quiz-play/${code}`);
      });

      // Host connection status
      socket.on('hostConnected', () => {
        setIsHostConnected(true);
        notifications.show({
          title: 'Host Connected',
          message: 'The host has joined the game',
          color: 'green',
        });
      });

      socket.on('hostDisconnected', () => {
        console.log('Host disconnected');
        setIsHostConnected(false);
        notifications.show({
          title: 'Host Disconnected',
          message: 'Waiting for host to reconnect...',
          color: 'orange',
        });
      });

      socket.on('participantLeft', (data) => {
        setParticipants((prev) => prev.filter((p) => p.userId !== data.userId));

        notifications.show({
          title: 'Player Left',
          message: `${data.username} has left the game`,
          color: 'gray',
        });
      });

      // Cleanup on unmount
      return () => {
        socket.off('joinedQuiz');
        socket.off('participantJoined');
        socket.off('participantLeft');
        socket.off('quizStarted');
        socket.off('hostConnected');
        socket.off('hostDisconnected');
      };
    }
  }, [code, navigate, participants, socket, connect]);

  if (!isConnected) {
    return (
      <Container fluid className={classes.container}>
        <Center style={{ flexDirection: 'column' }}>
          <Loader size="xl" color="white" variant="dots" />
          <Text mt="md" size="lg" fw={600} color="white">
            Connecting to game...
          </Text>
          <Progress
            mt="xl"
            value={100}
            animated
            size="lg"
            radius="xl"
            color="cyan"
            style={{ width: '200px' }}
          />
        </Center>
      </Container>
    );
  }

  return (
    <Container fluid className={classes.container}>
      <Title className={classes.title}>{'Quiz Game'}</Title>
      <Text className={classes.subtitle}>
        {'Waiting for the host to start the game'}
      </Text>

      {showJoinMessage && lastJoinedUser && (
        <Text className={classes.joinMessage} mb="md">
          {lastJoinedUser} joined the game!
        </Text>
      )}

      <Paper className={classes.paper}>
        <Stack gap="md">
          <Group justify="center" className={classes.waitingAnimation}>
            <IconHourglass size={64} strokeWidth={1.5} color="#3F51B5" />
          </Group>

          <Box>
            <Text size="sm" fw={500} ta="center" mb="xs" color="dimmed">
              Game PIN:
            </Text>
            <Text className={classes.gameCode}>{code}</Text>
          </Box>

          <Card className={classes.card}>
            <Group justify="space-between" p="md">
              <Group gap="sm">
                <IconUsers size={24} stroke={1.5} color="#3F51B5" />
                <Text fw={700} size="lg">
                  Players
                </Text>
              </Group>
              <Badge
                size="lg"
                radius="xl"
                variant="filled"
                gradient={{ from: '#3F51B5', to: '#4527A0' }}
              >
                {participants.length} joined
              </Badge>
            </Group>

            <Progress
              value={Math.min(participants.length * 10, 100)}
              size="sm"
              color="#3F51B5"
              radius={0}
            />

            <Box p="md">
              {participants.length > 0 ? (
                <SimpleGrid cols={2}>
                  {participants.map((participant, index) => (
                    <Group key={index} className={classes.playerItem} p="xs">
                      <Avatar
                        size="md"
                        color={getRandomColor(index)}
                        radius="xl"
                      >
                        {participant.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Group gap={5}>
                          <Text size="sm" fw={600}>
                            {participant.username}
                          </Text>
                          {participant.isHost && (
                            <Badge size="xs" color="yellow">
                              <IconCrown size={10} /> Host
                            </Badge>
                          )}
                        </Group>
                        <Text size="xs" color="dimmed">
                          {getTimeJoined(participant.joinTime)}
                        </Text>
                      </Box>
                    </Group>
                  ))}
                </SimpleGrid>
              ) : (
                <Box py="lg">
                  <Center>
                    <Text size="sm" color="dimmed">
                      Waiting for players to join...
                    </Text>
                  </Center>
                </Box>
              )}
            </Box>
          </Card>

          <Box mt="sm">
            <Group justify="center" gap={8}>
              <IconPointFilled size={14} color="#3F51B5" />
              <IconPointFilled size={14} color="#3F51B5" />
              <IconPointFilled size={14} color="#3F51B5" />
            </Group>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

// Helper functions
function getRandomColor(index: number): string {
  const colors = [
    'blue',
    'green',
    'cyan',
    'indigo',
    'violet',
    'grape',
    'pink',
    'orange',
    'teal',
  ];
  return colors[index % colors.length];
}

function getTimeJoined(joinTime: Date): string {
  if (!joinTime) return 'Just now';

  const date = new Date(joinTime);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60),
  );

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  return `${Math.floor(diffInMinutes / 60)} hours ago`;
}

export default QuizWaitingRoomPage;
