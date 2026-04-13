import jwt from 'jsonwebtoken'
import type { Types } from 'mongoose'
import { config } from '../config'

export function buildToken(userId: string) {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' })
}

export function toPublicUser(user: { _id: Types.ObjectId; username: string; email: string; pointsBalance: number }) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    pointsBalance: user.pointsBalance,
  }
}
