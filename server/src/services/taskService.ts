import type { Types } from 'mongoose'
import { Submission, Task, User, Vote } from '../models'
import type { TaskStatus } from '../types/http'

export function isTaskAcceptingActivity(task: { status: string; deadline: Date }) {
  return task.status === 'active' && task.deadline > new Date()
}

export async function finalizeExpiredTasks() {
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

      if (currentVotes === highestVoteCount && candidate.createdAt.getTime() < winner.createdAt.getTime()) {
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

export async function buildTaskView(taskId: Types.ObjectId | string, viewerId?: string) {
  const task = await Task.findById(taskId).populate('author', 'username').lean()
  if (!task) {
    return null
  }

  const submissions = await Submission.find({ task: task._id }).populate('author', 'username').sort({ createdAt: 1 }).lean()
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
    title: task.title || task.repositoryUrl,
    programmingLanguage: task.programmingLanguage || 'Не указан',
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
        repositoryUrl: submission.repositoryUrl || submission.content,
        createdAt: submission.createdAt,
        votes: votesBySubmissionId.get(String(submission._id)) ?? 0,
      }
    }),
  }
}
