import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { requireAuth } from '../middleware/auth.js'

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please try again later.' },
})

export default function messageRoutes(db) {
  const router = Router()

  // Public: visitors submitting the Contact form
  router.post('/', submitLimiter, async (req, res) => {
    const { name, email, subject, message } = req.body || {}
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Name, email and message are required.' })
    }
    const entry = {
      id: `msg_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
      name: name.trim(),
      email: email.trim(),
      subject: (subject || '').trim(),
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    }
    db.data.messages.unshift(entry)
    await db.write()
    res.status(201).json({ ok: true })
  })

  // Admin inbox
  router.get('/', requireAuth, (req, res) => {
    res.json(db.data.messages)
  })

  router.put('/:id/read', requireAuth, async (req, res) => {
    const msg = db.data.messages.find((m) => m.id === req.params.id)
    if (!msg) return res.status(404).json({ error: 'Message not found.' })
    msg.read = true
    await db.write()
    res.json(msg)
  })

  router.delete('/:id', requireAuth, async (req, res) => {
    db.data.messages = db.data.messages.filter((m) => m.id !== req.params.id)
    await db.write()
    res.status(204).end()
  })

  return router
}
