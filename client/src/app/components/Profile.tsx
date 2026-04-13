import { Link, Navigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function Profile() {
  const { user, tasks, isAuthenticated, reload, logout, loading } = useAppData()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const myTasks = tasks.filter((task) => task.author.id === user.id)
  const mySubmissions = tasks
    .flatMap((task) =>
      task.submissions
        .filter((submission) => submission.author.id === user.id)
        .map((submission) => ({ taskId: task.id, taskTitle: task.title, submission })),
    )
    .sort((a, b) => new Date(b.submission.createdAt).getTime() - new Date(a.submission.createdAt).getTime())

  return (
    <div className="mx-auto max-w-6xl px-8 py-12">
      <div className="mb-6 rounded-xl border border-[var(--secondary)] bg-[var(--surface)] p-6 shadow-sm">
        <h1 className="mb-3 text-xl font-mono text-[var(--primary)]">Личный кабинет</h1>
        <div className="space-y-1 text-sm font-mono">
          <div>{user.username}</div>
          <div className="text-[var(--primary)]">{user.email}</div>
          <div>Баланс: {user.pointsBalance}</div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => void reload()}
            disabled={loading}
            className="rounded-md border border-[var(--secondary)] bg-[var(--background)] px-3 py-1 text-xs font-mono text-[var(--primary)] transition-colors hover:bg-[var(--surface-hover)] disabled:opacity-60"
          >
            Обновить
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-red-400 bg-red-950 px-3 py-1 text-xs font-mono text-red-200 transition-colors hover:bg-red-900"
          >
            Выйти
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-[var(--secondary)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-mono text-[var(--primary)]">Мои опубликованные задачи</h2>
        <div className="space-y-3">
          {myTasks.map((task) => (
            <div key={task.id} className="rounded-lg border border-[var(--secondary)] bg-[var(--background)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-sm">{task.title}</div>
                  <div className="text-xs font-mono text-[var(--primary)]">Язык: {task.programmingLanguage}</div>
                </div>
                <Link to={`/task/${task.id}`} className="text-xs font-mono text-[var(--accent)] hover:underline">
                  Перейти к задаче
                </Link>
              </div>
              <div className="grid gap-1 text-xs font-mono text-[var(--primary)] sm:grid-cols-2">
                <div>Статус: {task.status}</div>
                <div>Дедлайн: {new Date(task.deadline).toLocaleString()}</div>
                <div>Решений: {task.submissions.length}</div>
                <div>Награда: {task.platformReward} баллов</div>
              </div>
            </div>
          ))}
          {myTasks.length === 0 && (
            <div className="rounded-lg border border-[var(--secondary)] bg-[var(--background)] p-4 text-sm font-mono">
              У вас пока нет опубликованных задач.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--secondary)] bg-[var(--surface)] p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-mono text-[var(--primary)]">Мои отправленные решения</h2>
        <div className="space-y-3">
          {mySubmissions.map(({ taskId, taskTitle, submission }) => (
            <div key={submission.id} className="rounded-lg border border-[var(--secondary)] bg-[var(--background)] p-4">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-sm">{taskTitle}</div>
                  <div className="text-xs font-mono text-[var(--primary)]">
                    Отправлено: {new Date(submission.createdAt).toLocaleString()}
                  </div>
                </div>
                <Link to={`/leaderboard/${taskId}`} className="text-xs font-mono text-[var(--accent)] hover:underline">
                  Перейти в лидерборд
                </Link>
              </div>
              <div className="space-y-1 text-xs font-mono text-[var(--primary)]">
                <div>Голоса: {submission.votes}</div>
                <div className="break-all">Репозиторий: {submission.repositoryUrl}</div>
              </div>
            </div>
          ))}
          {mySubmissions.length === 0 && (
            <div className="rounded-lg border border-[var(--secondary)] bg-[var(--background)] p-4 text-sm font-mono">
              У вас пока нет отправленных решений.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
