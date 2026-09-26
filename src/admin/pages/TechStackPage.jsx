import { useEffect, useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { api } from '../../api/client'
import { Field, Input, Button, Card, PageHeader } from '../components/ui'
import { useStatus, StatusBanner } from '../components/status'

export default function TechStackPage() {
  const { techStackLayers, refresh } = useContent()
  const [form, setForm] = useState(techStackLayers)
  const [saving, setSaving] = useState(false)
  const [status, showStatus] = useStatus()

  useEffect(() => setForm(techStackLayers), [techStackLayers])

  function updateLabel(i, value) {
    const next = [...form]
    next[i] = { ...next[i], label: value }
    setForm(next)
  }
  function updateItems(i, value) {
    const next = [...form]
    next[i] = { ...next[i], items: value.split(',').map((s) => s.trim()).filter(Boolean) }
    setForm(next)
  }
  function add() {
    setForm([...form, { label: '', items: [] }])
  }
  function remove(i) {
    setForm(form.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await api.put('/api/content/techstack', form)
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
        title="Tech Stack"
        description="The layered stack diagram on the public site."
        action={<Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>}
      />
      <StatusBanner status={status} />
      <div className="space-y-4">
        {form.map((layer, i) => (
          <Card key={i}>
            <div className="flex gap-2 mb-3 items-end">
              <Field label="Layer label" className="flex-1 mb-0">
                <Input value={layer.label} onChange={(e) => updateLabel(i, e.target.value)} />
              </Field>
              <Button variant="danger" onClick={() => remove(i)}>Remove</Button>
            </div>
            <Field label="Items (comma-separated)">
              <Input value={layer.items.join(', ')} onChange={(e) => updateItems(i, e.target.value)} />
            </Field>
          </Card>
        ))}
      </div>
      <Button variant="ghost" className="mt-4" onClick={add}>+ Add layer</Button>
    </div>
  )
}
