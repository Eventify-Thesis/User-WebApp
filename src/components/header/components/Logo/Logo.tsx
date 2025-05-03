import logo from '@/assets/logo.png';
import * as S from './Logo.styles';
import { useNavigate } from 'react-router-dom';

export const Logo: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  };

  return (
    <S.LogoWrapper>
      <S.LogoImage src={logo} alt="logo" onClick={handleClick}/>
    </S.LogoWrapper>
  );
};
