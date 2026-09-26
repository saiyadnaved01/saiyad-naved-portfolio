import { useState } from 'react'
import { useContent } from '../context/ContentContext'
import Reveal from '../components/Reveal'
import Modal from '../components/Modal'

export default function Projects() {
  const { projects } = useContent()
  const [openId, setOpenId] = useState(null)
  const active = projects.find((p) => p.id === openId)

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="max-w-lg mb-14">
          <div className="font-mono text-xs text-acc2 mb-2">Projects</div>
          <h2 className="font-head text-3xl md:text-4xl font-semibold">Things I've built</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <Reveal key={p.id}>
              <button
                onClick={() => setOpenId(p.id)}
                className="text-left w-full bg-surface border border-border rounded-2xl p-7 hover:border-acc1 hover:-translate-y-1 transition-all"
              >
                <h3 className="text-xl font-head font-semibold mb-2">{p.name}</h3>
                <p className="text-muted text-sm mb-4">{p.summary}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tech.map((t) => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-md bg-surface2 border border-border">{t}</span>
                  ))}
                </div>
                <span className="text-xs font-mono text-acc1">View details →</span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setOpenId(null)}>
        {active && (
          <>
            <h3 className="text-xl font-head font-semibold mb-3">{active.name}</h3>
            <p className="text-muted text-sm mb-4">{active.summary}</p>
            <ul className="list-disc pl-5 text-sm text-slate-300 space-y-1.5 mb-4">
              {active.details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
            <div className="flex flex-wrap gap-2 mb-5">
              {active.tech.map((t) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-md bg-surface2 border border-border">{t}</span>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              {active.github ? (
                <a href={active.github} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-border hover:border-acc1">GitHub</a>
              ) : (
                <span className="text-xs px-4 py-2 rounded-lg border border-border text-muted">GitHub: details coming soon</span>
              )}
              {active.live && (
                <a href={active.live} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-lg border border-border hover:border-acc1">Live Demo</a>
              )}
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
