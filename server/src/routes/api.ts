import bcrypt from 'bcryptjs'
import { Router, type Express, type Response } from 'express'
import { config } from '../config'
import { requireAuth, withOptionalAuth } from '../middleware/auth'
import { authRateLimiter } from '../middleware/rateLimits'
import { Submission, Task, User, Vote } from '../models'
import { buildToken, toPublicUser } from '../services/authService'
import { buildTaskView, finalizeExpiredTasks, isTaskAcceptingActivity } from '../services/taskService'
import type { AuthRequest } from '../types/http'

function sendInternalError(res: Response, userMessage: string, error: unknown) {
  console.error(userMessage, error)
  res.status(500).json({ error: userMessage })
}

function isValidRepositoryUrl(value: string) {
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false
    }
    const allowedHosts = new Set(['github.com', 'www.github.com', 'gitlab.com', 'www.gitlab.com', 'bitbucket.org', 'www.bitbucket.org'])
    if (!allowedHosts.has(parsed.hostname.toLowerCase())) {
      return false
    }
    const segments = parsed.pathname.split('/').filter(Boolean)
    return segments.length >= 2
  } catch {
    return false
  }
}

export function registerApiRoutes(app: Express) {
  const router = Router()

  router.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  router.get('/platform-config', (_req, res) => {
    res.json({
      publishCost: config.PUBLISH_COST,
      platformReward: config.PLATFORM_REWARD,
      initialPoints: config.INITIAL_POINTS,
    })
  })

  router.post('/auth/register', authRateLimiter, async (req, res) => {
    try {
      const username = typeof req.body.username === 'string' ? req.body.username.trim() : ''
      const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
      const password = typeof req.body.password === 'string' ? req.body.password : ''

      if (!username || !email || !password) {
        res.status(400).json({ error: 'username, email and password are required' })
        return
      }

      if (password.length < 8) {
        res.status(400).json({ error: 'password must contain at least 8 characters' })
        return
      }

      const meetsPasswordComplexityRequirements = config.PASSWORD_COMPLEXITY_REGEX.test(password)
      if (!meetsPasswordComplexityRequirements) {
        res.status(400).json({
          error: 'password must include uppercase, lowercase, number and special character',
        })
        return
      }

      const existingUser = await User.findOne({ $or: [{ username }, { email }] })
      if (existingUser) {
        res.status(409).json({ error: 'user with provided email or username already exists' })
        return
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const createdUser = await User.create({ username, email, passwordHash })

      res.status(201).json({
        token: buildToken(String(createdUser._id)),
        user: toPublicUser(createdUser),
      })
    } catch (error) {
      sendInternalError(res, 'failed to register user', error)
    }
  })

  router.post('/auth/login', authRateLimiter, async (req, res) => {
    try {
      const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : ''
      const password = typeof req.body.password === 'string' ? req.body.password : ''

      if (!email || !password) {
        res.status(400).json({ error: 'email and password are required' })
        return
      }

      const user = await User.findOne({ email })
      if (!user) {
        res.status(401).json({ error: 'invalid credentials' })
        return
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
      if (!isPasswordValid) {
        res.status(401).json({ error: 'invalid credentials' })
        return
      }

      res.json({
        token: buildToken(String(user._id)),
        user: toPublicUser(user),
      })
    } catch (error) {
      sendInternalError(res, 'failed to login', error)
    }
  })

  router.get('/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await User.findById(req.userId)
      if (!user) {
        res.status(404).json({ error: 'user not found' })
        return
      }

      res.json({ user: toPublicUser(user) })
    } catch (error) {
      sendInternalError(res, 'failed to get user profile', error)
    }
  })

  router.post('/tasks', requireAuth, async (req: AuthRequest, res) => {
    try {
      await finalizeExpiredTasks()

      const title = typeof req.body.title === 'string' ? req.body.title.trim() : ''
      const programmingLanguage = typeof req.body.programmingLanguage === 'string' ? req.body.programmingLanguage.trim() : ''
      const repositoryUrl = typeof req.body.repositoryUrl === 'string' ? req.body.repositoryUrl.trim() : ''
      const description = typeof req.body.description === 'string' ? req.body.description.trim() : ''
      const deadline = typeof req.body.deadline === 'string' ? new Date(req.body.deadline) : null

      if (!title || !programmingLanguage || !repositoryUrl || !description || !deadline || Number.isNaN(deadline.getTime())) {
        res.status(400).json({ error: 'title, programmingLanguage, repositoryUrl, description and valid deadline are required' })
        return
      }

      if (!isValidRepositoryUrl(repositoryUrl)) {
        res.status(400).json({ error: 'repositoryUrl must be a valid repository link' })
        return
      }

      if (deadline <= new Date()) {
        res.status(400).json({ error: 'deadline must be in the future' })
        return
      }

      const user = await User.findById(req.userId)
      if (!user) {
        res.status(404).json({ error: 'user not found' })
        return
      }

      if (user.pointsBalance < config.PUBLISH_COST) {
        res.status(400).json({ error: 'not enough points to publish task' })
        return
      }

      user.pointsBalance -= config.PUBLISH_COST
      await user.save()

      const task = await Task.create({
        author: user._id,
        title,
        programmingLanguage,
        repositoryUrl,
        description,
        deadline,
        publishCost: config.PUBLISH_COST,
        platformReward: config.PLATFORM_REWARD,
      })

      const taskView = await buildTaskView(task._id, req.userId)
      res.status(201).json({ task: taskView, user: toPublicUser(user) })
    } catch (error) {
      sendInternalError(res, 'failed to create task', error)
    }
  })

  router.get('/tasks', withOptionalAuth, async (req: AuthRequest, res) => {
    try {
      await finalizeExpiredTasks()

      const tasks = await Task.find().sort({ createdAt: -1 }).lean()
      const taskViews = await Promise.all(tasks.map((task) => buildTaskView(task._id, req.userId)))

      res.json({ tasks: taskViews.filter(Boolean) })
    } catch (error) {
      sendInternalError(res, 'failed to get tasks', error)
    }
  })

  router.post('/tasks/:taskId/submissions', requireAuth, async (req: AuthRequest, res) => {
    try {
      await finalizeExpiredTasks()

      const taskId = req.params.taskId
      const repositoryUrl = typeof req.body.repositoryUrl === 'string' ? req.body.repositoryUrl.trim() : ''

      if (!repositoryUrl) {
        res.status(400).json({ error: 'repositoryUrl is required' })
        return
      }

      if (!isValidRepositoryUrl(repositoryUrl)) {
        res.status(400).json({ error: 'repositoryUrl must be a valid repository link' })
        return
      }

      const task = await Task.findById(taskId)
      if (!task) {
        res.status(404).json({ error: 'task not found' })
        return
      }

      if (!isTaskAcceptingActivity(task)) {
        res.status(400).json({ error: 'task is closed for submissions' })
        return
      }

      if (String(task.author) === req.userId) {
        res.status(400).json({ error: 'author cannot submit solution to own task' })
        return
      }

      await Submission.create({ task: task._id, author: req.userId, repositoryUrl })
      const taskView = await buildTaskView(task._id, req.userId)

      res.status(201).json({ task: taskView })
    } catch (error) {
      sendInternalError(res, 'failed to create submission', error)
    }
  })

  router.post('/tasks/:taskId/votes', requireAuth, async (req: AuthRequest, res) => {
    try {
      await finalizeExpiredTasks()

      const taskId = req.params.taskId
      const submissionId = typeof req.body.submissionId === 'string' ? req.body.submissionId : ''

      if (!submissionId) {
        res.status(400).json({ error: 'submissionId is required' })
        return
      }

      const task = await Task.findById(taskId)
      if (!task) {
        res.status(404).json({ error: 'task not found' })
        return
      }

      if (!isTaskAcceptingActivity(task)) {
        res.status(400).json({ error: 'task is closed for voting' })
        return
      }

      const submission = await Submission.findById(submissionId)
      if (!submission || String(submission.task) !== taskId) {
        res.status(400).json({ error: 'submission does not belong to this task' })
        return
      }

      if (String(submission.author) === req.userId) {
        res.status(400).json({ error: 'you cannot vote for your own submission' })
        return
      }

      await Vote.findOneAndUpdate(
        { task: task._id, voter: req.userId },
        { $set: { submission: submission._id } },
        { upsert: true, new: true },
      )

      const taskView = await buildTaskView(task._id, req.userId)
      res.json({ task: taskView })
    } catch (error) {
      sendInternalError(res, 'failed to vote', error)
    }
  })

  router.post('/tasks/finalize-expired', async (_req, res) => {
    try {
      await finalizeExpiredTasks()
      res.json({ ok: true })
    } catch (error) {
      sendInternalError(res, 'failed to finalize tasks', error)
    }
  })

  router.get('/leaderboard', async (_req, res) => {
    try {
      await finalizeExpiredTasks()

      const users = await User.find().sort({ pointsBalance: -1, createdAt: 1 }).lean()
      res.json({
        leaderboard: users.map((user, index) => ({
          rank: index + 1,
          user: toPublicUser({
            _id: user._id,
            username: user.username,
            email: user.email,
            pointsBalance: user.pointsBalance,
          }),
        })),
      })
    } catch (error) {
      sendInternalError(res, 'failed to get leaderboard', error)
    }
  })

  app.use('/api', router)
}
