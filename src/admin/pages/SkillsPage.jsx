import { useEffect, useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { api } from '../../api/client'
import { Field, Input, Button, Card, PageHeader } from '../components/ui'
import { useStatus, StatusBanner } from '../components/status'

export default function SkillsPage() {
  const { skills, refresh } = useContent()
  const [form, setForm] = useState(skills)
  const [saving, setSaving] = useState(false)
  const [status, showStatus] = useStatus()

  useEffect(() => setForm(skills), [skills])

  function updateCategory(i, value) {
    const next = [...form]
    next[i] = { ...next[i], category: value }
    setForm(next)
  }
  function updateItems(i, value) {
    const next = [...form]
    next[i] = { ...next[i], items: value.split(',').map((s) => s.trim()).filter(Boolean) }
    setForm(next)
  }
  function addCategory() {
    setForm([...form, { category: '', items: [] }])
  }
  function removeCategory(i) {
    setForm(form.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/api/content/skills', form)
      await refresh()
      showStatus('success', 'Skills saved.')
    } catch (err) {
      showStatus('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Grouped skill categories shown on the public site."
        action={<Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>}
      />
      <StatusBanner status={status} />
      <div className="space-y-4">
        {form.map((cat, i) => (
          <Card key={i}>
            <div className="flex gap-2 mb-3 items-end">
              <Field label="Category name" className="flex-1 mb-0">
                <Input value={cat.category} onChange={(e) => updateCategory(i, e.target.value)} />
              </Field>
              <Button variant="danger" onClick={() => removeCategory(i)}>Remove</Button>
            </div>
            <Field label="Skills (comma-separated)">
              <Input value={cat.items.join(', ')} onChange={(e) => updateItems(i, e.target.value)} />
            </Field>
          </Card>
        ))}
      </div>
      <Button variant="ghost" className="mt-4" onClick={addCategory}>+ Add category</Button>
    </div>
  )
}
