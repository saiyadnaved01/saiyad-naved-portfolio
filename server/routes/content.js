import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'

function newId(prefix) {
  return `${prefix}_${Date.now()}_${Math.round(Math.random() * 1e6)}`
}

export default function contentRoutes(db) {
  const router = Router()

  // ---- Public: everything a visitor needs, in one call ----
  router.get('/', (req, res) => {
    const { profile, skills, projects, education, certifications, techStackLayers, experience } = db.data
    res.json({ profile, skills, projects, education, certifications, techStackLayers, experience })
  })

  // ---- Profile (singleton, deep-merged) ----
  router.put('/profile', requireAuth, async (req, res) => {
    const body = req.body || {}
    db.data.profile = {
      ...db.data.profile,
      ...body,
      contact: { ...db.data.profile.contact, ...(body.contact || {}) },
      social: { ...db.data.profile.social, ...(body.social || {}) },
    }
    await db.write()
    res.json(db.data.profile)
  })

  // ---- Skills (whole array replaced together — it's edited as a set) ----
  router.put('/skills', requireAuth, async (req, res) => {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Expected an array of skill categories.' })
    db.data.skills = req.body
    await db.write()
    res.json(db.data.skills)
  })

  // ---- Education (whole array replaced together) ----
  router.put('/education', requireAuth, async (req, res) => {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Expected an array of education entries.' })
    db.data.education = req.body
    await db.write()
    res.json(db.data.education)
  })

  // ---- Tech stack layers (whole array replaced together) ----
  router.put('/techstack', requireAuth, async (req, res) => {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Expected an array of tech stack layers.' })
    db.data.techStackLayers = req.body
    await db.write()
    res.json(db.data.techStackLayers)
  })

  // ---- Certifications (CRUD) ----
  router.post('/certifications', requireAuth, async (req, res) => {
    const item = { id: newId('cert'), name: '', org: '', date: '', ...req.body }
    db.data.certifications.push(item)
    await db.write()
    res.status(201).json(item)
  })
  router.put('/certifications/:id', requireAuth, async (req, res) => {
    const idx = db.data.certifications.findIndex((c) => c.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Certification not found.' })
    db.data.certifications[idx] = { ...db.data.certifications[idx], ...req.body }
    await db.write()
    res.json(db.data.certifications[idx])
  })
  router.delete('/certifications/:id', requireAuth, async (req, res) => {
    db.data.certifications = db.data.certifications.filter((c) => c.id !== req.params.id)
    await db.write()
    res.status(204).end()
  })

  // ---- Projects (CRUD) ----
  router.post('/projects', requireAuth, async (req, res) => {
    const item = { id: newId('proj'), tech: [], details: [], github: '', live: '', ...req.body }
    db.data.projects.push(item)
    await db.write()
    res.status(201).json(item)
  })
  router.put('/projects/:id', requireAuth, async (req, res) => {
    const idx = db.data.projects.findIndex((p) => p.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Project not found.' })
    db.data.projects[idx] = { ...db.data.projects[idx], ...req.body }
    await db.write()
    res.json(db.data.projects[idx])
  })
  router.delete('/projects/:id', requireAuth, async (req, res) => {
    db.data.projects = db.data.projects.filter((p) => p.id !== req.params.id)
    await db.write()
    res.status(204).end()
  })

  // ---- Experience (CRUD), each entry owns certificates[] and workLinks[] ----
  router.post('/experience', requireAuth, async (req, res) => {
    const item = {
      id: newId('exp'),
      company: '', companyAlt: '', roleTitle: '', employmentType: '',
      startDate: '', endDate: '', current: false, location: '',
      description: '', responsibilities: '', technologies: '', contributions: '',
      website: '', linkedin: '', github: '', liveWork: '',
      certificates: [], workLinks: [],
      ...req.body,
    }
    db.data.experience.push(item)
    await db.write()
    res.status(201).json(item)
  })
  router.put('/experience/:id', requireAuth, async (req, res) => {
    const idx = db.data.experience.findIndex((e) => e.id === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Experience entry not found.' })
    db.data.experience[idx] = { ...db.data.experience[idx], ...req.body }
    await db.write()
    res.json(db.data.experience[idx])
  })
  router.delete('/experience/:id', requireAuth, async (req, res) => {
    db.data.experience = db.data.experience.filter((e) => e.id !== req.params.id)
    await db.write()
    res.status(204).end()
  })

  // Nested: certificates earned during a specific role
  router.post('/experience/:id/certificates', requireAuth, async (req, res) => {
    const exp = db.data.experience.find((e) => e.id === req.params.id)
    if (!exp) return res.status(404).json({ error: 'Experience entry not found.' })
    const cert = { id: newId('ecert'), title: '', issuer: '', date: '', desc: '', fileUrl: '', fileType: '', ...req.body }
    exp.certificates.push(cert)
    await db.write()
    res.status(201).json(cert)
  })
  router.delete('/experience/:id/certificates/:certId', requireAuth, async (req, res) => {
    const exp = db.data.experience.find((e) => e.id === req.params.id)
    if (!exp) return res.status(404).json({ error: 'Experience entry not found.' })
    exp.certificates = exp.certificates.filter((c) => c.id !== req.params.certId)
    await db.write()
    res.status(204).end()
  })

  // Nested: work/project links tied to a specific role
  router.post('/experience/:id/links', requireAuth, async (req, res) => {
    const exp = db.data.experience.find((e) => e.id === req.params.id)
    if (!exp) return res.status(404).json({ error: 'Experience entry not found.' })
    const link = { id: newId('elink'), title: '', github: '', live: '', ...req.body }
    exp.workLinks.push(link)
    await db.write()
    res.status(201).json(link)
  })
  router.delete('/experience/:id/links/:linkId', requireAuth, async (req, res) => {
    const exp = db.data.experience.find((e) => e.id === req.params.id)
    if (!exp) return res.status(404).json({ error: 'Experience entry not found.' })
    exp.workLinks = exp.workLinks.filter((l) => l.id !== req.params.linkId)
    await db.write()
    res.status(204).end()
  })

  return router
}
