import mongoose from 'mongoose'
import { createApp } from './app'
import { config } from './config'

const app = createApp()

async function startServer() {
  try {
    if (!config.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set')
    }

    await mongoose.connect(config.MONGODB_URI)

    app.listen(config.PORT, () => {
      console.log(`Server is running on http://localhost:${config.PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
