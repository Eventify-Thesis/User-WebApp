import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useLeaderboard } from '@/queries/useLeaderboard';
import {Container} from '@/components/quiz-result/Container.styles';
import {Banner} from '@/components/quiz-result/Banner.styles';
import {Podium} from '@/components/quiz-result/Podium.styles';
import {PodiumBlock} from '@/components/quiz-result/PodiumBlock.styles';
import {Medal} from '@/components/quiz-result/Medal.styles';
import {Name} from '@/components/quiz-result/Name.styles';
import {Score} from '@/components/quiz-result/Score.styles';
import {Subtext} from '@/components/quiz-result/Subtext.styles';
import {OthersContainer} from '@/components/quiz-result/OthersContainer.styles';
import {OtherPlayer} from '@/components/quiz-result/OtherPlayer.styles';
import ConfettiEffect from '@/components/quiz-result/ConfettiEffect';
import { OtherPlayerInfoContainer, OtherPlayerName, OtherPlayerScore, OtherPlayerStats } from '@/components/quiz-result/OtherPlayerInfo.styles';

// removed duplicated styled-components definitions

const medals = [
  <span key="2">🥈</span>,
  <span key="1">🥇</span>,
  <span key="3">🥉</span>
];

const QuizResultPage: React.FC = () => {
  const { t } = useTranslation();
  const { quizId } = useParams<{ quizId: string }>();
  const quizIdNumber = quizId ? parseInt(quizId) : NaN;
  const { data: leaderboard, isLoading, error } = useLeaderboard(quizIdNumber);

  if (isNaN(quizIdNumber)) {
    return <Container>{t('quizResult.invalidQuizId')}</Container>;
  }
  if (isLoading) {
    return <Container>{t('quizResult.loadingLeaderboard')}</Container>;
  }
  if (error || !leaderboard) {
    return <Container>{t('quizResult.couldNotLoadLeaderboard')}</Container>;
  }
  if (leaderboard.length < 3) {
    return <Container>{t('quizResult.notEnoughData')}</Container>;
  }

  // Sort by score descending, then by user name
  const sorted = [...leaderboard].sort((a, b) => b.score - a.score || a.userName.localeCompare(b.userName));

  return (
    <Container>
      {/* Confetti effect appears on page load */}
      <ConfettiEffect />
      <Banner>{t('quizResult.quizResults')}</Banner>
      <Podium>
        {/* 2nd place */}
        <PodiumBlock rank={2}>
          <Medal rank={2}>{medals[0]}</Medal>
          <Name>{sorted[1].userName}</Name>
          <Score>{sorted[1].score}</Score>
          <Subtext>{t('quizResult.correctOutOf', {correct: sorted[1].correctAnswers, total: sorted[1].totalQuestions})}</Subtext>
        </PodiumBlock>
        {/* 1st place */}
        <PodiumBlock rank={1}>
          <Medal rank={1}>{medals[1]}</Medal>
          <Name>{sorted[0].userName}</Name>
          <Score>{sorted[0].score}</Score>
          <Subtext>{t('quizResult.correctOutOf', {correct: sorted[0].correctAnswers, total: sorted[0].totalQuestions})}</Subtext>
        </PodiumBlock>
        {/* 3rd place */}
        <PodiumBlock rank={3}>
          <Medal rank={3}>{medals[2]}</Medal>
          <Name>{sorted[2].userName}</Name>
          <Score>{sorted[2].score}</Score>
          <Subtext>{t('quizResult.correctOutOf', {correct: sorted[2].correctAnswers, total: sorted[2].totalQuestions})}</Subtext>
        </PodiumBlock>
      </Podium>
      {/* Others section */}
      <OthersContainer>
        {sorted.slice(3).map((player, idx) => (
          <OtherPlayer key={player.userName}>
            <OtherPlayerInfoContainer>
              <OtherPlayerName>{player.userName}</OtherPlayerName>
              <OtherPlayerScore>{player.score}</OtherPlayerScore>
              <OtherPlayerStats>{t('quizResult.correctSlashTotal', {correct: player.correctAnswers, total: player.totalQuestions})}</OtherPlayerStats>
            </OtherPlayerInfoContainer>
          </OtherPlayer>
        ))}
      </OthersContainer>
    </Container>
  );
};

export default QuizResultPage;
