import { useEffect, useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { api } from '../../api/client'
import { Field, Input, Button, Card, PageHeader } from '../components/ui'
import { useStatus, StatusBanner } from '../components/status'

export default function EducationPage() {
  const { education, refresh } = useContent()
  const [form, setForm] = useState(education)
  const [saving, setSaving] = useState(false)
  const [status, showStatus] = useStatus()

  useEffect(() => setForm(education), [education])

  function update(i, key, value) {
    const next = [...form]
    next[i] = { ...next[i], [key]: value }
    setForm(next)
  }
  function add() {
    setForm([...form, { degree: '', institution: '', duration: '' }])
  }
  function remove(i) {
    setForm(form.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/api/content/education', form)
      await refresh()
      showStatus('success', 'Saved.')
    } catch (err) {
      showStatus('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Education"
        description="Academic background timeline."
        action={<Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>}
      />
      <StatusBanner status={status} />
      <div className="space-y-4">
        {form.map((e, i) => (
          <Card key={i}>
            <div className="grid md:grid-cols-3 gap-x-4">
              <Field label="Degree">
                <Input value={e.degree} onChange={(ev) => update(i, 'degree', ev.target.value)} />
              </Field>
              <Field label="Institution">
                <Input value={e.institution} onChange={(ev) => update(i, 'institution', ev.target.value)} />
              </Field>
              <Field label="Duration">
                <Input value={e.duration} onChange={(ev) => update(i, 'duration', ev.target.value)} />
              </Field>
            </div>
            <Button variant="danger" onClick={() => remove(i)}>Remove</Button>
          </Card>
        ))}
      </div>
      <Button variant="ghost" className="mt-4" onClick={add}>+ Add education entry</Button>
    </div>
  )
}
