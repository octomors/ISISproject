import cors from 'cors'
import express from 'express'
import { apiRateLimiter } from './middleware/rateLimits'
import { registerApiRoutes } from './routes/api'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use('/api', apiRateLimiter)

  registerApiRoutes(app)

  return app
}
