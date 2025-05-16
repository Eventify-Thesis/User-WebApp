import React from 'react';
import {Container} from '@/components/quiz-result/container.styles';
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
  

// removed duplicated styled-components definitions

const podiumData = [
  { name: 'David A', score: 13649, correct: 16, total: 22 },
  { name: 'Jenna', score: 13721, correct: 16, total: 22 },
  { name: 'Kevin b', score: 12944, correct: 16, total: 22 },
  { name: 'Papa Lod', score: 11319, correct: 14, total: 22 },
  { name: 'Dobby', score: 11042, correct: 13, total: 22 },
  { name: 'Nayeon', score: 10976, correct: 12, total: 22 },
];

const medals = [
  <span key="2">🥈</span>,
  <span key="1">🥇</span>,
  <span key="3">🥉</span>
];

const QuizResultPage: React.FC = () => {
  const sorted = [...podiumData].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  return (
    <Container>
      {/* Confetti effect appears on page load */}
      <ConfettiEffect />
      <Banner>2020 P&amp;B Holiday Party Trivia!</Banner>
      <Podium>
        {/* 2nd place */}
        <PodiumBlock rank={2}>
          <Medal rank={2}>{medals[0]}</Medal>
          <Name>{sorted[1].name}</Name>
          <Score>{sorted[1].score}</Score>
          <Subtext>{sorted[1].correct} out of {sorted[1].total}</Subtext>
        </PodiumBlock>
        {/* 1st place */}
        <PodiumBlock rank={1}>
          <Medal rank={1}>{medals[1]}</Medal>
          <Name>{sorted[0].name}</Name>
          <Score>{sorted[0].score}</Score>
          <Subtext>{sorted[0].correct} out of {sorted[0].total}</Subtext>
        </PodiumBlock>
        {/* 3rd place */}
        <PodiumBlock rank={3}>
          <Medal rank={3}>{medals[2]}</Medal>
          <Name>{sorted[2].name}</Name>
          <Score>{sorted[2].score}</Score>
          <Subtext>{sorted[2].correct} out of {sorted[2].total}</Subtext>
        </PodiumBlock>
      </Podium>
      {/* Others section */}
      <OthersContainer>
        {sorted.slice(3).map((player, idx) => (
          <OtherPlayer key={player.name}>
            <span>{player.name}</span>
            <span>{player.correct}/{player.total}</span>
          </OtherPlayer>
        ))}
      </OthersContainer>
    </Container>
  );
};

export default QuizResultPage;
