import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextInput,
  Button,
  Title,
  Text,
  Paper,
  Stack,
  Loader,
} from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { useForm } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';
import { keyframes } from '@emotion/react';
import { useQuizMutations } from '@/mutations/useQuizMutations';

const pulse = keyframes({
  '0%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.05)' },
  '100%': { transform: 'scale(1)' },
});

const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: theme.spacing.xl,
    backgroundImage: 'linear-gradient(120deg, #1E2A78 0%, #3556DD 100%)',
    backgroundSize: 'cover',
    color: theme.white,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    color: theme.white,
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    animation: `${pulse} 3s ease infinite`,
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: theme.spacing.xl * 2,
    textAlign: 'center',
    color: theme.colors.gray[2],
  },
  paper: {
    maxWidth: 500,
    width: '100%',
    padding: theme.spacing.xl,
    backgroundColor: theme.fn.rgba(theme.white, 0.1),
    backdropFilter: 'blur(8px)',
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.fn.rgba(theme.white, 0.2)}`,
  },
  input: {
    fontSize: '2rem',
    textAlign: 'center',
    letterSpacing: '0.3rem',
    color: theme.black,
    input: {
      backgroundColor: theme.fn.rgba(theme.white, 0.1),
      border: `1px solid ${theme.fn.rgba(theme.black, 0.3)}`,
      color: theme.black,
      '&::placeholder': {
        color: theme.fn.rgba(theme.black, 0.5),
      },
    },
  },
  button: {
    fontSize: theme.fontSizes.lg,
    padding: '12px 24px',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  infoText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[2],
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: theme.fn.rgba(theme.colors.red[9], 0.2),
    color: theme.colors.red[0],
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    fontSize: theme.fontSizes.sm,
    width: '100%',
    textAlign: 'center',
  },
}));

export function QuizCodeEntryPage() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Form validation
  const form = useForm({
    initialValues: {
      code: '',
    },
    validate: {
      code: (value) =>
        value.length < 4 ? 'Game code must be at least 4 characters' : null,
    },
  });

  const { verifyQuizJoinCode, isVerifyPending } = useQuizMutations(1);

  const handleSubmit = form.onSubmit(async ({ code }) => {
    setError(null);
    const result = await verifyQuizJoinCode(code.toUpperCase());
    if (result.data.valid) {
      navigate(`/quiz-waiting/${code}`);
    }
  });

  return (
    <Container fluid className={classes.container}>
      <Title className={classes.title}>Join Quiz Game</Title>
      <Text className={classes.subtitle}>Enter the game code to join</Text>

      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Stack spacing="xl">
            <TextInput
              placeholder="ENTER CODE"
              size="xl"
              className={classes.input}
              {...form.getInputProps('code')}
              onChange={(event) => {
                // Force uppercase and remove spaces
                const value = event.currentTarget.value
                  .toUpperCase()
                  .replace(/\s/g, '');
                form.setFieldValue('code', value);
              }}
              maxLength={6}
              autoFocus
              aria-label="Game code"
            />

            {error && <Text className={classes.errorMessage}>{error}</Text>}

            <Button
              size="lg"
              className={classes.button}
              rightSection={
                isVerifyPending ? (
                  <Loader color="white" size="sm" />
                ) : (
                  <IconArrowRight size={18} />
                )
              }
              type="submit"
              loading={isVerifyPending}
              gradient={{ from: 'cyan', to: 'indigo' }}
              variant="gradient"
              fullWidth
            >
              Join Game
            </Button>

            <Text className={classes.infoText}>
              Ask your host for the game code
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default QuizCodeEntryPage;
