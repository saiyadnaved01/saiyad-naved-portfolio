import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDb } from './db.js'
import authRoutes from './routes/auth.js'
import contentRoutes from './routes/content.js'
import uploadRoutes from './routes/upload.js'
import messageRoutes from './routes/messages.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const db = await initDb()
  const app = express()

  const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean)

  app.use(helmet({ crossOriginResourcePolicy: false }))
  app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }))
  app.use(express.json({ limit: '2mb' }))
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

  app.get('/api/health', (req, res) => res.json({ ok: true }))
  app.use('/api/auth', authRoutes(db))
  app.use('/api/content', contentRoutes(db))
  app.use('/api/upload', uploadRoutes(db))
  app.use('/api/messages', messageRoutes(db))

  app.use((req, res) => res.status(404).json({ error: 'Not found.' }))
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong on the server.' })
  })

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`Portfolio API listening on http://localhost:${port}`)
  })
}

main().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
