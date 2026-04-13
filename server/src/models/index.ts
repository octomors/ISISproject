import mongoose, { Schema } from 'mongoose'
import { config } from '../config'

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 40, unique: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },
    pointsBalance: { type: Number, required: true, default: config.INITIAL_POINTS, min: 0 },
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

export const User = mongoose.model('User', userSchema)
export const Task = mongoose.model('Task', taskSchema)
export const Submission = mongoose.model('Submission', submissionSchema)
export const Vote = mongoose.model('Vote', voteSchema)
