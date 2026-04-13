import { CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function CreateTaskMetrics() {
  const navigate = useNavigate()
  const { createTaskDraft, setCreateTaskDraft, createTask, config, setError } = useAppData()
  const [publishing, setPublishing] = useState(false)

  async function handlePublish() {
    if (!createTaskDraft.repositoryUrl.trim() || !createTaskDraft.description.trim() || !createTaskDraft.deadline) {
      setError('Заполните repository URL, описание и дедлайн')
      return
    }

    try {
      setPublishing(true)
      const taskId = await createTask(createTaskDraft)
      navigate(`/task/${taskId}`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка публикации задачи')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <div className="mb-12">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-gray-800 bg-white font-mono text-sm">✓</div>
            <span className="text-sm font-mono">[Загрузка]</span>
          </div>
          <div className="h-0.5 w-16 bg-gray-800"></div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center border-2 border-gray-800 bg-gray-800 font-mono text-sm text-white">2</div>
            <span className="text-sm font-mono">[Публикация]</span>
          </div>
        </div>
      </div>

      <div className="mb-6 border-2 border-gray-800 bg-white p-8">
        <h1 className="mb-8 text-xl font-mono">[СОЗДАНИЕ ЗАДАЧИ - ПУБЛИКАЦИЯ]</h1>

        <div className="mb-6 space-y-4 border-2 border-gray-400 p-4 text-sm font-mono">
          <div>
            <div className="text-xs text-gray-600">[Репозиторий]</div>
            <div className="break-all">{createTaskDraft.repositoryUrl || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">[Описание]</div>
            <div className="whitespace-pre-wrap">{createTaskDraft.description || '—'}</div>
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-3 block text-sm font-mono">[Дедлайн]</label>
          <input
            type="datetime-local"
            value={createTaskDraft.deadline}
            onChange={(event) =>
              setCreateTaskDraft((prev) => ({
                ...prev,
                deadline: event.target.value,
              }))
            }
            className="w-full border-2 border-gray-400 p-3 font-mono text-sm"
          />
        </div>
      </div>

      <div className="mb-6 border-2 border-gray-800 bg-white p-8">
        <h2 className="mb-4 text-lg font-mono">[УСЛОВИЯ ПЛАТФОРМЫ ИЗ ТЗ]</h2>
        <div className="space-y-3 text-sm font-mono">
          <div className="border border-gray-400 p-3">Публикация списывает фиксированную стоимость: {config?.publishCost ?? 0} points.</div>
          <div className="border border-gray-400 p-3">Награда назначается платформой: {config?.platformReward ?? 0} points.</div>
          <div className="border border-gray-400 p-3">После дедлайна задача закрывается, победитель определяется по голосам.</div>
          <div className="border border-gray-400 p-3">При равенстве голосов побеждает более ранняя отправка.</div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/create/upload"
          className="border-2 border-gray-800 px-8 py-4 font-mono transition-colors hover:bg-gray-100"
        >
          [НАЗАД]
        </Link>
        <button
          type="button"
          onClick={() => void handlePublish()}
          disabled={publishing}
          className="flex flex-1 items-center justify-center gap-3 border-2 border-gray-800 bg-gray-800 px-8 py-4 font-mono text-white transition-colors disabled:opacity-50"
        >
          <CheckCircle className="h-5 w-5" />
          {publishing ? '[ПУБЛИКАЦИЯ...]' : '[ОПУБЛИКОВАТЬ ЗАДАЧУ]'}
        </button>
      </div>
    </div>
  )
}
