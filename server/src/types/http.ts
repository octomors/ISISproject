import type { Request } from 'express'

export type AuthRequest = Request & { userId?: string }

export type TaskStatus = 'active' | 'completed' | 'cancelled'
