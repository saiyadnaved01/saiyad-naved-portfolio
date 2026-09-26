import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import { api } from '../../api/client'
import { Card, PageHeader } from '../components/ui'

export default function DashboardHome() {
  const { profile, skills, projects, experience, certifications } = useContent()
  const [messages, setMessages] = useState([])

  useEffect(() => {
    api.get('/api/messages').then(setMessages).catch(() => {})
  }, [])

  const unread = messages.filter((m) => !m.read).length

  const stats = [
    { label: 'Projects', value: projects.length, to: '/admin/projects' },
    { label: 'Skill categories', value: skills.length, to: '/admin/skills' },
    { label: 'Experience entries', value: experience.length, to: '/admin/experience' },
    { label: 'Certifications', value: certifications.length, to: '/admin/certifications' },
    { label: 'Unread messages', value: unread, to: '/admin/messages' },
  ]

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${profile.name?.split(' ')[0] || 'there'}`}
        description="Manage everything visitors see on your portfolio from here."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="hover:border-acc1 transition-colors h-full">
              <div className="text-3xl font-head font-semibold">{s.value}</div>
              <div className="text-sm text-muted mt-1">{s.label}</div>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <h3 className="font-medium mb-2">Your live site</h3>
        <p className="text-sm text-muted mb-3">Changes you save here appear for every visitor immediately.</p>
        <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-acc1">
          View public site →
        </a>
      </Card>
    </div>
  )
}
