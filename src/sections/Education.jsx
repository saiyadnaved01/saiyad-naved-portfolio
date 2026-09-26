import { useContent } from '../context/ContentContext'
import Reveal from '../components/Reveal'

export default function Education() {
  const { education } = useContent()
  return (
    <section id="education" className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="max-w-lg mb-14">
          <div className="font-mono text-xs text-acc2 mb-2">Education</div>
          <h2 className="font-head text-3xl md:text-4xl font-semibold">Academic background</h2>
        </div>
        <div className="relative pl-7 border-l-2 border-border">
          {education.map((e, i) => (
            <Reveal key={i} className="relative mb-9 last:mb-0">
              <span className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-grad" />
              <div className="font-mono text-xs text-acc1">{e.duration}</div>
              <h3 className="text-lg font-head font-semibold mt-1.5 mb-1">{e.degree}</h3>
              <div className="text-muted text-sm">{e.institution}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
