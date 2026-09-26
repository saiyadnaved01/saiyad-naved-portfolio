import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import { api } from '../api/client'

export default function Contact() {
  const { profile } = useContent()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.'
    if (!form.subject.trim()) e.subject = 'Please enter a subject.'
    if (!form.message.trim()) e.message = 'Please write a message.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setSending(true)
    try {
      await api.post('/api/messages', form)
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      // Backend unreachable — fall back to opening the visitor's email client
      // so the message still has a way to reach you.
      const body = encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)
      window.location.href = `mailto:${profile.contact.email}?subject=${encodeURIComponent(form.subject)}&body=${body}`
    } finally {
      setSending(false)
    }
  }

  const inputCls = 'bg-surface border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-acc1'

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6 grid md:grid-cols-[1fr_1.1fr] gap-14">
        <div>
          <div className="font-mono text-xs text-acc2 mb-2">Contact</div>
          <h2 className="font-head text-3xl md:text-4xl font-semibold mb-5">Let's connect</h2>
          <div className="flex flex-col gap-4">
            <a href={`mailto:${profile.contact.email}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-acc1">✉ {profile.contact.email}</a>
            <a href={`tel:${profile.contact.phone.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-acc1">☎ {profile.contact.phone}</a>
            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-300 hover:text-acc1">in {profile.social.linkedin.replace('https://', '')}</a>
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-300 hover:text-acc1">⌥ {profile.social.github.replace('https://', '')}</a>
            <span className="flex items-center gap-3 text-sm text-slate-300">📍 {profile.contact.location}</span>
          </div>
        </div>

        {sent ? (
          <div className="bg-surface border border-acc2/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-head text-lg font-semibold mb-1">Message sent</h3>
            <p className="text-muted text-sm mb-4">Thanks for reaching out — I'll get back to you soon.</p>
            <button onClick={() => setSent(false)} className="text-xs text-acc1">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
            <input className={inputCls} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
            <input className={inputCls} placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
            <input className={inputCls} placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            {errors.subject && <span className="text-red-400 text-xs">{errors.subject}</span>}
            <textarea className={`${inputCls} min-h-[110px] resize-y`} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {errors.message && <span className="text-red-400 text-xs">{errors.message}</span>}
            <button type="submit" disabled={sending} className="px-6 py-3 rounded-lg text-sm font-medium bg-grad disabled:opacity-60">
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
