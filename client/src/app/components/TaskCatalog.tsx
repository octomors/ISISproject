import { Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'
import type { Task } from '../types'

const DESCRIPTION_PREVIEW_LENGTH = 120
const DAY_MS = 24 * 60 * 60 * 1000

type DeadlineFilter = 'all' | 'expired' | 'day' | 'three-days' | 'week'
type SubmissionSort = 'more-first' | 'less-first'

function getDeadlineFilterLabel(value: DeadlineFilter) {
  switch (value) {
    case 'expired':
      return 'Уже закончилось'
    case 'day':
      return 'Остался 1 день'
    case 'three-days':
      return 'Осталось 3 дня'
    case 'week':
      return 'Осталась неделя'
    default:
      return 'Любой'
  }
}

function getStatusLabel(status: Task['status']) {
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

function getTitleMatchScore(title: string, query: string) {
  const normalizedTitle = title.toLowerCase()
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return 0
  }
  if (normalizedTitle === normalizedQuery) {
    return 1000
  }
  if (normalizedTitle.startsWith(normalizedQuery)) {
    return 800
  }

  const includeIndex = normalizedTitle.indexOf(normalizedQuery)
  if (includeIndex >= 0) {
    return Math.max(0, 600 - includeIndex)
  }

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean)
  let score = 0
  for (const word of queryWords) {
    if (normalizedTitle.startsWith(word)) {
      score += 120
      continue
    }
    const wordIndex = normalizedTitle.indexOf(word)
    if (wordIndex >= 0) {
      score += 60 - Math.min(wordIndex, 50)
    }
  }
  return score
}

function matchesDeadlineFilter(task: Task, filter: DeadlineFilter) {
  if (filter === 'all') {
    return true
  }

  const remainingMs = new Date(task.deadline).getTime() - Date.now()
  if (filter === 'expired') {
    return remainingMs <= 0
  }
  if (remainingMs <= 0) {
    return false
  }
  if (filter === 'day') {
    return remainingMs <= DAY_MS
  }
  if (filter === 'three-days') {
    return remainingMs <= 3 * DAY_MS
  }
  return remainingMs <= 7 * DAY_MS
}

export function TaskCatalog() {
  const { tasks, user, finalizeExpired, loading } = useAppData()
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>('all')
  const [submissionSort, setSubmissionSort] = useState<SubmissionSort>('more-first')
  const [titleSearch, setTitleSearch] = useState('')

  const filteredTasks = useMemo(() => {
    const normalizedSearch = titleSearch.trim().toLowerCase()
    const filtered = tasks.filter((task) => {
      if (!matchesDeadlineFilter(task, deadlineFilter)) {
        return false
      }
      if (!normalizedSearch) {
        return true
      }
      return getTitleMatchScore(task.title, normalizedSearch) > 0
    })

    return filtered.sort((a, b) => {
      const scoreA = normalizedSearch ? getTitleMatchScore(a.title, normalizedSearch) : 0
      const scoreB = normalizedSearch ? getTitleMatchScore(b.title, normalizedSearch) : 0
      if (scoreA !== scoreB) {
        return scoreB - scoreA
      }

      if (submissionSort === 'less-first') {
        return a.submissions.length - b.submissions.length
      }
      return b.submissions.length - a.submissions.length
    })
  }, [tasks, deadlineFilter, submissionSort, titleSearch])

  return (
    <div className="mx-auto max-w-7xl px-8 py-12">
      <div className="mb-12 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-600 to-cyan-600 p-12 text-white shadow-lg">
        <h1 className="mb-4 text-3xl font-mono">Каталог задач по оптимизации</h1>
        <p className="mb-6 text-sm font-mono text-indigo-100">
          Публикуйте задачи, отправляйте решения в чужие задачи, голосуйте и поднимайтесь в лидерборде.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/create/upload"
            className="inline-block rounded-md border border-white/60 bg-white/10 px-8 py-3 text-sm font-mono transition-colors hover:bg-white/20"
          >
            Создать задачу
          </Link>
          <button
            type="button"
            onClick={() => void finalizeExpired()}
            disabled={loading}
            className="rounded-md border border-cyan-200 bg-cyan-50 px-8 py-3 text-sm font-mono text-cyan-700 transition-colors hover:bg-cyan-100 disabled:opacity-60"
          >
            Закрыть просроченные
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          <Filter className="h-5 w-5 text-indigo-500" />
          <span className="text-sm font-mono">Фильтры и сортировка</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-mono text-slate-500">Дедлайн</label>
            <select
              value={deadlineFilter}
              onChange={(event) => setDeadlineFilter(event.target.value as DeadlineFilter)}
              className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm font-mono text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">{getDeadlineFilterLabel('all')}</option>
              <option value="expired">{getDeadlineFilterLabel('expired')}</option>
              <option value="day">{getDeadlineFilterLabel('day')}</option>
              <option value="three-days">{getDeadlineFilterLabel('three-days')}</option>
              <option value="week">{getDeadlineFilterLabel('week')}</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono text-slate-500">Сортировка по количеству решений</label>
            <select
              value={submissionSort}
              onChange={(event) => setSubmissionSort(event.target.value as SubmissionSort)}
              className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm font-mono text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="less-first">Сначала меньше отправленных решений</option>
              <option value="more-first">Сначала больше отправленных решений</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-mono text-slate-500">Поиск по названию</label>
            <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white p-2 text-sm font-mono text-slate-700 outline-none transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={titleSearch}
                onChange={(event) => setTitleSearch(event.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Введите название задачи"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredTasks.map((task) => (
          <Link key={task.id} to={`/task/${task.id}`}>
            <div className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 text-xs font-mono text-slate-500">Автор: {task.author.username}</div>
                  <h3 className="mb-2 break-words font-mono text-base">{task.title}</h3>
                  <div className="text-xs font-mono text-slate-500">Язык: {task.programmingLanguage}</div>
                </div>
                <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-mono text-amber-700">
                  {task.platformReward} баллов
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Статус:</span>
                  <span>{getStatusLabel(task.status)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Дедлайн:</span>
                  <span>{new Date(task.deadline).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Решений:</span>
                  <span>{task.submissions.length}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">URL репозитория:</span>
                  <span className="max-w-[13rem] truncate text-right">{task.repositoryUrl}</span>
                </div>
                <div className="pt-1 text-xs font-mono text-slate-500">
                  {task.description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}
                  {task.description.length > DESCRIPTION_PREVIEW_LENGTH ? '…' : ''}
                </div>
                {user?.id === task.author.id && <div className="text-xs font-mono text-indigo-700">Ваша задача</div>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center font-mono text-sm shadow-sm">
          По выбранным параметрам задачи не найдены.
        </div>
      )}
    </div>
  )
}
