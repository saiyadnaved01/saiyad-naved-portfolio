import { Routes, Route } from 'react-router-dom'
import PublicSite from './PublicSite'
import Login from './admin/Login'
import ProtectedRoute from './admin/ProtectedRoute'
import AdminLayout from './admin/AdminLayout'
import DashboardHome from './admin/pages/DashboardHome'
import ProfilePage from './admin/pages/ProfilePage'
import SkillsPage from './admin/pages/SkillsPage'
import ExperiencePage from './admin/pages/ExperiencePage'
import ProjectsPage from './admin/pages/ProjectsPage'
import EducationPage from './admin/pages/EducationPage'
import CertificationsPage from './admin/pages/CertificationsPage'
import TechStackPage from './admin/pages/TechStackPage'
import MessagesPage from './admin/pages/MessagesPage'
import SettingsPage from './admin/pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="techstack" element={<TechStackPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<PublicSite />} />
    </Routes>
  )
}
