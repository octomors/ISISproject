/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react'
import { apiRequest, TOKEN_STORAGE_KEY } from '../api'
import type { CreateTaskDraft, LeaderboardItem, PlatformConfig, PublicUser, Task } from '../types'

type AppDataContextValue = {
  token: string
  user: PublicUser | null
  tasks: Task[]
  leaderboard: LeaderboardItem[]
  config: PlatformConfig | null
  createTaskDraft: CreateTaskDraft
  error: string
  loading: boolean
  isAuthenticated: boolean
  setError: (value: string) => void
  setCreateTaskDraft: (updater: (prev: CreateTaskDraft) => CreateTaskDraft) => void
  reload: (authToken?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  createTask: (payload: CreateTaskDraft) => Promise<string>
  createSubmission: (taskId: string, repositoryUrl: string) => Promise<void>
  vote: (taskId: string, submissionId: string) => Promise<void>
  finalizeExpired: () => Promise<void>
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_STORAGE_KEY) ?? '')
  const [user, setUser] = useState<PublicUser | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])
  const [config, setConfig] = useState<PlatformConfig | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [createTaskDraft, setCreateTaskDraftState] = useState<CreateTaskDraft>({
    title: '',
    programmingLanguage: '',
    repositoryUrl: '',
    description: '',
    deadline: '',
  })

  const isAuthenticated = Boolean(token)

  async function loadPublicData(authToken?: string) {
    const [tasksResponse, leaderboardResponse, configResponse] = await Promise.all([
      apiRequest<{ tasks: Task[] }>('/api/tasks', {}, authToken),
      apiRequest<{ leaderboard: LeaderboardItem[] }>('/api/leaderboard'),
      apiRequest<PlatformConfig>('/api/platform-config'),
    ])

    setTasks(tasksResponse.tasks)
    setLeaderboard(leaderboardResponse.leaderboard)
    setConfig(configResponse)
  }

  async function loadMe(authToken: string) {
    const response = await apiRequest<{ user: PublicUser }>('/api/me', {}, authToken)
    setUser(response.user)
  }

  async function reload(authToken = token) {
    setLoading(true)
    setError('')

    try {
      if (authToken) {
        await loadMe(authToken)
      } else {
        setUser(null)
      }

      await loadPublicData(authToken)
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unknown error'
      setError(message)
      if (authToken) {
        setToken('')
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void reload(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function register(username: string, email: string, password: string) {
    setError('')
    const response = await apiRequest<{ token: string; user: PublicUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })

    setToken(response.token)
    setUser(response.user)
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
    await reload(response.token)
  }

  async function login(email: string, password: string) {
    setError('')
    const response = await apiRequest<{ token: string; user: PublicUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    setToken(response.token)
    setUser(response.user)
    localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
    await reload(response.token)
  }

  function logout() {
    setToken('')
    setUser(null)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    void reload('')
  }

  async function createTask(payload: CreateTaskDraft) {
    if (!token) {
      throw new Error('Для публикации задачи требуется авторизация')
    }

    setError('')
    const response = await apiRequest<{ task: Task; user: PublicUser }>(
      '/api/tasks',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token,
    )

    setUser(response.user)
    setCreateTaskDraftState({ title: '', programmingLanguage: '', repositoryUrl: '', description: '', deadline: '' })
    await reload(token)

    return response.task.id
  }

  async function createSubmission(taskId: string, repositoryUrl: string) {
    if (!token) {
      throw new Error('Для отправки решения требуется авторизация')
    }

    setError('')
    await apiRequest<{ task: Task }>(
      `/api/tasks/${taskId}/submissions`,
      {
        method: 'POST',
        body: JSON.stringify({ repositoryUrl }),
      },
      token,
    )

    await reload(token)
  }

  async function vote(taskId: string, submissionId: string) {
    if (!token) {
      throw new Error('Для голосования требуется авторизация')
    }

    setError('')
    await apiRequest<{ task: Task }>(
      `/api/tasks/${taskId}/votes`,
      {
        method: 'POST',
        body: JSON.stringify({ submissionId }),
      },
      token,
    )

    await reload(token)
  }

  async function finalizeExpired() {
    setError('')
    await apiRequest<{ ok: boolean }>('/api/tasks/finalize-expired', { method: 'POST' })
    await reload(token)
  }

  function setCreateTaskDraft(updater: (prev: CreateTaskDraft) => CreateTaskDraft) {
    setCreateTaskDraftState((prev) => updater(prev))
  }

  const value: AppDataContextValue = {
    token,
    user,
    tasks,
    leaderboard,
    config,
    createTaskDraft,
    error,
    loading,
    isAuthenticated,
    setError,
    setCreateTaskDraft,
    reload,
    login,
    register,
    logout,
    createTask,
    createSubmission,
    vote,
    finalizeExpired,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider')
  }
  return context
}
