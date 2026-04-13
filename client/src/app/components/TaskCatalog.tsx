import { Filter, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

const DESCRIPTION_PREVIEW_LENGTH = 120

export function TaskCatalog() {
  const { tasks, user, finalizeExpired, loading } = useAppData()

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="mb-12 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-cyan-600 p-12 text-white shadow-lg">
        <h1 className="mb-4 text-3xl font-mono">[КАТАЛОГ ЗАДАЧ ПО ОПТИМИЗАЦИИ]</h1>
        <p className="mb-6 text-sm font-mono text-indigo-100">
          Публикуйте задачи, отправляйте решения в чужие задачи, голосуйте и поднимайтесь в лидерборде.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/create/upload"
            className="inline-block rounded-md border border-white/60 bg-white/10 px-8 py-3 text-sm font-mono transition-colors hover:bg-white/20"
          >
            [СОЗДАТЬ ЗАДАЧУ]
          </Link>
          <button
            type="button"
            onClick={() => void finalizeExpired()}
            disabled={loading}
            className="rounded-md border border-cyan-200 bg-cyan-50 px-8 py-3 text-sm font-mono text-cyan-700 transition-colors hover:bg-cyan-100 disabled:opacity-60"
          >
            [ЗАКРЫТЬ ПРОСРОЧЕННЫЕ]
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <Filter className="h-5 w-5 text-indigo-500" />
          <span className="text-sm font-mono">[ФИЛЬТРЫ]</span>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs font-mono text-slate-500">Статус</label>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-sm font-mono text-slate-700">[Все ▼]</div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono text-slate-500">Награда</label>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-sm font-mono text-slate-700">[Любая ▼]</div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono text-slate-500">Дедлайн</label>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-sm font-mono text-slate-700">[Любой ▼]</div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono text-slate-500">Поиск</label>
            <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-sm font-mono text-slate-700">
              <Search className="h-4 w-4 text-slate-400" />
              [По URL/описанию...]
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tasks.map((task) => (
          <Link key={task.id} to={`/task/${task.id}`}>
            <div className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 text-xs font-mono text-slate-500">[Автор: {task.author.username}]</div>
                  <h3 className="mb-2 break-all font-mono text-base">{task.repositoryUrl}</h3>
                </div>
                <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-mono text-amber-700">
                  {task.platformReward} баллов
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">[Статус]:</span>
                  <span>{task.status}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">[Дедлайн]:</span>
                  <span>{new Date(task.deadline).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">[Решений]:</span>
                  <span>{task.submissions.length}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">[Мой голос]:</span>
                  <span>{task.myVoteSubmissionId ? 'Есть' : 'Нет'}</span>
                </div>
                <div className="pt-1 text-xs font-mono text-slate-500">
                  {task.description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}
                  {task.description.length > DESCRIPTION_PREVIEW_LENGTH ? '…' : ''}
                </div>
                {user?.id === task.author.id && <div className="text-xs font-mono text-indigo-700">[Ваша задача]</div>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center font-mono text-sm shadow-sm">Задач пока нет.</div>
      )}
    </div>
  )
}
