import { Filter, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function TaskCatalog() {
  const { tasks, user, finalizeExpired, loading } = useAppData()

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="mb-12 border-2 border-gray-800 bg-white p-12">
        <h1 className="mb-4 text-3xl font-mono">[КАТАЛОГ ЗАДАЧ ПО ОПТИМИЗАЦИИ]</h1>
        <p className="mb-6 text-sm font-mono text-gray-600">
          Публикуйте задачи, отправляйте решения в чужие задачи, голосуйте и поднимайтесь в лидерборде.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/create/upload"
            className="inline-block border-2 border-gray-800 px-8 py-3 text-sm font-mono transition-colors hover:bg-gray-800 hover:text-white"
          >
            [СОЗДАТЬ ЗАДАЧУ]
          </Link>
          <button
            type="button"
            onClick={() => void finalizeExpired()}
            disabled={loading}
            className="border-2 border-gray-800 px-8 py-3 text-sm font-mono"
          >
            [ЗАКРЫТЬ ПРОСРОЧЕННЫЕ]
          </button>
        </div>
      </div>

      <div className="mb-8 border-2 border-gray-800 bg-white p-6">
        <div className="mb-4 flex items-center gap-4">
          <Filter className="h-5 w-5" />
          <span className="text-sm font-mono">[ФИЛЬТРЫ]</span>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs font-mono text-gray-600">Статус</label>
            <div className="border-2 border-gray-400 p-2 text-sm font-mono">[Все ▼]</div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono text-gray-600">Награда</label>
            <div className="border-2 border-gray-400 p-2 text-sm font-mono">[Любая ▼]</div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono text-gray-600">Дедлайн</label>
            <div className="border-2 border-gray-400 p-2 text-sm font-mono">[Любой ▼]</div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono text-gray-600">Поиск</label>
            <div className="flex items-center gap-2 border-2 border-gray-400 p-2 text-sm font-mono">
              <Search className="h-4 w-4" />
              [По URL/описанию...]
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tasks.map((task) => (
          <Link key={task.id} to={`/task/${task.id}`}>
            <div className="cursor-pointer border-2 border-gray-800 bg-white p-6 transition-colors hover:bg-gray-100">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 text-xs font-mono text-gray-500">[Автор: {task.author.username}]</div>
                  <h3 className="mb-2 break-all font-mono text-base">{task.repositoryUrl}</h3>
                </div>
                <div className="border-2 border-gray-800 px-3 py-1 text-xs font-mono">{task.platformReward} баллов</div>
              </div>

              <div className="space-y-2 border-t-2 border-gray-400 pt-4">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-600">[Статус]:</span>
                  <span>{task.status}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-600">[Дедлайн]:</span>
                  <span>{new Date(task.deadline).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-600">[Решений]:</span>
                  <span>{task.submissions.length}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-600">[Мой голос]:</span>
                  <span>{task.myVoteSubmissionId ? 'Есть' : 'Нет'}</span>
                </div>
                <div className="pt-1 text-xs font-mono text-gray-500">{task.description.slice(0, 120)}{task.description.length > 120 ? '…' : ''}</div>
                {user?.id === task.author.id && <div className="text-xs font-mono text-gray-700">[Ваша задача]</div>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="border-2 border-gray-800 bg-white p-8 text-center font-mono text-sm">Задач пока нет.</div>
      )}
    </div>
  )
}
