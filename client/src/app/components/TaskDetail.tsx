import { Award, Calendar, Send, TrendingUp, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

function getStatusLabel(status: 'active' | 'completed' | 'cancelled') {
  switch (status) {
    case 'active':
      return 'Активна'
    case 'completed':
      return 'Завершена'
    case 'cancelled':
      return 'Отменена'
    default:
      return status
  }
}

export function TaskDetail() {
  const { id } = useParams()
  const { tasks, user, vote, isAuthenticated } = useAppData()
  const task = tasks.find((item) => item.id === id)

  if (!task) {
    return (
      <div className="mx-auto max-w-5xl px-8 py-12">
        <div className="border-2 border-gray-800 bg-white p-8 font-mono">Задача не найдена.</div>
      </div>
    )
  }

  const isTaskAuthor = user?.id === task.author.id
  const isTaskActive = task.status === 'active' && new Date(task.deadline) > new Date()

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <div className="mb-6 text-xs font-mono text-gray-500">
        <Link to="/" className="hover:underline">
          Каталог
        </Link>{' '}
        / Задача #{task.id.slice(-6)}
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="mb-2 text-xs font-mono text-slate-500">Автор: {task.author.username}</div>
            <h1 className="mb-2 break-words text-2xl font-mono">{task.title}</h1>
            <div className="text-xs font-mono text-slate-500">Язык: {task.programmingLanguage}</div>
          </div>
          <div className="rounded-md border border-amber-300 bg-amber-50 px-6 py-2 font-mono text-amber-700">
            {task.platformReward} баллов
          </div>
        </div>

        <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <div>
              <div className="text-xs font-mono text-slate-500">Дедлайн</div>
              <div className="text-sm font-mono">{new Date(task.deadline).toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            <div>
              <div className="text-xs font-mono text-slate-500">Участников</div>
              <div className="text-sm font-mono">{new Set(task.submissions.map((item) => item.author.id)).size}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <div>
              <div className="text-xs font-mono text-slate-500">Решений</div>
              <div className="text-sm font-mono">{task.submissions.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-500" />
            <div>
              <div className="text-xs font-mono text-slate-500">Статус</div>
              <div className="text-sm font-mono">{getStatusLabel(isTaskActive ? 'active' : task.status)}</div>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="text-xs font-mono text-slate-500">URL репозитория задачи</div>
            <a href={task.repositoryUrl} target="_blank" rel="noreferrer" className="break-all text-sm font-mono text-indigo-700 hover:underline">
              {task.repositoryUrl}
            </a>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-lg font-mono">Описание задачи</h2>
        <div className="space-y-4 text-sm font-mono text-slate-700">
          <p>{task.description}</p>
          <p>
            Публикация оплачивается баллами, победитель определяется по голосам к дедлайну, при равенстве — по
            времени ранней отправки.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-lg font-mono">Решения и голосование</h2>
        <div className="space-y-3">
          {task.submissions.map((submission) => {
            const canVote =
              isAuthenticated && isTaskActive && !isTaskAuthor && submission.author.id !== user?.id

            return (
              <div key={submission.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div className="font-mono text-sm">{submission.author.username}</div>
                  <div className="font-mono text-xs text-slate-500">голосов: {submission.votes}</div>
                </div>
                <div className="mb-3 font-mono text-sm">
                  Репозиторий решения:{' '}
                  <a href={submission.repositoryUrl} target="_blank" rel="noreferrer" className="break-all text-indigo-700 hover:underline">
                    {submission.repositoryUrl}
                  </a>
                </div>
                {submission.description && (
                  <div className="mb-3 rounded-md border border-[var(--border)] bg-[var(--bg)] p-3 text-left font-mono text-sm text-[var(--text)]">
                    {submission.description}
                  </div>
                )}
                <div className="mb-3 text-xs font-mono text-slate-500">{new Date(submission.createdAt).toLocaleString()}</div>

                {canVote && (
                  <button
                    type="button"
                    onClick={() => void vote(task.id, submission.id)}
                    className={`border-2 px-3 py-1 text-xs font-mono ${
                      task.myVoteSubmissionId === submission.id
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-indigo-300 bg-white text-indigo-700'
                    }`}
                  >
                    {task.myVoteSubmissionId === submission.id ? 'Мой голос' : 'Голосовать'}
                  </button>
                )}
              </div>
            )
          })}

          {task.submissions.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm">Решений пока нет.</div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          to={`/submit/${task.id}`}
          className="flex flex-1 items-center justify-center gap-3 rounded-md border border-indigo-600 bg-indigo-600 px-8 py-4 font-mono text-white transition-colors hover:bg-indigo-500"
        >
          <Send className="h-5 w-5" />
          Отправить решение
        </Link>
        <Link
          to={`/leaderboard/${task.id}`}
          className="flex flex-1 items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-8 py-4 font-mono text-slate-700 transition-colors hover:bg-slate-100"
        >
          <TrendingUp className="h-5 w-5" />
          Лидерборд
        </Link>
      </div>
    </div>
  )
}
