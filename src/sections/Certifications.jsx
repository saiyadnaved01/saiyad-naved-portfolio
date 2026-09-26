import { useContent } from '../context/ContentContext'
import Reveal from '../components/Reveal'

export default function Certifications() {
  const { certifications } = useContent()
  return (
    <section id="certifications" className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="max-w-lg mb-14">
          <div className="font-mono text-xs text-acc2 mb-2">Certifications</div>
          <h2 className="font-head text-3xl md:text-4xl font-semibold">Courses &amp; virtual internships</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {certifications.map((c) => (
            <Reveal key={c.name}>
              <div className="bg-surface border border-border rounded-2xl p-5 h-full">
                <h3 className="text-sm font-medium mb-1.5">{c.name}</h3>
                <div className="font-mono text-xs text-acc1">{c.org}{c.date ? ` · ${c.date}` : ''}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
