import { useContent } from '../context/ContentContext'
import { api } from '../api/client'
import Reveal from '../components/Reveal'

export default function About() {
  const { profile } = useContent()
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="max-w-lg mb-14">
          <div className="font-mono text-xs text-acc2 mb-2">About</div>
          <h2 className="font-head text-3xl md:text-4xl font-semibold">A bit about how I got here</h2>
        </div>
        <div className="grid md:grid-cols-[220px_1fr] gap-14 items-start">
          <Reveal>
            <img src={api.fileUrl(profile.photoUrl)} alt={profile.name} className="rounded-2xl border border-border w-full" />
          </Reveal>
          <Reveal>
            {profile.about.map((p, i) => (
              <p key={i} className="text-slate-300 mb-4">{p}</p>
            ))}
            <div className="grid grid-cols-2 gap-3.5 mt-6">
              {profile.facts.map((f) => (
                <div key={f.k} className="bg-surface border border-border rounded-lg px-4 py-3.5">
                  <div className="text-xs text-muted font-mono">{f.k}</div>
                  <div className="text-sm mt-1">{f.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
