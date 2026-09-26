import { useContent } from '../context/ContentContext'
import Reveal from '../components/Reveal'

export default function Skills() {
  const { skills } = useContent()
  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="max-w-lg mb-14">
          <div className="font-mono text-xs text-acc2 mb-2">Skills</div>
          <h2 className="font-head text-3xl md:text-4xl font-semibold">What I work with</h2>
          <p className="text-muted mt-3">Grouped by area — everything here is skill I've actually used, not a proficiency score.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {skills.map((cat) => (
            <Reveal key={cat.category}>
              <div className="bg-surface border border-border rounded-2xl p-6 h-full hover:border-acc1 hover:-translate-y-1 transition-all">
                <h3 className="text-sm font-medium mb-3.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-grad inline-block" />
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <span key={item} className="text-xs px-3 py-1.5 rounded-md bg-surface2 border border-border text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
