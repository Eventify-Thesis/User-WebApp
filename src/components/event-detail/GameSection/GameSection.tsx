import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Title,
  Text,
  Button,
  Box,
  Stack,
  Group,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import { createStyles } from '@mantine/styles';
import {
  IconDeviceGamepad2,
  IconBolt,
  IconUsers,
  IconTrophy,
} from '@tabler/icons-react';
import { keyframes } from '@emotion/react';

const glow = keyframes({
  '0%': { boxShadow: '0 0 5px rgba(53, 86, 221, 0.3)' },
  '50%': {
    boxShadow:
      '0 0 20px rgba(53, 86, 221, 0.6), 0 0 30px rgba(53, 86, 221, 0.4)',
  },
  '100%': { boxShadow: '0 0 5px rgba(53, 86, 221, 0.3)' },
});

const float = keyframes({
  '0%, 100%': { transform: 'translateY(0px)' },
  '50%': { transform: 'translateY(-5px)' },
});

const useStyles = createStyles((theme) => ({
  gameSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: theme.radius.xl,
    padding: '0px !important',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
      pointerEvents: 'none',
    },
    // Responsive padding
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      padding: theme.spacing.md,
    },
  },
  featuresContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: theme.spacing.md,
    width: '100%',
    flexWrap: 'wrap',
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      gap: theme.spacing.sm,
    },
  },
  title: {
    color: theme.white,
    fontSize: '2rem',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  },
  subtitle: {
    color: theme.colors.gray[2],
    fontSize: theme.fontSizes.lg,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  gameButton: {
    background: 'linear-gradient(135deg, #3556DD 0%, #1E2A78 100%)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: theme.radius.xl,
    padding: '16px 32px',
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
    color: theme.white,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: `${glow} 2s ease-in-out infinite`,
    '&:hover': {
      transform: 'translateY(-3px) scale(1.02)',
      boxShadow:
        '0 10px 25px rgba(53, 86, 221, 0.4), 0 0 30px rgba(53, 86, 221, 0.6)',
      background: 'linear-gradient(135deg, #4066FF 0%, #2E3A99 100%)',
    },
    '&:active': {
      transform: 'translateY(-1px)',
    },
  },
  featureBox: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    textAlign: 'center',
    animation: `${float} 3s ease-in-out infinite`,
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '&:nth-of-type(2)': {
      animationDelay: '0.5s',
    },
    '&:nth-of-type(3)': {
      animationDelay: '1s',
    },
    // Responsive design
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      minHeight: '100px',
      padding: theme.spacing.sm,
    },
  },
  featureIcon: {
    background: 'linear-gradient(135deg, #00D4FF 0%, #3556DD 100%)',
    marginBottom: theme.spacing.xs,
  },
  featureTitle: {
    color: theme.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,
    marginBottom: theme.spacing.xs,
  },
  featureText: {
    color: theme.colors.gray[3],
    fontSize: theme.fontSizes.xs,
  },
  glowOrb: {
    position: 'absolute',
    width: '100px',
    height: '100px',
    background:
      'radial-gradient(circle, rgba(53, 86, 221, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: `${float} 4s ease-in-out infinite`,
    '&.orb1': {
      top: '10px',
      right: '20px',
      animationDelay: '0s',
    },
    '&.orb2': {
      bottom: '20px',
      left: '30px',
      animationDelay: '2s',
    },
  },
}));

interface GameSectionProps {
  eventId?: string;
}

export const GameSection: React.FC<GameSectionProps> = ({ eventId }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleJoinQuiz = () => {
    navigate('/quiz-entry');
  };

  const features = [
    {
      icon: IconBolt,
      title: 'Real-time Quiz',
      description: 'Live interactive gaming experience',
    },
    {
      icon: IconUsers,
      title: 'Multiplayer',
      description: 'Compete with other attendees',
    },
    {
      icon: IconTrophy,
      title: 'Win Prizes',
      description: 'Earn rewards and recognition',
    },
  ];

  return (
    <Paper className={classes.gameSection} shadow="xl">
      <Box className={`${classes.glowOrb} orb1`} />
      <Box className={`${classes.glowOrb} orb2`} />

      <Stack gap="lg" align="center">
        <Box style={{ textAlign: 'center' }}>
          <Title className={classes.title}>🎮 Interactive Quiz Game</Title>
          <Text className={classes.subtitle}>
            Join the live quiz competition and test your knowledge!
          </Text>
        </Box>

        <Box className={classes.featuresContainer}>
          {features.map((feature, index) => (
            <Box
              key={index}
              className={classes.featureBox}
              style={{
                flex: '1 1 120px',
                maxWidth: '150px',
              }}
            >
              <ThemeIcon
                size="lg"
                className={classes.featureIcon}
                variant="gradient"
                gradient={{ from: 'cyan', to: 'indigo' }}
              >
                <feature.icon size={20} />
              </ThemeIcon>
              <Text className={classes.featureTitle}>{feature.title}</Text>
              <Text className={classes.featureText}>{feature.description}</Text>
            </Box>
          ))}
        </Box>

        <Button
          className={classes.gameButton}
          size="xl"
          leftSection={<IconDeviceGamepad2 size={24} />}
          onClick={handleJoinQuiz}
          variant="gradient"
          gradient={{ from: 'cyan', to: 'indigo' }}
          fullWidth
          style={{ maxWidth: '400px' }}
        >
          Join Quiz Game
        </Button>

        <Text
          style={{
            color: theme.colors.gray[4],
            fontSize: theme.fontSizes.sm,
            textAlign: 'center',
          }}
        >
          Get your game code from the event organizer
        </Text>
      </Stack>
    </Paper>
  );
};

export default GameSection;
