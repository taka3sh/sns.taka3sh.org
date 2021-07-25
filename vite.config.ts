import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        create: resolve(__dirname, 'create.html'),
        main: 'index.html',
      },
    },
  },
  plugins: [reactRefresh()],
})
