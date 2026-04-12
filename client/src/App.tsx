import { useEffect, useMemo, useState, type FormEvent } from 'react'
import './App.css'

type PublicUser = {
  id: string
  username: string
  email: string
  pointsBalance: number
}

type TaskSubmission = {
  id: string
  content: string
  createdAt: string
  votes: number
  author: {
    id: string
    username: string
  }
}

type Task = {
  id: string
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

type LeaderboardItem = {
  rank: number
  user: PublicUser
}

type PlatformConfig = {
  publishCost: number
  platformReward: number
  initialPoints: number
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
const TOKEN_STORAGE_KEY = 'isisproject-token'

async function apiRequest<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  const data = (await response.json()) as T & { error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? 'Request failed')
  }

  return data
}

function App() {
  const [token, setToken] = useState<string>(() => localStorage.getItem(TOKEN_STORAGE_KEY) ?? '')
  const [user, setUser] = useState<PublicUser | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])
  const [config, setConfig] = useState<PlatformConfig | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })

  const [taskForm, setTaskForm] = useState({ repositoryUrl: '', deadline: '', description: '' })
  const [submissionByTask, setSubmissionByTask] = useState<Record<string, string>>({})

  const isAuthenticated = Boolean(token)

  const myTasks = useMemo(() => {
    if (!user) {
      return []
    }

    return tasks.filter((task) => task.author.id === user.id)
  }, [tasks, user])

  const activeTasks = useMemo(() => tasks.filter((task) => task.status === 'active'), [tasks])

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

  async function fullReload(authToken = token) {
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
    void fullReload(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    try {
      if (authMode === 'register') {
        const response = await apiRequest<{ token: string; user: PublicUser }>('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(authForm),
        })
        setToken(response.token)
        setUser(response.user)
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
        await fullReload(response.token)
      } else {
        const response = await apiRequest<{ token: string; user: PublicUser }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: authForm.email, password: authForm.password }),
        })
        setToken(response.token)
        setUser(response.user)
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
        await fullReload(response.token)
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Auth error')
    }
  }

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!token) {
      return
    }

    setError('')

    try {
      await apiRequest<{ task: Task; user: PublicUser }>(
        '/api/tasks',
        {
          method: 'POST',
          body: JSON.stringify(taskForm),
        },
        token,
      )

      setTaskForm({ repositoryUrl: '', deadline: '', description: '' })
      await fullReload(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Create task error')
    }
  }

  async function handleCreateSubmission(taskId: string) {
    if (!token) {
      return
    }

    const content = submissionByTask[taskId]?.trim()
    if (!content) {
      setError('Введите текст решения перед отправкой')
      return
    }

    setError('')

    try {
      await apiRequest<{ task: Task }>(
        `/api/tasks/${taskId}/submissions`,
        {
          method: 'POST',
          body: JSON.stringify({ content }),
        },
        token,
      )

      setSubmissionByTask((prev) => ({ ...prev, [taskId]: '' }))
      await fullReload(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Submission error')
    }
  }

  async function handleVote(taskId: string, submissionId: string) {
    if (!token) {
      return
    }

    setError('')

    try {
      await apiRequest<{ task: Task }>(
        `/api/tasks/${taskId}/votes`,
        {
          method: 'POST',
          body: JSON.stringify({ submissionId }),
        },
        token,
      )

      await fullReload(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Vote error')
    }
  }

  async function handleFinalizeExpired() {
    setError('')
    try {
      await apiRequest<{ ok: boolean }>('/api/tasks/finalize-expired', { method: 'POST' })
      await fullReload(token)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Finalize error')
    }
  }

  function handleLogout() {
    setToken('')
    setUser(null)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    void fullReload('')
  }

  return (
    <main className="app">
      <header className="card">
        <h1>ISISproject: коллективная оптимизация кода</h1>
        <p>
          Публикация задач, отправка решений, голосование и лидерборд в одной роли User.
          {config && (
            <>
              {' '}
              Текущие настройки: publish_cost={config.publishCost}, reward={config.platformReward},
              стартовые баллы={config.initialPoints}.
            </>
          )}
        </p>
      </header>

      {error && <div className="card error">Ошибка: {error}</div>}

      {!isAuthenticated ? (
        <section className="card">
          <h2>{authMode === 'register' ? 'Регистрация' : 'Логин'}</h2>
          <form onSubmit={handleAuthSubmit} className="stack">
            {authMode === 'register' && (
              <input
                required
                placeholder="Username"
                value={authForm.username}
                onChange={(event) => setAuthForm((prev) => ({ ...prev, username: event.target.value }))}
              />
            )}
            <input
              required
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
            />
            <button type="submit" disabled={loading}>
              {authMode === 'register' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </form>
          <button
            className="secondary"
            type="button"
            onClick={() => setAuthMode((prev) => (prev === 'register' ? 'login' : 'register'))}
          >
            {authMode === 'register' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </section>
      ) : (
        <section className="card">
          <h2>Профиль</h2>
          <p>
            {user?.username} ({user?.email})
          </p>
          <p>Баланс: {user?.pointsBalance ?? 0} points</p>
          <div className="row">
            <button type="button" onClick={() => void fullReload(token)} disabled={loading}>
              Обновить данные
            </button>
            <button type="button" className="secondary" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </section>
      )}

      {isAuthenticated && (
        <section className="card">
          <h2>Публикация задачи</h2>
          <form onSubmit={handleCreateTask} className="stack">
            <input
              required
              placeholder="Ссылка на репозиторий"
              value={taskForm.repositoryUrl}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, repositoryUrl: event.target.value }))}
            />
            <input
              required
              type="datetime-local"
              value={taskForm.deadline}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, deadline: event.target.value }))}
            />
            <textarea
              required
              placeholder="Описание задачи"
              value={taskForm.description}
              onChange={(event) => setTaskForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <button type="submit" disabled={loading}>
              Опубликовать задачу (−{config?.publishCost ?? 0} points)
            </button>
          </form>
          <p>Моих опубликованных задач: {myTasks.length}</p>
        </section>
      )}

      <section className="card">
        <div className="row space-between">
          <h2>Задачи ({tasks.length})</h2>
          <button type="button" onClick={() => void handleFinalizeExpired()}>
            Закрыть просроченные задачи
          </button>
        </div>
        <p>Активных задач: {activeTasks.length}</p>

        <div className="stack">
          {tasks.length === 0 && <p>Задач пока нет.</p>}
          {tasks.map((task) => {
            const isTaskAuthor = user?.id === task.author.id
            const canSubmit = isAuthenticated && !isTaskAuthor && task.status === 'active'

            return (
              <article key={task.id} className="task">
                <h3>{task.repositoryUrl}</h3>
                <p>{task.description}</p>
                <p>
                  Автор: {task.author.username} • Статус: <strong>{task.status}</strong>
                </p>
                <p>
                  Дедлайн: {new Date(task.deadline).toLocaleString()} • Награда: {task.platformReward} points
                </p>

                {task.status === 'completed' && task.winnerUserId && <p>Победитель определён и награда начислена.</p>}

                <div className="stack submission-block">
                  <h4>Решения ({task.submissions.length})</h4>
                  {task.submissions.length === 0 && <p>Пока нет решений.</p>}
                  {task.submissions.map((submission) => {
                    const canVote =
                      isAuthenticated &&
                      task.status === 'active' &&
                      submission.author.id !== user?.id &&
                      user?.id !== task.author.id

                    return (
                      <div key={submission.id} className="submission">
                        <p>
                          <strong>{submission.author.username}</strong> • голосов: {submission.votes}
                        </p>
                        <p>{submission.content}</p>
                        <p>{new Date(submission.createdAt).toLocaleString()}</p>
                        {canVote && (
                          <button
                            type="button"
                            className={task.myVoteSubmissionId === submission.id ? 'active-vote' : ''}
                            onClick={() => void handleVote(task.id, submission.id)}
                          >
                            {task.myVoteSubmissionId === submission.id ? 'Мой голос' : 'Голосовать'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                {canSubmit && (
                  <div className="stack">
                    <textarea
                      placeholder="Ваше решение: патч, ссылка, описание оптимизации"
                      value={submissionByTask[task.id] ?? ''}
                      onChange={(event) =>
                        setSubmissionByTask((prev) => ({
                          ...prev,
                          [task.id]: event.target.value,
                        }))
                      }
                    />
                    <button type="button" onClick={() => void handleCreateSubmission(task.id)}>
                      Отправить решение
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section className="card">
        <h2>Лидерборд</h2>
        <ol>
          {leaderboard.map((item) => (
            <li key={item.user.id}>
              #{item.rank} — {item.user.username} ({item.user.pointsBalance} points)
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}

export default App
