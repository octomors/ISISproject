import { Award, Calendar, Send, TrendingUp, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function TaskDetail() {
  const { id } = useParams()
  const { tasks, user, vote, isAuthenticated } = useAppData()
  const task = tasks.find((item) => item.id === id)

  if (!task) {
    return (
      <div className="mx-auto max-w-5xl px-8 py-12">
        <div className="border-2 border-gray-800 bg-white p-8 font-mono">Задача не найдена.</div>
      </div>
    )
  }

  const isTaskAuthor = user?.id === task.author.id
  const isTaskActive = task.status === 'active' && new Date(task.deadline) > new Date()

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <div className="mb-6 text-xs font-mono text-gray-500">
        <Link to="/" className="hover:underline">
          [Каталог]
        </Link>{' '}
        / [Задача #{task.id.slice(-6)}]
      </div>

      <div className="mb-6 border-2 border-gray-800 bg-white p-8">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="mb-2 text-xs font-mono text-gray-500">[Автор: {task.author.username}]</div>
            <h1 className="mb-4 break-all text-2xl font-mono">{task.repositoryUrl}</h1>
          </div>
          <div className="border-2 border-gray-800 px-6 py-2 font-mono">{task.platformReward} баллов</div>
        </div>

        <div className="grid gap-4 border-2 border-gray-400 p-4 md:grid-cols-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <div>
              <div className="text-xs font-mono text-gray-600">[Дедлайн]</div>
              <div className="text-sm font-mono">{new Date(task.deadline).toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <div>
              <div className="text-xs font-mono text-gray-600">[Участников]</div>
              <div className="text-sm font-mono">{new Set(task.submissions.map((item) => item.author.id)).size}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <div>
              <div className="text-xs font-mono text-gray-600">[Решений]</div>
              <div className="text-sm font-mono">{task.submissions.length}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            <div>
              <div className="text-xs font-mono text-gray-600">[Статус]</div>
              <div className="text-sm font-mono">[{isTaskActive ? 'active' : task.status}]</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 border-2 border-gray-800 bg-white p-8">
        <h2 className="mb-4 text-lg font-mono">[ОПИСАНИЕ ЗАДАЧИ]</h2>
        <div className="space-y-4 text-sm font-mono text-gray-700">
          <p>{task.description}</p>
          <p>
            Публикация оплачивается баллами, победитель определяется по голосам к дедлайну, при равенстве — по
            времени ранней отправки.
          </p>
        </div>
      </div>

      <div className="mb-6 border-2 border-gray-800 bg-white p-8">
        <h2 className="mb-4 text-lg font-mono">[РЕШЕНИЯ И ГОЛОСОВАНИЕ]</h2>
        <div className="space-y-3">
          {task.submissions.map((submission) => {
            const canVote =
              isAuthenticated && isTaskActive && !isTaskAuthor && submission.author.id !== user?.id

            return (
              <div key={submission.id} className="border-2 border-gray-400 p-4">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div className="font-mono text-sm">{submission.author.username}</div>
                  <div className="font-mono text-xs text-gray-600">голосов: {submission.votes}</div>
                </div>
                <div className="mb-3 whitespace-pre-wrap break-words font-mono text-sm">{submission.content}</div>
                <div className="mb-3 text-xs font-mono text-gray-500">{new Date(submission.createdAt).toLocaleString()}</div>

                {canVote && (
                  <button
                    type="button"
                    onClick={() => void vote(task.id, submission.id)}
                    className={`border-2 px-3 py-1 text-xs font-mono ${
                      task.myVoteSubmissionId === submission.id
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-800'
                    }`}
                  >
                    {task.myVoteSubmissionId === submission.id ? 'Мой голос' : 'Голосовать'}
                  </button>
                )}
              </div>
            )
          })}

          {task.submissions.length === 0 && (
            <div className="border-2 border-gray-400 p-4 font-mono text-sm">Решений пока нет.</div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          to={`/submit/${task.id}`}
          className="flex flex-1 items-center justify-center gap-3 border-2 border-gray-800 bg-gray-800 px-8 py-4 font-mono text-white transition-colors hover:bg-gray-700"
        >
          <Send className="h-5 w-5" />
          [ОТПРАВИТЬ РЕШЕНИЕ]
        </Link>
        <Link
          to={`/leaderboard/${task.id}`}
          className="flex flex-1 items-center justify-center gap-3 border-2 border-gray-800 px-8 py-4 font-mono transition-colors hover:bg-gray-800 hover:text-white"
        >
          <TrendingUp className="h-5 w-5" />
          [ЛИДЕРБОРД]
        </Link>
      </div>
    </div>
  )
}
