import { CheckCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function SubmissionScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, createSubmission, setError } = useAppData()
  const task = tasks.find((item) => item.id === id)
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle')

  if (!id || !task) {
    return (
      <div className="mx-auto max-w-4xl px-8 py-12">
        <div className="border-2 border-gray-800 bg-white p-8 font-mono">Задача не найдена.</div>
      </div>
    )
  }

  const taskId = task.id
  const canSubmit = task.status === 'active' && new Date(task.deadline) > new Date()

  async function handleSubmit() {
    if (!repositoryUrl.trim()) {
      setError('Введите ссылку на репозиторий решения перед отправкой')
      return
    }

    try {
      setStatus('uploading')
      await createSubmission(taskId, repositoryUrl, description)
      setStatus('success')
      setTimeout(() => {
        navigate(`/task/${taskId}`)
      }, 1200)
    } catch (requestError) {
      setStatus('idle')
      setError(requestError instanceof Error ? requestError.message : 'Ошибка отправки решения')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <div className="mb-6 text-xs font-mono text-slate-500">
        <Link to="/" className="hover:underline">
          Каталог
        </Link>{' '}
        /
        <Link to={`/task/${id}`} className="hover:underline">
          {' '}
          Задача
        </Link>{' '}
        / Отправка решения
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 text-xs font-mono text-slate-500">Задача</div>
            <div className="font-mono">{task.title}</div>
          </div>
          <div className="text-xs font-mono text-slate-500">Дедлайн: {new Date(task.deadline).toLocaleString()}</div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-mono">Отправка решения</h1>

        <div className="mb-6">
          <label htmlFor="submission-repository-url" className="mb-3 block text-sm font-mono">
            URL репозитория решения *
          </label>
          <input
            id="submission-repository-url"
            value={repositoryUrl}
            onChange={(event) => setRepositoryUrl(event.target.value)}
            required
            aria-required="true"
            aria-label="URL репозитория решения, обязательное поле"
            className="w-full rounded-md border border-slate-300 bg-white p-4 font-mono text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="submission-description" className="mb-3 block text-sm font-mono">
            Текстовое описание решения (необязательно)
          </label>
          <textarea
            id="submission-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-describedby="submission-description-hint"
            className="min-h-28 w-full rounded-md border border-slate-300 bg-white p-4 font-mono text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="Кратко опишите подход и ключевые изменения"
            maxLength={3000}
          />
          <div id="submission-description-hint" className="mt-2 text-xs font-mono text-slate-500">
            До 3000 символов.
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!canSubmit || status !== 'idle'}
          className="w-full rounded-md border border-indigo-600 bg-indigo-600 px-8 py-4 font-mono text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!canSubmit ? 'Задача закрыта' : status === 'uploading' ? 'Отправка...' : status === 'success' ? 'Отправлено' : 'Отправить решение'}
        </button>
      </div>

      {status !== 'idle' && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-lg font-mono">Статус</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              {status === 'uploading' ? <Clock className="h-6 w-6 animate-pulse" /> : <CheckCircle className="h-6 w-6" />}
              <div className="font-mono text-sm">Проверка и регистрация ссылки на решение</div>
            </div>
            {status === 'success' && (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <CheckCircle className="h-6 w-6" />
                <div className="font-mono text-sm">Решение принято, возврат на страницу задачи…</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
