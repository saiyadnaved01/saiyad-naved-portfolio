import { useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { api } from '../../api/client'
import { Field, Input, TextArea, Button, Card, PageHeader } from '../components/ui'
import { useStatus, StatusBanner } from '../components/status'

const empty = { name: '', summary: '', tech: '', details: '', github: '', live: '' }

function toForm(p) {
  return {
    name: p.name,
    summary: p.summary,
    tech: (p.tech || []).join(', '),
    details: (p.details || []).join('\n'),
    github: p.github || '',
    live: p.live || '',
  }
}
function toPayload(f) {
  return {
    name: f.name,
    summary: f.summary,
    tech: f.tech.split(',').map((s) => s.trim()).filter(Boolean),
    details: f.details.split('\n').map((s) => s.trim()).filter(Boolean),
    github: f.github,
    live: f.live,
  }
}

export default function ProjectsPage() {
  const { projects, refresh } = useContent()
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(empty)
  const [showForm, setShowForm] = useState(false)
  const [status, showStatus] = useStatus()

  function startNew() {
    setEditingId(null)
    setDraft(empty)
    setShowForm(true)
  }
  function startEdit(p) {
    setEditingId(p.id)
    setDraft(toForm(p))
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const payload = toPayload(draft)
      if (editingId) await api.put(`/api/content/projects/${editingId}`, payload)
      else await api.post('/api/content/projects', payload)
      await refresh()
      setShowForm(false)
      showStatus('success', 'Project saved.')
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return
    try {
      await api.del(`/api/content/projects/${id}`)
      await refresh()
      showStatus('success', 'Deleted.')
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Project cards shown in the Projects section."
        action={<Button onClick={startNew}>+ Add project</Button>}
      />
      <StatusBanner status={status} />

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-4">
            <Field label="Project name" className="md:col-span-2">
              <Input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <Field label="Summary" className="md:col-span-2">
              <TextArea value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} />
            </Field>
            <Field label="Technologies (comma-separated)">
              <Input value={draft.tech} onChange={(e) => setDraft({ ...draft, tech: e.target.value })} />
            </Field>
            <Field label="GitHub link">
              <Input value={draft.github} onChange={(e) => setDraft({ ...draft, github: e.target.value })} />
            </Field>
            <Field label="Live demo link">
              <Input value={draft.live} onChange={(e) => setDraft({ ...draft, live: e.target.value })} />
            </Field>
            <Field label="Detail bullets (one per line)" className="md:col-span-2">
              <TextArea value={draft.details} onChange={(e) => setDraft({ ...draft, details: e.target.value })} />
            </Field>
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit">{editingId ? 'Update project' : 'Save project'}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <Card key={p.id}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{p.name}</h4>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(p)} className="text-xs text-muted hover:text-white">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400">Delete</button>
              </div>
            </div>
            <p className="text-sm text-muted mb-2">{p.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {(p.tech || []).map((t) => (
                <span key={t} className="text-[11px] px-2 py-1 rounded bg-surface2 border border-border">{t}</span>
              ))}
            </div>
          </Card>
        ))}
        {projects.length === 0 && <p className="text-muted text-sm italic md:col-span-2">No projects yet.</p>}
      </div>
    </div>
  )
}
