import { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Group,
  Text,
  Avatar,
  Badge,
  Paper,
  RingProgress,
  useMantineTheme,
  Box,
  Title,
  Stack,
} from '@mantine/core';
import { IconTrophy, IconCrown, IconMedal } from '@tabler/icons-react';

interface LeaderboardEntry {
  userId: string;
  username?: string;
  score: number;
  questionsAnswered: number;
  lastActive: number;
}

interface LeaderboardModalProps {
  opened: boolean;
  onClose: () => void;
  leaderboard: LeaderboardEntry[];
  totalQuestions: number;
  currentQuestion: number;
}

export function LeaderboardModal({
  opened,
  onClose,
  leaderboard,
  totalQuestions,
  currentQuestion,
}: LeaderboardModalProps) {
  console.log('Leaderboard modal opened:', opened, leaderboard);
  const theme = useMantineTheme();
  const [sortedLeaderboard, setSortedLeaderboard] = useState<
    LeaderboardEntry[]
  >([]);

  // Sort leaderboard by score (descending)
  useEffect(() => {
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
    setSortedLeaderboard(sorted);
  }, [leaderboard]);

  // Get rank-specific colors and icons
  const getRankElement = (rank: number) => {
    if (rank === 0) {
      return {
        icon: <IconCrown size={22} color={theme.colors.yellow[5]} />,
        color: 'yellow',
      };
    } else if (rank === 1) {
      return {
        icon: <IconMedal size={22} color={theme.colors.gray[3]} />,
        color: 'gray',
      };
    } else if (rank === 2) {
      return {
        icon: <IconMedal size={22} color={theme.colors.orange[5]} />,
        color: 'orange',
      };
    } else {
      return {
        icon: (
          <Text size="sm" fw={700}>
            {rank + 1}
          </Text>
        ),
        color: 'blue',
      };
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3} mb="md">
          Leaderboard
        </Title>
      }
      size="lg"
      centered
      styles={{
        title: {
          textAlign: 'center',
          width: '100%',
        },
      }}
    >
      <Paper
        p="md"
        mb="md"
        radius="md"
        style={{ backgroundColor: theme.colors.blue[0], textAlign: 'center' }}
      >
        <Text size="lg" fw={500}>
          Question {currentQuestion + 1} of {totalQuestions}
        </Text>
      </Paper>

      {sortedLeaderboard.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center" gap="md">
            <Text fw={500} color="dimmed">
              No scores yet
            </Text>
            <Text size="sm">
              Leaderboard will update as players submit answers
            </Text>
          </Stack>
        </Paper>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rank</Table.Th>
              <Table.Th>Player</Table.Th>
              <Table.Th style={{ textAlign: 'center' }}>Progress</Table.Th>
              <Table.Th style={{ textAlign: 'right' }}>Score</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedLeaderboard.map((entry, index) => {
              const rankElement = getRankElement(index);
              const progress = (entry.questionsAnswered / totalQuestions) * 100;

              return (
                <Table.Tr key={entry.userId}>
                  <Table.Td>
                    <Badge
                      color={rankElement.color}
                      radius="sm"
                      p="xs"
                      style={{ minWidth: '36px' }}
                    >
                      <Group gap={4} justify="center">
                        {rankElement.icon}
                      </Group>
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar
                        radius="xl"
                        color={
                          theme.colors[
                            [
                              'blue',
                              'green',
                              'cyan',
                              'teal',
                              'indigo',
                              'violet',
                            ][index % 6]
                          ][6]
                        }
                      >
                        {(entry.username || 'User')
                          .substring(0, 2)
                          .toUpperCase()}
                      </Avatar>
                      <Text fw={500} lineClamp={1}>
                        {entry.username ||
                          `Player ${entry.userId.substring(0, 4)}`}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td align="center">
                    <Box
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      <RingProgress
                        size={40}
                        thickness={4}
                        roundCaps
                        sections={[
                          {
                            value: progress,
                            color:
                              progress >= 100
                                ? 'green'
                                : progress > 50
                                ? 'blue'
                                : 'orange',
                          },
                        ]}
                        label={
                          <Text size="xs" ta="center" fw={700}>
                            {entry.questionsAnswered}/{totalQuestions}
                          </Text>
                        }
                      />
                    </Box>
                  </Table.Td>
                  <Table.Td align="right">
                    <Group gap={4} justify="flex-end">
                      <IconTrophy size={16} color={theme.colors.yellow[6]} />
                      <Text fw={700} size="lg">
                        {entry.score}
                      </Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      )}
    </Modal>
  );
}
