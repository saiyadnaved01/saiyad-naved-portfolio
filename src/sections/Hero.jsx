import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { api } from '../api/client'

function TypedLine() {
  const text = 'a full-stack developer in the making'
  const [shown, setShown] = useState('')

  useEffect(() => {
    let i = 0
    const start = setTimeout(function step() {
      setShown(text.slice(0, i))
      i++
      if (i <= text.length) setTimeout(step, 55)
    }, 500)
    return () => clearTimeout(start)
  }, [])

  return <div id="type-cursor" className="text-acc2" style={{ margin: '8px 0 18px' }}>{shown}</div>
}

export default function Hero() {
  const { profile } = useContent()
  return (
    <section id="home" className="pt-44 pb-24">
      <div className="max-w-[1120px] mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div className="font-mono text-xs text-acc2 mb-2">{profile.tagline}</div>
          <h1 className="font-head font-semibold text-4xl md:text-5xl tracking-tight">{profile.name}</h1>
          <div className="font-mono text-acc1 text-sm mt-3 mb-4">{profile.role}</div>
          <p className="text-muted max-w-md mb-8">{profile.intro}</p>
          <div className="flex flex-wrap gap-3 mb-8">
            <a href="#projects" className="px-6 py-3 rounded-lg text-sm font-medium bg-grad hover:-translate-y-0.5 transition-transform">
              View My Work
            </a>
            <a href="#contact" className="px-6 py-3 rounded-lg text-sm font-medium border border-border hover:border-acc1">
              Contact Me
            </a>
            {profile.resumeUrl && (
              <a
                href={api.fileUrl(profile.resumeUrl)}
                download={`${(profile.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`}
                className="px-6 py-3 rounded-lg text-sm font-medium border border-border hover:border-acc1"
              >
                Download Resume
              </a>
            )}
          </div>
          <div className="flex gap-3">
            <a href={`mailto:${profile.contact.email}`} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-acc1">✉</a>
            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-acc1">in</a>
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-acc1">⌥</a>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-border bg-surface shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex gap-2 px-4 py-3 border-b border-border">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="p-5 font-mono text-[13.5px] min-h-[280px] leading-relaxed">
            <div><span className="text-sky-300">naved@dev</span><span className="text-muted">:~$</span> whoami</div>
            <TypedLine />
            <div className="text-muted">// tech stack</div>
            <div className="text-emerald-400">const stack = {'{'}</div>
            <div>&nbsp;&nbsp;languages: <span className="text-sky-300">['C++','Java','JavaScript']</span>,</div>
            <div>&nbsp;&nbsp;web: <span className="text-sky-300">['HTML','CSS','React','Node.js']</span>,</div>
            <div>&nbsp;&nbsp;db: <span className="text-sky-300">['MySQL']</span>,</div>
            <div>&nbsp;&nbsp;learning: <span className="text-sky-300">['Cloud','DSA']</span></div>
            <div className="text-emerald-400">{'}'};</div>
          </div>
        </div>
      </div>
    </section>
  )
}
