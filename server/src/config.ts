import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT) || 5000
const MONGODB_URI = process.env.MONGODB_URI || ''
const JWT_SECRET = process.env.JWT_SECRET || ''
const PUBLISH_COST = Number(process.env.PUBLISH_COST) || 10
const PLATFORM_REWARD = Number(process.env.PLATFORM_REWARD) || 50
const INITIAL_POINTS = Number(process.env.INITIAL_POINTS) || 100

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set')
}

export const config = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  PUBLISH_COST,
  PLATFORM_REWARD,
  INITIAL_POINTS,
  PASSWORD_COMPLEXITY_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
}
