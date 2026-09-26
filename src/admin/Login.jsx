import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, isAuthed } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAuthed) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(username, password)
      navigate(location.state?.from?.pathname || '/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-surface border border-border rounded-2xl p-8">
        <div className="font-mono text-xs text-acc2 mb-2">Admin</div>
        <h1 className="font-head text-2xl font-semibold mb-6">Sign in to your dashboard</h1>

        <label className="text-xs text-muted block mb-1">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
          autoComplete="username"
          className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-acc1"
        />

        <label className="text-xs text-muted block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-acc1"
        />

        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

        <button
          disabled={busy}
          type="submit"
          className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-grad disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign In'}
        </button>

        <a href="/" className="block text-center text-xs text-muted mt-5 hover:text-acc1">
          ← Back to site
        </a>
      </form>
    </div>
  )
}
