import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd/lib';
import './App.css';
import './styles/components.css';
import { AppRouter } from './components/router/AppRouter';
import { useLanguage } from './hooks/useLanguage';
import en from 'antd/lib/locale/en_US';
import vnVN from 'antd/lib/locale/vi_VN';
import GlobalStyle from './styles/GlobalStyle';
import { useThemeWatcher } from './hooks/useThemeWatcher';
import { useAppSelector } from './hooks/reduxHooks';
import { themeObject } from './styles/themes/themeVariables';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet';
import { ClerkProvider } from '@clerk/clerk-react';
import { viVN } from '@clerk/localizations';
import { enUS } from '@clerk/localizations';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env.local file');
}

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  const { language } = useLanguage();

  const theme = useAppSelector((state) => state.theme.theme);

  useThemeWatcher();

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        localization={language === 'en' ? enUS : viVN}
      >
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

          <ConfigProvider locale={language === 'en' ? en : vnVN}>
            <AppRouter />
          </ConfigProvider>
        </HelmetProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export default App;
