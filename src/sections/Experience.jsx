import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import { api } from '../api/client'
import Reveal from '../components/Reveal'
import Modal from '../components/Modal'

const linkKeys = [
  ['website', 'Company Website'],
  ['linkedin', 'Company LinkedIn'],
  ['github', 'GitHub / Repo'],
  ['liveWork', 'Live Project/Work'],
]

export default function Experience() {
  const { experience } = useContent()
  const [openId, setOpenId] = useState(null)
  const [lightbox, setLightbox] = useState(null)

  const active = experience.find((e) => e.id === openId)

  if (!experience || experience.length === 0) return null

  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="max-w-lg mb-14">
          <div className="font-mono text-xs text-acc2 mb-2">Experience</div>
          <h2 className="font-head text-3xl md:text-4xl font-semibold">Work experience</h2>
          <p className="text-muted mt-3">Click an entry for the full breakdown — role, tech, responsibilities and links.</p>
        </div>

        <div className="space-y-14">
          {experience.map((entry) => (
            <div key={entry.id} className="relative pl-9 border-l-2 border-border">
              <Reveal>
                <button
                  onClick={() => setOpenId(entry.id)}
                  className="text-left w-full bg-surface border border-border rounded-2xl p-6 hover:border-acc1 hover:-translate-y-1 transition-all"
                >
                  <h3 className="text-lg font-head font-semibold">
                    {entry.company}
                    {entry.companyAlt && <span className="text-muted font-normal"> / {entry.companyAlt}</span>}
                  </h3>
                  <div className="font-mono text-acc1 text-sm mt-1">{entry.roleTitle}</div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted mt-3">
                    <span>{entry.employmentType || 'Employment type not set'}</span>
                    <span>{entry.startDate || 'Start date'} — {entry.current ? 'Present' : (entry.endDate || 'End date')}</span>
                    <span>{entry.location || 'Location not set'}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-3">{entry.description || 'No company description added yet.'}</p>
                  <span className="text-xs font-mono text-acc1 mt-3 inline-block">View full details →</span>
                </button>
              </Reveal>

              {entry.certificates?.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4 mt-5">
                  {entry.certificates.map((c) => (
                    <div key={c.id} className="bg-surface border border-border rounded-2xl p-4">
                      <div className="w-full h-28 rounded-lg bg-surface2 flex items-center justify-center mb-3 overflow-hidden text-2xl">
                        {c.fileType?.startsWith('image') ? (
                          <img src={api.fileUrl(c.fileUrl)} alt={c.title} className="w-full h-full object-cover" />
                        ) : (
                          '📄'
                        )}
                      </div>
                      <h4 className="text-sm font-medium mb-0.5">{c.title}</h4>
                      <div className="text-xs font-mono text-muted mb-2">{c.issuer || '—'}{c.date ? ` · ${c.date}` : ''}</div>
                      {c.desc && <p className="text-xs text-slate-300 mb-3">{c.desc}</p>}
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => setLightbox(c)} className="text-xs px-3 py-1.5 rounded-md border border-border hover:border-acc1">View Certificate</button>
                        <a href={api.fileUrl(c.fileUrl)} download={c.title?.replace(/\s+/g, '_')} className="text-xs px-3 py-1.5 rounded-md border border-border hover:border-acc1">Download</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {entry.workLinks?.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-5">
                  {entry.workLinks.map((p) => (
                    <div key={p.id} className="text-xs px-3 py-2 rounded-lg border border-border bg-surface2 flex items-center gap-2.5">
                      <span>{p.title}</span>
                      {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-acc1">GitHub</a>}
                      {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-acc1">Live</a>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Experience detail modal */}
      <Modal open={!!active} onClose={() => setOpenId(null)} maxWidth="max-w-xl">
        {active && (
          <>
            <h3 className="text-xl font-head font-semibold mb-1">
              {active.company}{active.companyAlt && ` / ${active.companyAlt}`}
            </h3>
            <div className="font-mono text-acc1 text-sm mb-3">{active.roleTitle}</div>
            <div className="flex flex-wrap gap-4 text-xs text-muted mb-4">
              <span>{active.employmentType || 'Employment type not set'}</span>
              <span>{active.startDate || 'Start date'} — {active.current ? 'Present' : (active.endDate || 'End date')}</span>
              <span>{active.location || 'Location not set'}</span>
            </div>

            <p className="text-sm text-slate-300 mb-4">{active.description || 'No company description added yet.'}</p>

            <h4 className="text-sm font-medium mb-1.5">Responsibilities</h4>
            <p className="text-sm text-slate-300 mb-4">{active.responsibilities || 'Not added yet.'}</p>

            <h4 className="text-sm font-medium mb-1.5">Technologies used</h4>
            <p className="text-sm text-slate-300 mb-4">{active.technologies || 'Not added yet.'}</p>

            <h4 className="text-sm font-medium mb-1.5">Key contributions</h4>
            <p className="text-sm text-slate-300 mb-4">{active.contributions || 'Not added yet.'}</p>

            <h4 className="text-sm font-medium mb-1.5">Links</h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {linkKeys.filter(([key]) => active[key]).map(([key, label]) => (
                <a key={key} href={active[key]} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-2 rounded-lg border border-border bg-surface2 hover:border-acc1">
                  {label}
                </a>
              ))}
              {linkKeys.every(([key]) => !active[key]) && <span className="text-xs text-muted">No links added yet.</span>}
            </div>

            <h4 className="text-sm font-medium mb-1.5">Certificates</h4>
            <div className="text-xs text-muted">
              {(!active.certificates || active.certificates.length === 0)
                ? 'No certificates uploaded yet.'
                : active.certificates.map((c) => `• ${c.title} (${c.issuer || '—'})`).join('  ')}
            </div>
          </>
        )}
      </Modal>

      {/* Certificate lightbox */}
      <Modal open={!!lightbox} onClose={() => setLightbox(null)} maxWidth="max-w-2xl">
        {lightbox && (
          <>
            <h3 className="text-lg font-medium mb-3">{lightbox.title}</h3>
            {lightbox.fileType?.startsWith('image') ? (
              <img src={api.fileUrl(lightbox.fileUrl)} alt={lightbox.title} className="w-full max-h-[60vh] object-contain bg-black rounded-lg" />
            ) : (
              <iframe src={api.fileUrl(lightbox.fileUrl)} title={lightbox.title} className="w-full h-[60vh] rounded-lg border-0" />
            )}
            <p className="text-xs text-muted mt-3">
              Issued by {lightbox.issuer || '—'}{lightbox.date ? ` · ${lightbox.date}` : ''}{lightbox.desc ? ` — ${lightbox.desc}` : ''}
            </p>
          </>
        )}
      </Modal>
    </section>
  )
}
