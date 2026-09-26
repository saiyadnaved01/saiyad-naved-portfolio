import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Card, PageHeader } from '../components/ui'
import { useStatus, StatusBanner } from '../components/status'

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, showStatus] = useStatus()

  async function load() {
    setLoading(true)
    try {
      setMessages(await api.get('/api/messages'))
    } catch (err) {
      showStatus('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function markRead(id) {
    try {
      await api.put(`/api/messages/${id}/read`)
      load()
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this message?')) return
    try {
      await api.del(`/api/messages/${id}`)
      load()
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  return (
    <div>
      <PageHeader title="Messages" description="Submissions from your Contact form." />
      <StatusBanner status={status} />
      {loading && <p className="text-muted text-sm">Loading…</p>}
      {!loading && messages.length === 0 && <p className="text-muted text-sm italic">No messages yet.</p>}
      <div className="space-y-3">
        {messages.map((m) => (
          <Card key={m.id} className={!m.read ? 'border-acc1/50' : ''}>
            <div className="flex justify-between items-start mb-2 gap-3">
              <div>
                <h4 className="font-medium text-sm">{m.subject || '(No subject)'}</h4>
                <div className="text-xs text-muted mt-0.5">
                  {m.name} · {m.email} · {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                {!m.read && <button onClick={() => markRead(m.id)} className="text-xs text-acc1">Mark read</button>}
                <button onClick={() => remove(m.id)} className="text-xs text-red-400">Delete</button>
              </div>
            </div>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{m.message}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
