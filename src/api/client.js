const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const TOKEN_KEY = 'admin_token'

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
  })
  if (res.status === 204) return null
  let data = null
  try {
    data = await res.json()
  } catch {
    // no body
  }
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),

  async upload(file) {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { ...authHeaders() },
      body: form,
    })
    let data = null
    try {
      data = await res.json()
    } catch {
      // no body
    }
    if (!res.ok) throw new Error(data?.error || 'Upload failed')
    return data // { url, type }
  },

  // Turns a backend-relative "/uploads/xyz.png" into an absolute URL.
  // Leaves already-absolute URLs (or bundled /photo.jpg-style paths that
  // don't exist on the backend) alone.
  fileUrl(url) {
    if (url && url.startsWith('/uploads')) return `${BASE_URL}${url}`
    return url
  },

  setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  BASE_URL,
}
