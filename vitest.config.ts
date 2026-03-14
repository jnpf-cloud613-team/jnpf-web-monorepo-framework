import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [Vue() as any, VueJsx()],
  test: {
    environment: 'happy-dom',
    exclude: [...configDefaults.exclude, '**/e2e/**'],
  },
});
