import { useState, type FormEvent } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function Layout() {
  const location = useLocation()
  const { user, config, isAuthenticated, login, register, logout, reload, loading, error, setError } = useAppData()
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      if (authMode === 'register') {
        await register(authForm.username, authForm.email, authForm.password)
      } else {
        await login(authForm.email, authForm.password)
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ошибка авторизации')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-cyan-50 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-6 px-8 py-6">
          <div className="flex items-center gap-8">
            <div className="flex h-9 w-32 items-center justify-center rounded-md border border-indigo-500 bg-indigo-600 shadow-sm">
              <Link to="/" className="text-sm font-mono text-white">
                ISISproject
              </Link>
            </div>
            <nav className="flex gap-6">
              <Link
                to="/"
                className={`rounded-md px-2 py-1 text-sm font-mono transition-colors ${
                  location.pathname === '/' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Каталог
              </Link>
              <Link
                to="/create/upload"
                className={`rounded-md px-2 py-1 text-sm font-mono transition-colors ${
                  location.pathname.includes('/create')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Создать задачу
              </Link>
            </nav>
          </div>

          {isAuthenticated ? (
            <section
              aria-label="User account information"
              className="space-y-2 rounded-lg border border-indigo-200 bg-white/90 p-3 shadow-sm"
            >
              <div className="text-xs font-mono text-slate-800">{user?.username}</div>
              <div className="text-xs font-mono text-slate-500">{user?.email}</div>
              <div className="text-xs font-mono text-slate-800">Баланс: {user?.pointsBalance ?? 0}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void reload()}
                  disabled={loading}
                  className="rounded-md border border-cyan-300 bg-cyan-50 px-2 py-1 text-xs font-mono text-cyan-700 transition-colors hover:bg-cyan-100 disabled:opacity-60"
                >
                  Обновить
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md border border-rose-300 bg-rose-50 px-2 py-1 text-xs font-mono text-rose-700 transition-colors hover:bg-rose-100"
                >
                  Выйти
                </button>
              </div>
            </section>
          ) : (
            <form
              onSubmit={handleAuthSubmit}
              className="w-full max-w-sm space-y-2 rounded-lg border border-indigo-200 bg-white/90 p-3 shadow-sm"
            >
              <div className="text-xs font-mono text-slate-700">
                {authMode === 'register' ? 'Регистрация' : 'Email'}
              </div>
              {authMode === 'register' && (
                <input
                  required
                  placeholder="Username"
                  value={authForm.username}
                  onChange={(event) => setAuthForm((prev) => ({ ...prev, username: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-mono text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              )}
              <input
                required
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-mono text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-mono text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md border border-indigo-600 bg-indigo-600 px-2 py-1 text-xs font-mono text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
                >
                  {authMode === 'register' ? 'Создать' : 'Войти'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode((prev) => (prev === 'register' ? 'login' : 'register'))
                    setError('')
                  }}
                  className="rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-mono text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {authMode === 'register' ? 'Есть аккаунт' : 'Нет аккаунта'}
                </button>
              </div>
            </form>
          )}
        </div>

        {config && (
          <div className="mx-auto max-w-7xl border-t border-indigo-100 px-8 py-2 text-xs font-mono text-slate-600">
            publish_cost={config.publishCost} • platform_reward={config.platformReward} • initial_points={config.initialPoints}
          </div>
        )}

        {error && <div className="mx-auto max-w-7xl px-8 pb-3 text-xs font-mono text-rose-700">Ошибка: {error}</div>}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-indigo-200 bg-white/90">
        <div className="mx-auto max-w-7xl px-8 py-6 text-center text-xs font-mono text-slate-500">
          Платформа коллективной оптимизации кода
        </div>
      </footer>
    </div>
  )
}
