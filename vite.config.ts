/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        create: resolve(__dirname, 'create.html'),
        index: resolve(__dirname, 'index.html'),
      },
    },
  },
  plugins: [reactRefresh()],
})
