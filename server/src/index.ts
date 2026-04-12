import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { type NextFunction, type Request, type Response } from 'express'
import { rateLimit } from 'express-rate-limit'
import jwt from 'jsonwebtoken'
import mongoose, { Schema, type Types } from 'mongoose'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 5000
const MONGODB_URI = process.env.MONGODB_URI || ''
const JWT_SECRET = process.env.JWT_SECRET || ''
const PUBLISH_COST = Number(process.env.PUBLISH_COST) || 10
const PLATFORM_REWARD = Number(process.env.PLATFORM_REWARD) || 50
const INITIAL_POINTS = Number(process.env.INITIAL_POINTS) || 100

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set')
}

app.use(cors())
app.use(express.json())
app.use(
  '/api',
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

type AuthRequest = Request & { userId?: string }

type TaskStatus = 'active' | 'completed' | 'cancelled'

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 40, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    pointsBalance: { type: Number, required: true, default: INITIAL_POINTS, min: 0 },
  },
  { timestamps: true },
)

const taskSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    repositoryUrl: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active', index: true },
    publishCost: { type: Number, required: true, min: 0 },
    platformReward: { type: Number, required: true, min: 0 },
    winnerSubmission: { type: Schema.Types.ObjectId, ref: 'Submission', default: null },
    winnerUser: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    rewardIssued: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const submissionSchema = new Schema(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true, maxlength: 10000 },
  },
  { timestamps: true },
)

const voteSchema = new Schema(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
    submission: { type: Schema.Types.ObjectId, ref: 'Submission', required: true, index: true },
    voter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
)

voteSchema.index({ task: 1, voter: 1 }, { unique: true })

const User = mongoose.model('User', userSchema)
const Task = mongoose.model('Task', taskSchema)
const Submission = mongoose.model('Submission', submissionSchema)
const Vote = mongoose.model('Vote', voteSchema)

function buildToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

function toPublicUser(user: { _id: Types.ObjectId; username: string; email: string; pointsBalance: number }) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    pointsBalance: user.pointsBalance,
  }
}

function getUserIdFromAuthHeader(req: Request) {
  const authHeader = req.header('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId?: string }
    return payload.userId ?? null
  } catch {
    return null
  }
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const userId = getUserIdFromAuthHeader(req)

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  req.userId = userId
  next()
}

function withOptionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  req.userId = getUserIdFromAuthHeader(req) ?? undefined
  next()
}

function sendInternalError(res: Response, userMessage: string, error: unknown) {
  console.error(userMessage, error)
  res.status(500).json({ error: userMessage })
}

async function finalizeExpiredTasks() {
  const now = new Date()
  const expiredTasks = await Task.find({ status: 'active', deadline: { $lte: now } })

  for (const task of expiredTasks) {
    const submissions = await Submission.find({ task: task._id }).sort({ createdAt: 1 })

    if (submissions.length === 0) {
      task.status = 'completed'
      task.rewardIssued = true
      await task.save()
      continue
    }

    const submissionIds = submissions.map((submission) => submission._id)
    const voteStats = await Vote.aggregate<{ _id: Types.ObjectId; votes: number }>([
      { $match: { submission: { $in: submissionIds } } },
      { $group: { _id: '$submission', votes: { $sum: 1 } } },
    ])

    const votesBySubmissionId = new Map(voteStats.map((item) => [String(item._id), item.votes]))

    let winner = submissions[0]
    let highestVoteCount = votesBySubmissionId.get(String(winner._id)) ?? 0

    for (const candidate of submissions.slice(1)) {
      const currentVotes = votesBySubmissionId.get(String(candidate._id)) ?? 0
      if (currentVotes > highestVoteCount) {
        winner = candidate
        highestVoteCount = currentVotes
        continue
      }

      if (
        currentVotes === highestVoteCount &&
        candidate.createdAt.getTime() < winner.createdAt.getTime()
      ) {
        winner = candidate
      }
    }

    task.status = 'completed'
    task.winnerSubmission = winner._id
    task.winnerUser = winner.author

    if (!task.rewardIssued) {
      await User.findByIdAndUpdate(winner.author, { $inc: { pointsBalance: task.platformReward } })
      task.rewardIssued = true
    }

    await task.save()
  }
}

async function buildTaskView(taskId: Types.ObjectId | string, viewerId?: string) {
  const task = await Task.findById(taskId).populate('author', 'username').lean()
  if (!task) {
    return null
  }

  const submissions = await Submission.find({ task: task._id })
    .populate('author', 'username')
    .sort({ createdAt: 1 })
    .lean()

  const votes = await Vote.find({ task: task._id }).lean()

  const votesBySubmissionId = new Map<string, number>()
  let myVoteSubmissionId: string | null = null

  for (const vote of votes) {
    const key = String(vote.submission)
    votesBySubmissionId.set(key, (votesBySubmissionId.get(key) ?? 0) + 1)
    if (viewerId && String(vote.voter) === viewerId) {
      myVoteSubmissionId = key
    }
  }

  const taskAuthor = task.author as unknown as { _id: Types.ObjectId; username: string }

  return {
    id: String(task._id),
    repositoryUrl: task.repositoryUrl,
    description: task.description,
    deadline: task.deadline,
    status: task.status as TaskStatus,
    publishCost: task.publishCost,
    platformReward: task.platformReward,
    createdAt: task.createdAt,
    author: {
      id: String(taskAuthor._id),
      username: taskAuthor.username,
    },
    winnerSubmissionId: task.winnerSubmission ? String(task.winnerSubmission) : null,
    winnerUserId: task.winnerUser ? String(task.winnerUser) : null,
    myVoteSubmissionId,
    submissions: submissions.map((submission) => {
      const submissionAuthor = submission.author as unknown as { _id: Types.ObjectId; username: string }

      return {
        id: String(submission._id),
        author: {
          id: String(submissionAuthor._id),
          username: submissionAuthor.username,
        },
        content: submission.content,
        createdAt: submission.createdAt,
        votes: votesBySubmissionId.get(String(submission._id)) ?? 0,
      }
    }),
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/platform-config', (_req, res) => {
  res.json({
    publishCost: PUBLISH_COST,
    platformReward: PLATFORM_REWARD,
    initialPoints: INITIAL_POINTS,
  })
})

app.post('/api/auth/register', authRateLimiter, async (req, res) => {
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

    const meetsPasswordComplexityRequirements =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
    if (!meetsPasswordComplexityRequirements) {
      res.status(400).json({
        error:
          'password must include uppercase, lowercase, number and special character',
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

app.post('/api/auth/login', authRateLimiter, async (req, res) => {
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

app.get('/api/me', requireAuth, async (req: AuthRequest, res) => {
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

app.post('/api/tasks', requireAuth, async (req: AuthRequest, res) => {
  try {
    await finalizeExpiredTasks()

    const repositoryUrl = typeof req.body.repositoryUrl === 'string' ? req.body.repositoryUrl.trim() : ''
    const description = typeof req.body.description === 'string' ? req.body.description.trim() : ''
    const deadline = typeof req.body.deadline === 'string' ? new Date(req.body.deadline) : null

    if (!repositoryUrl || !description || !deadline || Number.isNaN(deadline.getTime())) {
      res.status(400).json({ error: 'repositoryUrl, description and valid deadline are required' })
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

    if (user.pointsBalance < PUBLISH_COST) {
      res.status(400).json({ error: 'not enough points to publish task' })
      return
    }

    user.pointsBalance -= PUBLISH_COST
    await user.save()

    const task = await Task.create({
      author: user._id,
      repositoryUrl,
      description,
      deadline,
      publishCost: PUBLISH_COST,
      platformReward: PLATFORM_REWARD,
    })

    const taskView = await buildTaskView(task._id, req.userId)
    res.status(201).json({ task: taskView, user: toPublicUser(user) })
  } catch (error) {
    sendInternalError(res, 'failed to create task', error)
  }
})

app.get('/api/tasks', withOptionalAuth, async (req: AuthRequest, res) => {
  try {
    await finalizeExpiredTasks()

    const tasks = await Task.find().sort({ createdAt: -1 }).lean()
    const taskViews = await Promise.all(tasks.map((task) => buildTaskView(task._id, req.userId)))

    res.json({ tasks: taskViews.filter(Boolean) })
  } catch (error) {
    sendInternalError(res, 'failed to get tasks', error)
  }
})

app.post('/api/tasks/:taskId/submissions', requireAuth, async (req: AuthRequest, res) => {
  try {
    await finalizeExpiredTasks()

    const taskId = req.params.taskId
    const content = typeof req.body.content === 'string' ? req.body.content.trim() : ''

    if (!content) {
      res.status(400).json({ error: 'content is required' })
      return
    }

    const task = await Task.findById(taskId)
    if (!task) {
      res.status(404).json({ error: 'task not found' })
      return
    }

    if (task.status !== 'active' || task.deadline <= new Date()) {
      res.status(400).json({ error: 'task is closed for submissions' })
      return
    }

    if (String(task.author) === req.userId) {
      res.status(400).json({ error: 'author cannot submit solution to own task' })
      return
    }

    await Submission.create({ task: task._id, author: req.userId, content })
    const taskView = await buildTaskView(task._id, req.userId)

    res.status(201).json({ task: taskView })
  } catch (error) {
    sendInternalError(res, 'failed to create submission', error)
  }
})

app.post('/api/tasks/:taskId/votes', requireAuth, async (req: AuthRequest, res) => {
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

    if (task.status !== 'active' || task.deadline <= new Date()) {
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

app.post('/api/tasks/finalize-expired', async (_req, res) => {
  try {
    await finalizeExpiredTasks()
    res.json({ ok: true })
  } catch (error) {
    sendInternalError(res, 'failed to finalize tasks', error)
  }
})

app.get('/api/leaderboard', async (_req, res) => {
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
