import dotenv from 'dotenv'

dotenv.config()

const PORT = Number(process.env.PORT) || 5000
const MONGODB_URI = process.env.MONGODB_URI || ''
const JWT_SECRET = process.env.JWT_SECRET || ''
const PUBLISH_COST = Number(process.env.PUBLISH_COST) || 10
const PLATFORM_REWARD = Number(process.env.PLATFORM_REWARD) || 50
const INITIAL_POINTS = Number(process.env.INITIAL_POINTS) || 100
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || ''
const HUBSPOT_PIPELINE_ID = process.env.HUBSPOT_PIPELINE_ID || 'default'
const HUBSPOT_STAGE_ACTIVE = process.env.HUBSPOT_STAGE_ACTIVE || '5324159173'
const HUBSPOT_OWNER_ID = process.env.HUBSPOT_OWNER_ID || ''

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
  HUBSPOT_ACCESS_TOKEN,
  HUBSPOT_PIPELINE_ID,
  HUBSPOT_STAGE_ACTIVE,
  HUBSPOT_OWNER_ID,
  PASSWORD_COMPLEXITY_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
}
