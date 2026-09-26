import { useEffect, useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { api } from '../../api/client'
import { Field, Input, TextArea, Button, Card, PageHeader } from '../components/ui'
import { useStatus, StatusBanner } from '../components/status'

export default function ProfilePage() {
  const { profile, refresh } = useContent()
  const [form, setForm] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [status, showStatus] = useStatus()

  useEffect(() => setForm(profile), [profile])

  function setTop(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }
  function setNested(group, key, value) {
    setForm((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/api/content/profile', form)
      await refresh()
      showStatus('success', 'Profile saved.')
    } catch (err) {
      showStatus('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpload(field, file) {
    try {
      const { url } = await api.upload(file)
      setTop(field, url)
      showStatus('success', 'File uploaded — remember to hit Save changes.')
    } catch (err) {
      showStatus('error', err.message)
    }
  }

  function updateAbout(i, value) {
    const next = [...form.about]
    next[i] = value
    setForm({ ...form, about: next })
  }
  function addAbout() {
    setForm({ ...form, about: [...form.about, ''] })
  }
  function removeAbout(i) {
    setForm({ ...form, about: form.about.filter((_, idx) => idx !== i) })
  }

  function updateFact(i, key, value) {
    const next = [...form.facts]
    next[i] = { ...next[i], [key]: value }
    setForm({ ...form, facts: next })
  }
  function addFact() {
    setForm({ ...form, facts: [...form.facts, { k: '', v: '' }] })
  }
  function removeFact(i) {
    setForm({ ...form, facts: form.facts.filter((_, idx) => idx !== i) })
  }

  return (
    <form onSubmit={handleSave}>
      <PageHeader
        title="Profile & About"
        description="The hero section, about text and contact details visitors see."
        action={<Button disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>}
      />
      <StatusBanner status={status} />

      <Card className="mb-6">
        <h3 className="font-medium mb-4">Basics</h3>
        <div className="grid md:grid-cols-2 gap-x-4">
          <Field label="Full name">
            <Input value={form.name} onChange={(e) => setTop('name', e.target.value)} />
          </Field>
          <Field label="Role / headline">
            <Input value={form.role} onChange={(e) => setTop('role', e.target.value)} />
          </Field>
        </div>
        <Field label="Tagline (small line above your name)">
          <Input value={form.tagline} onChange={(e) => setTop('tagline', e.target.value)} />
        </Field>
        <Field label="Short intro (hero paragraph)">
          <TextArea value={form.intro} onChange={(e) => setTop('intro', e.target.value)} />
        </Field>
      </Card>

      <Card className="mb-6">
        <h3 className="font-medium mb-4">About paragraphs</h3>
        {form.about.map((p, i) => (
          <div key={i} className="flex gap-2 mb-3">
            <TextArea value={p} onChange={(e) => updateAbout(i, e.target.value)} className="min-h-[70px]" />
            <Button type="button" variant="danger" onClick={() => removeAbout(i)}>✕</Button>
          </div>
        ))}
        <Button type="button" variant="ghost" onClick={addAbout}>+ Add paragraph</Button>
      </Card>

      <Card className="mb-6">
        <h3 className="font-medium mb-4">Quick facts</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {form.facts.map((f, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder="LABEL" value={f.k} onChange={(e) => updateFact(i, 'k', e.target.value)} />
              <Input placeholder="Value" value={f.v} onChange={(e) => updateFact(i, 'v', e.target.value)} />
              <Button type="button" variant="danger" onClick={() => removeFact(i)}>✕</Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="ghost" className="mt-3" onClick={addFact}>+ Add fact</Button>
      </Card>

      <Card className="mb-6">
        <h3 className="font-medium mb-4">Contact</h3>
        <div className="grid md:grid-cols-3 gap-x-4">
          <Field label="Email">
            <Input value={form.contact.email} onChange={(e) => setNested('contact', 'email', e.target.value)} />
          </Field>
          <Field label="Phone">
            <Input value={form.contact.phone} onChange={(e) => setNested('contact', 'phone', e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={form.contact.location} onChange={(e) => setNested('contact', 'location', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="mb-6">
        <h3 className="font-medium mb-4">Social links</h3>
        <div className="grid md:grid-cols-2 gap-x-4">
          <Field label="LinkedIn URL">
            <Input value={form.social.linkedin} onChange={(e) => setNested('social', 'linkedin', e.target.value)} />
          </Field>
          <Field label="GitHub URL">
            <Input value={form.social.github} onChange={(e) => setNested('social', 'github', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium mb-4">Photo & résumé</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="Profile photo">
            {form.photoUrl && (
              <img
                src={api.fileUrl(form.photoUrl)}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border border-border mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files[0] && handleUpload('photoUrl', e.target.files[0])}
              className="text-sm"
            />
          </Field>
          <Field label="Résumé (PDF)">
            {form.resumeUrl && (
              <a href={api.fileUrl(form.resumeUrl)} target="_blank" rel="noopener noreferrer" className="text-acc1 text-sm block mb-2">
                Current résumé →
              </a>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files[0] && handleUpload('resumeUrl', e.target.files[0])}
              className="text-sm"
            />
          </Field>
        </div>
      </Card>
    </form>
  )
}
