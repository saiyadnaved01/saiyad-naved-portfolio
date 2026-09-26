import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { requireAuth } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'])

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (!allowedExt.has(ext)) return cb(new Error('Unsupported file type. Use JPG, PNG, WEBP, GIF or PDF.'))
    cb(null, true)
  },
})

export default function uploadRoutes() {
  const router = Router()

  router.post('/', requireAuth, (req, res) => {
    upload.single('file')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message })
      if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })
      res.status(201).json({ url: `/uploads/${req.file.filename}`, type: req.file.mimetype })
    })
  })

  return router
}
