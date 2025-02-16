import { ConfigProvider } from 'antd/lib';
import './App.css';
import { AppRouter } from './components/router/AppRouter';
import { useLanguage } from './hooks/useLanguage';
import enUS from 'antd/lib/locale/en_US';
import vnVN from 'antd/lib/locale/vi_VN';
import GlobalStyle from './styles/GlobalStyle';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useAppSelector } from './hooks/reduxHooks';
import { themeObject } from './styles/themes/themeVariables';

function App() {
  const { language } = useLanguage();

  const theme = useAppSelector((state) => state.theme.theme);

  useThemeWatcher();

  return (
    <>
      <meta name="theme-color" content={themeObject[theme].primary} />
      <GlobalStyle />
      <ConfigProvider locale={language === 'en' ? enUS : vnVN}>
        <AppRouter />
      </ConfigProvider>
    </>
  );
}

export default App;
