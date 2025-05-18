import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  // css: {
  //   modules: {
  //     localsConvention: 'camelCase',
  //   },
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/styles/mixins.scss";`,
  //     },
  //   },
  //   postcss: {
  //     plugins: [postcssPresetMantine()],
  //   },
  // },
});
