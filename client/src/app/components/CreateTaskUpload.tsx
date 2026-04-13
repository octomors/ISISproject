import { ArrowRight, FolderGit2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function CreateTaskUpload() {
  const navigate = useNavigate()
  const { createTaskDraft, setCreateTaskDraft } = useAppData()

  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <div className="mb-12">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-600 bg-indigo-600 font-mono text-sm text-white">
              1
            </div>
            <span className="text-sm font-mono">[Загрузка]</span>
          </div>
          <div className="h-0.5 w-16 bg-indigo-300"></div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 font-mono text-sm text-slate-400">
              2
            </div>
            <span className="text-sm font-mono text-slate-400">[Публикация]</span>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-xl font-mono">[СОЗДАНИЕ ЗАДАЧИ - ОСНОВНЫЕ ДАННЫЕ]</h1>

        <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-6">
          <FolderGit2 className="mb-3 h-8 w-8 text-indigo-500" />
          <label className="mb-3 block text-sm font-mono">[URL репозитория]</label>
          <input
            value={createTaskDraft.repositoryUrl}
            onChange={(event) =>
              setCreateTaskDraft((prev) => ({
                ...prev,
                repositoryUrl: event.target.value,
              }))
            }
            className="w-full rounded-md border border-slate-300 bg-white p-3 font-mono text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="https://github.com/username/repo.git"
          />
        </div>

        <div className="mb-8">
          <label className="mb-3 block text-sm font-mono">[Описание задачи]</label>
          <textarea
            value={createTaskDraft.description}
            onChange={(event) =>
              setCreateTaskDraft((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            className="min-h-44 w-full rounded-md border border-slate-300 bg-white p-4 font-mono text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="Опишите цель оптимизации и ожидаемый результат"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/"
          className="rounded-md border border-slate-300 bg-white px-8 py-4 font-mono text-slate-700 transition-colors hover:bg-slate-100"
        >
          [ОТМЕНА]
        </Link>
        <button
          type="button"
          onClick={() => navigate('/create/metrics')}
          className="flex flex-1 items-center justify-center gap-3 rounded-md border border-indigo-600 bg-indigo-600 px-8 py-4 font-mono text-white transition-colors hover:bg-indigo-500"
        >
          [ДАЛЕЕ: ПУБЛИКАЦИЯ]
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
