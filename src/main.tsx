import { StrictMode } from 'react';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { createRoot } from 'react-dom/client';
import './i18n';
import { unstableSetRender } from 'antd';
import '@mantine/core/styles.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

unstableSetRender((node, container) => {
  container._reactRoot ||= createRoot(container);
  const root = container._reactRoot;
  root.render(node);
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});
import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

import { MantineProvider } from '@mantine/core';
root.render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </Provider>
  </StrictMode>,
);
