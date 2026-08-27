import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // const basePath = env.VITE_BASE_PATH || process.env.VITE_BASE_PATH || env.BASE_URL || process.env.BASE_URL || '/'
  const basePath = env.VITE_BASE_PATH || "/admin/"

  return {
    base: basePath,
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'https://ricardoa42.sg-host.com',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
