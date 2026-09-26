import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { requireAuth } from '../middleware/auth.js'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in a few minutes.' },
})

export default function authRoutes(db) {
  const router = Router()

  router.post('/login', loginLimiter, (req, res) => {
    const { username, password } = req.body || {}
    const auth = db.data.auth
    if (!username || !password || username !== auth.username || !bcrypt.compareSync(password, auth.passwordHash)) {
      return res.status(401).json({ error: 'Invalid username or password.' })
    }
    const token = jwt.sign({ sub: username }, process.env.JWT_SECRET || 'dev-secret-change-me', { expiresIn: '7d' })
    res.json({ token, username })
  })

  router.get('/me', requireAuth, (req, res) => {
    res.json({ username: db.data.auth.username })
  })

  router.post('/change-password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body || {}
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' })
    }
    if (!bcrypt.compareSync(currentPassword || '', db.data.auth.passwordHash)) {
      return res.status(401).json({ error: 'Current password is incorrect.' })
    }
    db.data.auth.passwordHash = bcrypt.hashSync(newPassword, 10)
    await db.write()
    res.json({ ok: true })
  })

  return router
}
