import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function AuthLogin() {
  const navigate = useNavigate()
  const { isAuthenticated, login, loading, setError } = useAppData()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      await login(email, password)
      navigate('/profile')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка авторизации')
    }
  }

  return (
    <div className="mx-auto max-w-xl px-8 py-12">
      <div className="rounded-xl border border-[var(--secondary)] bg-[var(--surface)] p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-mono text-[var(--primary)]">Вход</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-[var(--secondary)] bg-[var(--background)] px-3 py-2 text-sm font-mono text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--surface-hover)]"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-[var(--secondary)] bg-[var(--background)] px-3 py-2 text-sm font-mono text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--surface-hover)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md border border-[var(--accent)] bg-[var(--secondary)] px-4 py-2 text-sm font-mono text-[var(--text)] transition-colors hover:bg-[var(--accent)] disabled:opacity-60"
          >
            Войти
          </button>
        </form>
        <div className="mt-4 text-center text-xs font-mono text-[var(--primary)]">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-[var(--accent)] hover:underline">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  )
}
