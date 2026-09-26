import { useState, useEffect } from 'react'
import { useContent } from '../../context/ContentContext'
import { api } from '../../api/client'
import { Field, Input, TextArea, Button, Card, PageHeader } from '../components/ui'
import { useStatus, StatusBanner } from '../components/status'

const emptyEntry = {
  company: '', companyAlt: '', roleTitle: '', employmentType: '',
  startDate: '', endDate: '', current: false, location: '',
  description: '', responsibilities: '', technologies: '', contributions: '',
  website: '', linkedin: '', github: '', liveWork: '',
}

function EntryEditor({ entry, refresh }) {
  const [form, setForm] = useState(entry)
  const [saving, setSaving] = useState(false)
  const [status, showStatus] = useStatus()
  const [certForm, setCertForm] = useState(null)
  const [linkForm, setLinkForm] = useState(null)

  useEffect(() => setForm(entry), [entry])

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSave() {
    setSaving(true)
    try {
      await api.put(`/api/content/experience/${entry.id}`, form)
      await refresh()
      showStatus('success', 'Saved.')
    } catch (err) {
      showStatus('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteEntry() {
    if (!confirm('Delete this experience entry and all its certificates/links?')) return
    try {
      await api.del(`/api/content/experience/${entry.id}`)
      await refresh()
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  async function handleAddCert(e) {
    e.preventDefault()
    try {
      let fileUrl = '', fileType = ''
      if (certForm.file) {
        const up = await api.upload(certForm.file)
        fileUrl = up.url
        fileType = up.type
      }
      await api.post(`/api/content/experience/${entry.id}/certificates`, {
        title: certForm.title, issuer: certForm.issuer, date: certForm.date, desc: certForm.desc, fileUrl, fileType,
      })
      await refresh()
      setCertForm(null)
      showStatus('success', 'Certificate added.')
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  async function handleDeleteCert(certId) {
    try {
      await api.del(`/api/content/experience/${entry.id}/certificates/${certId}`)
      await refresh()
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  async function handleAddLink(e) {
    e.preventDefault()
    try {
      await api.post(`/api/content/experience/${entry.id}/links`, linkForm)
      await refresh()
      setLinkForm(null)
      showStatus('success', 'Link added.')
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  async function handleDeleteLink(linkId) {
    try {
      await api.del(`/api/content/experience/${entry.id}/links/${linkId}`)
      await refresh()
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  return (
    <Card className="mb-6">
      <StatusBanner status={status} />

      <div className="grid md:grid-cols-2 gap-x-4">
        <Field label="Company"><Input value={form.company} onChange={(e) => set('company')(e.target.value)} /></Field>
        <Field label="Company (alt name)"><Input value={form.companyAlt} onChange={(e) => set('companyAlt')(e.target.value)} /></Field>
        <Field label="Role title"><Input value={form.roleTitle} onChange={(e) => set('roleTitle')(e.target.value)} /></Field>
        <Field label="Employment type"><Input placeholder="e.g. Internship, Full-time" value={form.employmentType} onChange={(e) => set('employmentType')(e.target.value)} /></Field>
        <Field label="Start date"><Input value={form.startDate} onChange={(e) => set('startDate')(e.target.value)} /></Field>
        <Field label="End date">
          <Input value={form.endDate} disabled={form.current} onChange={(e) => set('endDate')(e.target.value)} />
          <label className="text-xs text-muted flex items-center gap-1.5 mt-1.5">
            <input type="checkbox" checked={form.current} onChange={(e) => set('current')(e.target.checked)} /> Currently working here
          </label>
        </Field>
        <Field label="Location"><Input value={form.location} onChange={(e) => set('location')(e.target.value)} /></Field>
      </div>

      <Field label="Company description"><TextArea value={form.description} onChange={(e) => set('description')(e.target.value)} /></Field>
      <Field label="Responsibilities"><TextArea value={form.responsibilities} onChange={(e) => set('responsibilities')(e.target.value)} /></Field>
      <Field label="Technologies used"><TextArea value={form.technologies} onChange={(e) => set('technologies')(e.target.value)} /></Field>
      <Field label="Key contributions"><TextArea value={form.contributions} onChange={(e) => set('contributions')(e.target.value)} /></Field>

      <div className="grid md:grid-cols-2 gap-x-4">
        <Field label="Company website"><Input value={form.website} onChange={(e) => set('website')(e.target.value)} /></Field>
        <Field label="Company LinkedIn"><Input value={form.linkedin} onChange={(e) => set('linkedin')(e.target.value)} /></Field>
        <Field label="GitHub / repo"><Input value={form.github} onChange={(e) => set('github')(e.target.value)} /></Field>
        <Field label="Live project/work"><Input value={form.liveWork} onChange={(e) => set('liveWork')(e.target.value)} /></Field>
      </div>

      <div className="flex gap-3 mb-8">
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save entry'}</Button>
        <Button variant="danger" onClick={handleDeleteEntry}>Delete entry</Button>
      </div>

      <div className="border-t border-border pt-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-sm">Certificates from this role</h4>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCertForm(certForm ? null : { title: '', issuer: form.company, date: '', desc: '', file: null })}
          >
            {certForm ? 'Cancel' : '+ Add certificate'}
          </Button>
        </div>
        {certForm && (
          <form onSubmit={handleAddCert} className="grid md:grid-cols-2 gap-3 mb-4 bg-surface2 rounded-xl p-4">
            <Field label="Title"><Input required value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} /></Field>
            <Field label="Issuer"><Input value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} /></Field>
            <Field label="Date"><Input value={certForm.date} onChange={(e) => setCertForm({ ...certForm, date: e.target.value })} /></Field>
            <Field label="Certificate file (PDF/image)">
              <input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setCertForm({ ...certForm, file: e.target.files[0] })} className="text-sm" />
            </Field>
            <Field label="Description" className="md:col-span-2"><TextArea value={certForm.desc} onChange={(e) => setCertForm({ ...certForm, desc: e.target.value })} /></Field>
            <div className="md:col-span-2"><Button type="submit">Save certificate</Button></div>
          </form>
        )}
        <div className="grid md:grid-cols-2 gap-3">
          {(entry.certificates || []).map((c) => (
            <div key={c.id} className="flex justify-between items-center bg-surface2 rounded-lg px-3 py-2 text-sm">
              <span>{c.title} <span className="text-muted text-xs">({c.issuer})</span></span>
              <button onClick={() => handleDeleteCert(c.id)} className="text-red-400 text-xs">Delete</button>
            </div>
          ))}
          {(!entry.certificates || entry.certificates.length === 0) && <p className="text-xs text-muted italic">No certificates yet.</p>}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-sm">Work / project links</h4>
          <Button type="button" variant="ghost" onClick={() => setLinkForm(linkForm ? null : { title: '', github: '', live: '' })}>
            {linkForm ? 'Cancel' : '+ Add link'}
          </Button>
        </div>
        {linkForm && (
          <form onSubmit={handleAddLink} className="grid md:grid-cols-3 gap-3 mb-4 bg-surface2 rounded-xl p-4">
            <Field label="Title"><Input required value={linkForm.title} onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })} /></Field>
            <Field label="GitHub"><Input value={linkForm.github} onChange={(e) => setLinkForm({ ...linkForm, github: e.target.value })} /></Field>
            <Field label="Live"><Input value={linkForm.live} onChange={(e) => setLinkForm({ ...linkForm, live: e.target.value })} /></Field>
            <div className="md:col-span-3"><Button type="submit">Save link</Button></div>
          </form>
        )}
        <div className="grid md:grid-cols-2 gap-3">
          {(entry.workLinks || []).map((l) => (
            <div key={l.id} className="flex justify-between items-center bg-surface2 rounded-lg px-3 py-2 text-sm">
              <span>{l.title}</span>
              <button onClick={() => handleDeleteLink(l.id)} className="text-red-400 text-xs">Delete</button>
            </div>
          ))}
          {(!entry.workLinks || entry.workLinks.length === 0) && <p className="text-xs text-muted italic">No links yet.</p>}
        </div>
      </div>
    </Card>
  )
}

export default function ExperiencePage() {
  const { experience, refresh } = useContent()
  const [status, showStatus] = useStatus()

  async function handleAdd() {
    try {
      await api.post('/api/content/experience', emptyEntry)
      await refresh()
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Work history, roles and the certificates/links tied to each one."
        action={<Button onClick={handleAdd}>+ Add experience</Button>}
      />
      <StatusBanner status={status} />
      {experience.length === 0 && <p className="text-muted text-sm italic">No experience entries yet — add your first one.</p>}
      {experience.map((entry) => (
        <EntryEditor key={entry.id} entry={entry} refresh={refresh} />
      ))}
    </div>
  )
}
