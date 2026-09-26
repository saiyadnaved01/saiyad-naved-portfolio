import { useState } from 'react'
import { api } from '../../api/client'
import { Field, Input, Button, Card, PageHeader } from '../components/ui'
import { useStatus, StatusBanner } from '../components/status'

export default function SettingsPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [status, showStatus] = useStatus()

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.newPassword !== form.confirm) {
      showStatus('error', 'New passwords do not match.')
      return
    }
    setSaving(true)
    try {
      await api.post('/api/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      showStatus('success', 'Password updated.')
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      showStatus('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your admin login." />
      <StatusBanner status={status} />
      <Card className="max-w-md">
        <form onSubmit={handleSubmit}>
          <Field label="Current password">
            <Input type="password" autoComplete="current-password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} required />
          </Field>
          <Field label="New password">
            <Input type="password" autoComplete="new-password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required minLength={8} />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required minLength={8} />
          </Field>
          <Button type="submit" disabled={saving}>{saving ? 'Updating…' : 'Update password'}</Button>
        </form>
      </Card>
    </div>
  )
}
