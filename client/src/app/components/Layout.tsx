import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAppData } from '../context/AppDataContext'

export function Layout() {
  const location = useLocation()
  const { isAuthenticated, error, setError } = useAppData()

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <header className="border-b border-[var(--secondary)] bg-[var(--surface)] shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-6 px-8 py-6">
          <div className="flex items-center gap-8">
            <div className="flex h-9 w-32 items-center justify-center rounded-md border border-[var(--accent)] bg-[var(--secondary)] shadow-sm">
              <Link to="/" className="text-sm font-mono text-[var(--text)]">
                ISISproject
              </Link>
            </div>
            <nav className="flex gap-6">
              <Link
                to="/"
                className={`rounded-md px-2 py-1 text-sm font-mono transition-colors ${
                  location.pathname === '/'
                    ? 'bg-[var(--secondary)] text-[var(--text)]'
                    : 'text-[var(--primary)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                Каталог
              </Link>
              <Link
                to="/create/upload"
                className={`rounded-md px-2 py-1 text-sm font-mono transition-colors ${
                  location.pathname.includes('/create')
                    ? 'bg-[var(--secondary)] text-[var(--text)]'
                    : 'text-[var(--primary)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                Создать задачу
              </Link>
            </nav>
          </div>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className={`rounded-md border px-4 py-2 text-xs font-mono transition-colors ${
                location.pathname === '/profile'
                  ? 'border-[var(--accent)] bg-[var(--secondary)] text-[var(--text)]'
                  : 'border-[var(--secondary)] bg-[var(--surface)] text-[var(--primary)] hover:bg-[var(--surface-hover)]'
              }`}
              onClick={() => setError('')}
            >
              Личный кабинет
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-md border border-[var(--secondary)] bg-[var(--surface)] px-4 py-2 text-xs font-mono text-[var(--primary)] transition-colors hover:bg-[var(--surface-hover)]"
                onClick={() => setError('')}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="rounded-md border border-[var(--accent)] bg-[var(--secondary)] px-4 py-2 text-xs font-mono text-[var(--text)] transition-colors hover:bg-[var(--accent)]"
                onClick={() => setError('')}
              >
                Зарегистрироваться
              </Link>
            </div>
          )}
        </div>

        {error && <div className="mx-auto max-w-7xl px-8 pb-3 text-xs font-mono text-red-400">Ошибка: {error}</div>}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-[var(--secondary)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-8 py-6 text-center text-xs font-mono text-[var(--primary)]">
          Платформа коллективной оптимизации кода
        </div>
      </footer>
    </div>
  )
}
