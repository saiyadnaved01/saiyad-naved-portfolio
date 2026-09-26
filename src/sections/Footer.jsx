import { useContent } from '../context/ContentContext'

export default function Footer() {
  const { profile } = useContent()
  return (
    <footer className="border-t border-border py-8 text-center text-muted text-sm">
      © {new Date().getFullYear()} {profile.name || 'Portfolio'} · Built with intent, not a template.
    </footer>
  )
}
