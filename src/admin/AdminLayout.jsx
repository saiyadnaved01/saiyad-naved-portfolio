import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/profile', label: 'Profile & About' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/education', label: 'Education' },
  { to: '/admin/certifications', label: 'Certifications' },
  { to: '/admin/techstack', label: 'Tech Stack' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout() {
  const { logout, username } = useAuth()

  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="w-64 flex-shrink-0 border-r border-border p-6 hidden md:flex md:flex-col">
        <a href="/" className="font-head font-semibold text-lg mb-8">
          Portfolio<span className="grad-text">.</span>{' '}
          <span className="text-muted text-xs font-normal">admin</span>
        </a>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm px-3 py-2 rounded-lg ${isActive ? 'bg-surface2 text-acc1' : 'text-muted hover:text-white hover:bg-surface2'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 border-t border-border mt-4">
          <div className="text-xs text-muted mb-2 truncate">Signed in as {username}</div>
          <button
            onClick={logout}
            className="text-xs px-3 py-2 rounded-lg border border-border text-muted hover:text-white hover:border-acc1 w-full"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <span className="font-head font-semibold">Admin</span>
          <button onClick={logout} className="text-xs text-muted">Log out</button>
        </div>
        <div className="md:hidden flex gap-2 overflow-x-auto px-4 py-3 border-b border-border">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-xs px-3 py-1.5 rounded-full border whitespace-nowrap ${isActive ? 'border-acc1 text-acc1' : 'border-border text-muted'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="p-6 md:p-10 max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
