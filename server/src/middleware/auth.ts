import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import type { AuthRequest } from '../types/http'

function getUserIdFromAuthHeader(req: Request) {
  const authHeader = req.header('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId?: string }
    return payload.userId ?? null
  } catch {
    return null
  }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = getUserIdFromAuthHeader(req)

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  req.userId = userId
  next()
}

export function withOptionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  req.userId = getUserIdFromAuthHeader(req) ?? undefined
  next()
}
