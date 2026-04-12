import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 5000
const MONGODB_URI = process.env.MONGODB_URI || ''

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not set')
    }

    await mongoose.connect(MONGODB_URI)

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
