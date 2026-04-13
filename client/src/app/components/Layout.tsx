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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b-2 border-gray-800 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-6 px-8 py-6">
          <div className="flex items-center gap-8">
            <div className="flex h-8 w-32 items-center justify-center border-2 border-gray-800">
              <Link to="/" className="text-sm font-mono">
                ISISproject
              </Link>
            </div>
            <nav className="flex gap-6">
              <Link to="/" className={`text-sm font-mono ${location.pathname === '/' ? 'underline' : ''}`}>
                [Каталог]
              </Link>
              <Link
                to="/create/upload"
                className={`text-sm font-mono ${location.pathname.includes('/create') ? 'underline' : ''}`}
              >
                [Создать задачу]
              </Link>
            </nav>
          </div>

          {isAuthenticated ? (
            <section aria-label="User account information" className="space-y-2 border-2 border-gray-800 p-3">
              <div className="text-xs font-mono">{user?.username}</div>
              <div className="text-xs font-mono text-gray-600">{user?.email}</div>
              <div className="text-xs font-mono">Баланс: {user?.pointsBalance ?? 0}</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void reload()}
                  disabled={loading}
                  className="border border-gray-800 px-2 py-1 text-xs font-mono"
                >
                  Обновить
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="border border-gray-800 px-2 py-1 text-xs font-mono"
                >
                  Выйти
                </button>
              </div>
            </section>
          ) : (
            <form onSubmit={handleAuthSubmit} className="w-full max-w-sm space-y-2 border-2 border-gray-800 p-3">
              <div className="text-xs font-mono">{authMode === 'register' ? 'Регистрация' : 'Логин'}</div>
              {authMode === 'register' && (
                <input
                  required
                  placeholder="Username"
                  value={authForm.username}
                  onChange={(event) => setAuthForm((prev) => ({ ...prev, username: event.target.value }))}
                  className="w-full border border-gray-400 px-2 py-1 text-xs font-mono"
                />
              )}
              <input
                required
                type="email"
                placeholder="Email"
                value={authForm.email}
                onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full border border-gray-400 px-2 py-1 text-xs font-mono"
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={authForm.password}
                onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full border border-gray-400 px-2 py-1 text-xs font-mono"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="border border-gray-800 px-2 py-1 text-xs font-mono">
                  {authMode === 'register' ? 'Создать' : 'Войти'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode((prev) => (prev === 'register' ? 'login' : 'register'))
                    setError('')
                  }}
                  className="border border-gray-800 px-2 py-1 text-xs font-mono"
                >
                  {authMode === 'register' ? 'Есть аккаунт' : 'Нет аккаунта'}
                </button>
              </div>
            </form>
          )}
        </div>

        {config && (
          <div className="mx-auto max-w-7xl border-t border-gray-400 px-8 py-2 text-xs font-mono text-gray-600">
            publish_cost={config.publishCost} • platform_reward={config.platformReward} • initial_points={config.initialPoints}
          </div>
        )}

        {error && <div className="mx-auto max-w-7xl px-8 pb-3 text-xs font-mono text-red-700">Ошибка: {error}</div>}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t-2 border-gray-800 bg-white">
        <div className="mx-auto max-w-7xl px-8 py-6 text-center text-xs font-mono text-gray-500">
          [Платформа коллективной оптимизации кода]
        </div>
      </footer>
    </div>
  )
}
