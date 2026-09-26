import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api } from '../api/client'
import {
  profile as fallbackProfile,
  skills as fallbackSkills,
  projects as fallbackProjects,
  education as fallbackEducation,
  certifications as fallbackCertifications,
  techStackLayers as fallbackTechStack,
  experience as fallbackExperience,
} from '../data/profile'

const ContentContext = createContext(null)

// Used only if the backend can't be reached, so the public site never
// shows a blank page.
const fallback = {
  profile: fallbackProfile,
  skills: fallbackSkills,
  projects: fallbackProjects,
  education: fallbackEducation,
  certifications: fallbackCertifications,
  techStackLayers: fallbackTechStack,
  experience: fallbackExperience.map((e) => ({ certificates: [], workLinks: [], ...e })),
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await api.get('/api/content')
      setContent(data)
      setOffline(false)
    } catch {
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <ContentContext.Provider value={{ ...content, loading, offline, refresh }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside a ContentProvider')
  return ctx
}
