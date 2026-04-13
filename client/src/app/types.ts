export type PublicUser = {
  id: string
  username: string
  email: string
  pointsBalance: number
}

export type TaskSubmission = {
  id: string
  repositoryUrl: string
  description: string
  createdAt: string
  votes: number
  author: {
    id: string
    username: string
  }
}

export type Task = {
  id: string
  title: string
  programmingLanguage: string
  repositoryUrl: string
  description: string
  deadline: string
  status: 'active' | 'completed' | 'cancelled'
  publishCost: number
  platformReward: number
  createdAt: string
  winnerSubmissionId: string | null
  winnerUserId: string | null
  myVoteSubmissionId: string | null
  author: {
    id: string
    username: string
  }
  submissions: TaskSubmission[]
}

export type LeaderboardItem = {
  rank: number
  user: PublicUser
}

export type PlatformConfig = {
  publishCost: number
  platformReward: number
  initialPoints: number
}

export type CreateTaskDraft = {
  title: string
  programmingLanguage: string
  repositoryUrl: string
  description: string
  deadline: string
}
