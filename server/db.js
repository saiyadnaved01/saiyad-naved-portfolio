import { JSONFilePreset } from 'lowdb/node'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbFile = path.join(__dirname, 'data', 'db.json')
const seedFile = path.join(__dirname, 'data', 'seed.json')

function loadSeed() {
  const raw = fs.readFileSync(seedFile, 'utf-8')
  return JSON.parse(raw)
}

const emptyShell = {
  auth: { username: '', passwordHash: '' },
  profile: {
    name: '', role: '', tagline: '', intro: '', about: [], facts: [],
    contact: { email: '', phone: '', location: '' },
    social: { linkedin: '', github: '' },
    resumeUrl: '', photoUrl: '',
  },
  skills: [],
  projects: [],
  education: [],
  certifications: [],
  techStackLayers: [],
  experience: [],
  messages: [],
}

export async function initDb() {
  const isFirstRun = !fs.existsSync(dbFile)
  const seed = loadSeed()

  const defaultData = isFirstRun
    ? { ...emptyShell, ...seed }
    : emptyShell // ignored when the file already exists; lowdb loads the real content from disk

  const db = await JSONFilePreset(dbFile, defaultData)

  // Backfill any keys missing from an older db.json (e.g. after an update).
  for (const key of Object.keys(emptyShell)) {
    if (db.data[key] === undefined) db.data[key] = seed[key] ?? emptyShell[key]
  }

  if (!db.data.auth.passwordHash) {
    const username = process.env.ADMIN_USERNAME || 'admin'
    const password = process.env.ADMIN_PASSWORD || 'changeme123'
    db.data.auth = { username, passwordHash: bcrypt.hashSync(password, 10) }
    await db.write()
    console.log(`Seeded admin account "${username}" from environment variables.`)
    console.log('Change the password from the dashboard Settings page as soon as you log in.')
  }

  await db.write()
  return db
}
