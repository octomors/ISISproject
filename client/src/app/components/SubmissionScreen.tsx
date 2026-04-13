import { CheckCircle, Clock, Upload } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function SubmissionScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tasks, createSubmission, setError } = useAppData()
  const task = tasks.find((item) => item.id === id)
  const [content, setContent] = useState('')
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
    if (!content.trim()) {
      setError('Введите текст решения перед отправкой')
      return
    }

    try {
      setStatus('uploading')
      await createSubmission(taskId, content)
      setStatus('success')
      setTimeout(() => {
        navigate(`/task/${id}`)
      }, 1200)
    } catch (requestError) {
      setStatus('idle')
      setError(requestError instanceof Error ? requestError.message : 'Ошибка отправки решения')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <div className="mb-6 text-xs font-mono text-gray-500">
        <Link to="/" className="hover:underline">
          [Каталог]
        </Link>{' '}
        /
        <Link to={`/task/${id}`} className="hover:underline">
          {' '}
          [Задача]
        </Link>{' '}
        / [Отправка решения]
      </div>

      <div className="mb-8 border-2 border-gray-800 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-1 text-xs font-mono text-gray-500">[ЗАДАЧА]</div>
            <div className="font-mono">{task.repositoryUrl}</div>
          </div>
          <div className="text-xs font-mono text-gray-600">[Дедлайн: {new Date(task.deadline).toLocaleString()}]</div>
        </div>
      </div>

      <div className="mb-6 border-2 border-gray-800 bg-white p-8">
        <h1 className="mb-6 text-xl font-mono">[ЗАГРУЗКА РЕШЕНИЯ]</h1>

        <div className="mb-6">
          <label className="mb-3 block text-sm font-mono">[Патч / Архив / Описание оптимизации]</label>
          <div className="cursor-pointer border-2 border-dashed border-gray-400 p-8 text-center transition-colors hover:border-gray-800">
            <Upload className="mx-auto mb-4 h-10 w-10 text-gray-400" />
            <div className="text-sm font-mono text-gray-600">API сейчас принимает текстовое содержимое решения.</div>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-3 block text-sm font-mono">[Содержимое решения]</label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="min-h-40 w-full border-2 border-gray-400 p-4 font-mono text-sm"
            placeholder="Опишите ваш патч, вставьте diff или ссылку на архив"
          />
        </div>

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!canSubmit || status !== 'idle'}
          className="w-full border-2 border-gray-800 bg-gray-800 px-8 py-4 font-mono text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!canSubmit ? '[ЗАДАЧА ЗАКРЫТА]' : status === 'uploading' ? '[ОТПРАВКА...]' : status === 'success' ? '[ОТПРАВЛЕНО]' : '[ОТПРАВИТЬ РЕШЕНИЕ]'}
        </button>
      </div>

      {status !== 'idle' && (
        <div className="border-2 border-gray-800 bg-white p-8">
          <h2 className="mb-4 text-lg font-mono">[СТАТУС]</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 border-2 border-gray-400 p-4">
              {status === 'uploading' ? <Clock className="h-6 w-6 animate-pulse" /> : <CheckCircle className="h-6 w-6" />}
              <div className="font-mono text-sm">Загрузка и регистрация решения</div>
            </div>
            {status === 'success' && (
              <div className="flex items-center gap-3 border-2 border-gray-400 p-4">
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
