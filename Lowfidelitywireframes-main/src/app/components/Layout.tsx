import { Outlet, Link, useLocation } from "react-router";

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b-2 border-gray-800 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="w-32 h-8 border-2 border-gray-800 flex items-center justify-center">
                <Link to="/" className="text-sm font-mono">LOGO</Link>
              </div>
              <nav className="flex gap-6">
                <Link
                  to="/"
                  className={`text-sm font-mono ${location.pathname === '/' ? 'underline' : ''}`}
                >
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
            <div className="w-24 h-8 border-2 border-gray-800 flex items-center justify-center">
              <span className="text-xs font-mono">USER</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-800 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="text-xs font-mono text-gray-500 text-center">
            [FOOTER CONTENT]
          </div>
        </div>
      </footer>
    </div>
  );
}
