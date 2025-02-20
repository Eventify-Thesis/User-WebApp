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
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet';

function App() {
  const { language } = useLanguage();

  const theme = useAppSelector((state) => state.theme.theme);

  useThemeWatcher();

  return (
    <>
      <meta name="theme-color" content={themeObject[theme].primary} />
      <GlobalStyle />
      <HelmetProvider>
        <Helmet>
          <meta name="theme-color" content={themeObject[theme].primary} />
          <meta
            http-equiv="Content-Security-Policy"
            content="upgrade-insecure-requests"
          />
        </Helmet>

        <ConfigProvider locale={language === 'en' ? enUS : vnVN}>
          <AppRouter />
        </ConfigProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
