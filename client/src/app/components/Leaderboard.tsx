import { Trophy } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

const MAX_GLOBAL_LEADERBOARD_ENTRIES = 8

export function Leaderboard() {
  const { id } = useParams()
  const { tasks, leaderboard, user } = useAppData()
  const task = tasks.find((item) => item.id === id)

  if (!task) {
    return (
      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="border-2 border-[var(--secondary)] bg-[var(--surface)] p-8 font-mono">Задача не найдена.</div>
      </div>
    )
  }

  const taskRanking = [...task.submissions].sort((a, b) => {
    if (b.votes !== a.votes) {
      return b.votes - a.votes
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="mb-6 text-xs font-mono text-[var(--primary)]">
        <Link to="/" className="hover:underline">
          Каталог
        </Link>{' '}
        /
        <Link to={`/task/${id}`} className="hover:underline">
          {' '}
          Задача
        </Link>{' '}
        / Лидерборд
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-[var(--secondary)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-amber-500" />
                <div>
                  <h1 className="text-xl font-mono">Лидерборд задачи</h1>
                  <div className="text-xs font-mono text-[var(--text)]">{task.title}</div>
                  <div className="break-all text-xs font-mono text-[var(--primary)]">{task.repositoryUrl}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-[var(--primary)]">Дедлайн</div>
                <div className="font-mono text-sm">{new Date(task.deadline).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--secondary)] bg-[var(--surface)] shadow-sm">
            <div className="grid grid-cols-12 gap-4 border-b border-[var(--secondary)] bg-[var(--background)] p-4 text-xs font-mono text-[var(--primary)]">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">Участник</div>
              <div className="col-span-3 text-center">Голоса</div>
              <div className="col-span-4 text-center">Время отправки</div>
            </div>

            {taskRanking.map((entry, index) => (
              <div key={entry.id} className="grid grid-cols-12 items-center gap-4 border-b border-[var(--secondary)] p-4">
                <div className="col-span-1 text-center font-mono">{index + 1}</div>
                <div className="col-span-4 font-mono text-sm">{entry.author.username}</div>
                <div className="col-span-3 text-center font-mono">{entry.votes}</div>
                <div className="col-span-4 text-center font-mono text-xs text-[var(--primary)]">{new Date(entry.createdAt).toLocaleString()}</div>
              </div>
            ))}

            {taskRanking.length === 0 && (
              <div className="p-6 text-sm font-mono">Отправок пока нет.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--secondary)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-mono">Статистика задачи</h3>
            <div className="space-y-4">
              <div className="border-b border-[var(--secondary)] pb-3">
                <div className="mb-1 text-xs font-mono text-[var(--primary)]">Всего участников</div>
                <div className="font-mono text-2xl">{new Set(task.submissions.map((item) => item.author.id)).size}</div>
              </div>
              <div className="border-b border-[var(--secondary)] pb-3">
                <div className="mb-1 text-xs font-mono text-[var(--primary)]">Всего отправок</div>
                <div className="font-mono text-2xl">{task.submissions.length}</div>
              </div>
              <div>
                <div className="mb-1 text-xs font-mono text-[var(--primary)]">Награда</div>
                <div className="font-mono text-2xl">{task.platformReward}</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--secondary)] bg-[var(--surface)] p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-mono">Глобальный рейтинг</h3>
            <div className="space-y-2">
              {leaderboard.slice(0, MAX_GLOBAL_LEADERBOARD_ENTRIES).map((entry) => (
                <div
                  key={entry.user.id}
                  className={`flex items-center justify-between border p-2 text-xs font-mono ${
                    user?.id === entry.user.id
                      ? 'border-indigo-500/60 bg-indigo-950/40'
                      : 'border-[var(--secondary)] bg-[var(--background)]'
                  }`}
                >
                  <span>
                    #{entry.rank} {entry.user.username}
                  </span>
                  <span>{entry.user.pointsBalance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
