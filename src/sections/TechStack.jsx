import { useContent } from '../context/ContentContext'
import Reveal from '../components/Reveal'

export default function TechStack() {
  const { techStackLayers } = useContent()
  return (
    <section id="stack" className="py-24 md:py-32">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="max-w-lg mx-auto text-center mb-14">
          <div className="font-mono text-xs text-acc2 mb-2">Tech Profile</div>
          <h2 className="font-head text-3xl md:text-4xl font-semibold">How the pieces fit together</h2>
        </div>
        <div className="max-w-xl mx-auto flex flex-col gap-3">
          {techStackLayers.map((layer, i) => (
            <div key={layer.label}>
              <Reveal>
                <div className="flex items-center gap-4 bg-surface border border-border rounded-xl px-5 py-4">
                  <span className="font-mono text-xs text-muted w-24 flex-shrink-0">{layer.label}</span>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <span key={item} className="text-xs px-3 py-1.5 rounded-md bg-surface2 border border-border">{item}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
              {i < techStackLayers.length - 1 && <div className="text-center text-acc1 text-sm py-1">↓</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
