import { useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { api } from '../../api/client'
import { Field, Input, Button, Card, PageHeader } from '../components/ui'
import { useStatus, StatusBanner } from '../components/status'

const empty = { name: '', org: '', date: '' }

export default function CertificationsPage() {
  const { certifications, refresh } = useContent()
  const [draft, setDraft] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [status, showStatus] = useStatus()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!draft.name.trim()) return
    try {
      if (editingId) {
        await api.put(`/api/content/certifications/${editingId}`, draft)
      } else {
        await api.post('/api/content/certifications', draft)
      }
      await refresh()
      setDraft(empty)
      setEditingId(null)
      showStatus('success', 'Saved.')
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this certification?')) return
    try {
      await api.del(`/api/content/certifications/${id}`)
      await refresh()
      showStatus('success', 'Deleted.')
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  function edit(item) {
    setEditingId(item.id)
    setDraft({ name: item.name, org: item.org, date: item.date || '' })
  }
  function cancelEdit() {
    setEditingId(null)
    setDraft(empty)
  }

  return (
    <div>
      <PageHeader title="Certifications" description="Courses and virtual internships listed on the public site." />
      <StatusBanner status={status} />

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-3 items-end">
          <Field label="Name">
            <Input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="Issuing organization">
            <Input value={draft.org} onChange={(e) => setDraft({ ...draft, org: e.target.value })} />
          </Field>
          <Field label="Date (optional)">
            <Input value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
          </Field>
          <div className="md:col-span-3 flex gap-3">
            <Button type="submit">{editingId ? 'Update' : '+ Add certification'}</Button>
            {editingId && <Button type="button" variant="ghost" onClick={cancelEdit}>Cancel</Button>}
          </div>
        </form>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {certifications.map((c) => (
          <Card key={c.id}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium">{c.name}</h4>
                <div className="text-xs font-mono text-acc1 mt-1">
                  {c.org}
                  {c.date ? ` · ${c.date}` : ''}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => edit(c)} className="text-xs text-muted hover:text-white">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="text-xs text-red-400">Delete</button>
              </div>
            </div>
          </Card>
        ))}
        {certifications.length === 0 && <p className="text-muted text-sm italic md:col-span-2">No certifications yet.</p>}
      </div>
    </div>
  )
}
