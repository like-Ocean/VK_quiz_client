import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [pluginReact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  html: {
    title: 'VK Quiz Client',
  },
  server: {
    port: 5173,
    host: '172.16.0.1',
    open: true,
  },
});