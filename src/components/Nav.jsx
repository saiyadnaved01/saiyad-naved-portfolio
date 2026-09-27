import { useEffect, useState } from 'react'
import { navItems } from '../data/profile'
import { useContent } from '../context/ContentContext'
import { api } from '../api/client'

export default function Nav() {
  const { profile } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
      let current = 'home'
      navItems.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) current = id
      })
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all ${
          scrolled ? 'bg-bg/85 backdrop-blur-md border-b border-border py-3' : 'py-4'
        }`}
        style={{ paddingTop: scrolled ? undefined : 'env(safe-area-inset-top,0)' }}
      >
        <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between">
          <a href="#home" className="font-head font-semibold text-lg">
            {profile.name?.split(' ')[0] || 'Portfolio'} Naved <span className="grad-text"> ✔︎</span>
          </a>
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`text-sm transition-colors relative pb-1 ${
                    active === id ? 'text-white after:content-[""] after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:bg-grad after:rounded' : 'text-muted hover:text-white'
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
            {profile.resumeUrl && (
              <li>
                <a
                  href={api.fileUrl(profile.resumeUrl)}
                  download={`${(profile.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`}
                  className="text-sm px-4 py-2 rounded-lg bg-grad text-white font-medium"
                >
                  Resume
                </a>
              </li>
            )}
          </ul>
          <button
            className="md:hidden flex flex-col gap-1.5"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="w-6 h-0.5 bg-white block" />
            <span className="w-6 h-0.5 bg-white block" />
            <span className="w-6 h-0.5 bg-white block" />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[99] bg-bg flex flex-col gap-6 p-8 pt-28">
          {navItems.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="text-xl" onClick={() => setMobileOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
