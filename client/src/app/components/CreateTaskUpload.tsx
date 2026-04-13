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
            <div className="flex h-8 w-8 items-center justify-center border-2 border-gray-800 bg-gray-800 font-mono text-sm text-white">
              1
            </div>
            <span className="text-sm font-mono">[Загрузка]</span>
          </div>
          <div className="h-0.5 w-16 bg-gray-400"></div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-gray-400 font-mono text-sm text-gray-400">
              2
            </div>
            <span className="text-sm font-mono text-gray-400">[Публикация]</span>
          </div>
        </div>
      </div>

      <div className="mb-6 border-2 border-gray-800 bg-white p-8">
        <h1 className="mb-8 text-xl font-mono">[СОЗДАНИЕ ЗАДАЧИ - ОСНОВНЫЕ ДАННЫЕ]</h1>

        <div className="mb-8 border-2 border-gray-400 p-6">
          <FolderGit2 className="mb-3 h-8 w-8" />
          <label className="mb-3 block text-sm font-mono">[URL репозитория]</label>
          <input
            value={createTaskDraft.repositoryUrl}
            onChange={(event) =>
              setCreateTaskDraft((prev) => ({
                ...prev,
                repositoryUrl: event.target.value,
              }))
            }
            className="w-full border-2 border-gray-400 p-3 font-mono text-sm"
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
            className="min-h-44 w-full border-2 border-gray-400 p-4 font-mono text-sm"
            placeholder="Опишите цель оптимизации и ожидаемый результат"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/" className="border-2 border-gray-800 px-8 py-4 font-mono transition-colors hover:bg-gray-100">
          [ОТМЕНА]
        </Link>
        <button
          type="button"
          onClick={() => navigate('/create/metrics')}
          className="flex flex-1 items-center justify-center gap-3 border-2 border-gray-800 bg-gray-800 px-8 py-4 font-mono text-white transition-colors hover:bg-gray-700"
        >
          [ДАЛЕЕ: ПУБЛИКАЦИЯ]
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
