import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { getMostWatchedVideos } from './api/most-watched.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      host: true,
    },
    plugins: [
      react(),
      {
        name: 'api-most-watched-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/most-watched', async (_req, res) => {
            res.setHeader('Content-Type', 'application/json')
            try {
              const apiKey = env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY
              const handle = env.YOUTUBE_CHANNEL_HANDLE || process.env.YOUTUBE_CHANNEL_HANDLE || 'cnomo_editz'
              const channelId = env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID

              const result = await getMostWatchedVideos(apiKey, handle, channelId)
              res.statusCode = 200
              res.end(JSON.stringify(result))
            } catch {
              res.statusCode = 200
              res.end(
                JSON.stringify({
                  configured: true,
                  videos: [],
                  fallback: true,
                  message: 'Video archive temporarily offline',
                })
              )
            }
          })
        },
      },
    ],
  }
})
