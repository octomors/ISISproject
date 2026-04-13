import { CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function CreateTaskMetrics() {
  const navigate = useNavigate()
  const { createTaskDraft, setCreateTaskDraft, createTask, config, setError } = useAppData()
  const [publishing, setPublishing] = useState(false)

  async function handlePublish() {
    if (
      !createTaskDraft.title.trim() ||
      !createTaskDraft.programmingLanguage.trim() ||
      !createTaskDraft.repositoryUrl.trim() ||
      !createTaskDraft.description.trim() ||
      !createTaskDraft.deadline
    ) {
      setError('Заполните название, язык программирования, repository URL, описание и дедлайн')
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
            <div
              aria-label="Шаг загрузки завершен"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500 bg-emerald-50 font-mono text-sm text-emerald-700"
            >
              ✓
            </div>
            <span className="text-sm font-mono">Основные данные</span>
          </div>
          <div className="h-0.5 w-16 bg-indigo-500"></div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-600 bg-indigo-600 font-mono text-sm text-white">2</div>
            <span className="text-sm font-mono">Публикация</span>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-[var(--secondary)] bg-[var(--surface)] p-8 shadow-sm">
        <h1 className="mb-8 text-xl font-mono">Создание задачи — публикация</h1>

        <div className="mb-6 space-y-4 rounded-lg border border-[var(--secondary)] bg-[var(--background)] p-4 text-sm font-mono">
          <div>
            <div className="text-xs text-[var(--primary)]">Название</div>
            <div className="break-all">{createTaskDraft.title || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--primary)]">Язык программирования</div>
            <div className="break-all">{createTaskDraft.programmingLanguage || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--primary)]">Репозиторий</div>
            <div className="break-all">{createTaskDraft.repositoryUrl || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--primary)]">Описание</div>
            <div className="whitespace-pre-wrap">{createTaskDraft.description || '—'}</div>
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-3 block text-sm font-mono">Дедлайн</label>
          <input
            type="datetime-local"
            value={createTaskDraft.deadline}
            onChange={(event) =>
              setCreateTaskDraft((prev) => ({
                ...prev,
                deadline: event.target.value,
              }))
            }
            className="w-full rounded-md border border-[var(--secondary)] bg-[var(--background)] p-3 font-mono text-sm text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--surface-hover)]"
          />
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-[var(--secondary)] bg-[var(--surface)] p-8 shadow-sm">
        <h2 className="mb-4 text-lg font-mono">Условия платформы из ТЗ</h2>
        <div className="space-y-3 text-sm font-mono">
          <div className="rounded-md border border-[var(--secondary)] bg-[var(--background)] p-3">Публикация списывает фиксированную стоимость: {config?.publishCost ?? 0} points.</div>
          <div className="rounded-md border border-[var(--secondary)] bg-[var(--background)] p-3">Награда назначается платформой: {config?.platformReward ?? 0} points.</div>
          <div className="rounded-md border border-[var(--secondary)] bg-[var(--background)] p-3">После дедлайна задача закрывается, победитель определяется по голосам.</div>
          <div className="rounded-md border border-[var(--secondary)] bg-[var(--background)] p-3">При равенстве голосов побеждает более ранняя отправка.</div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to="/create/upload"
          className="rounded-md border border-[var(--secondary)] bg-[var(--surface)] px-8 py-4 font-mono text-[var(--primary)] transition-colors hover:bg-[var(--surface-hover)]"
        >
          Назад
        </Link>
        <button
          type="button"
          onClick={() => void handlePublish()}
          disabled={publishing}
          className="flex flex-1 items-center justify-center gap-3 rounded-md border border-indigo-600 bg-indigo-600 px-8 py-4 font-mono text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          <CheckCircle className="h-5 w-5" />
          {publishing ? 'Публикация...' : 'Опубликовать задачу'}
        </button>
      </div>
    </div>
  )
}
