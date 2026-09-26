import Nav from './components/Nav'
import ProgressBar from './components/ProgressBar'
import BackToTop from './components/BackToTop'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Education from './sections/Education'
import Certifications from './sections/Certifications'
import TechStack from './sections/TechStack'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function PublicSite() {
  return (
    <div className="min-h-screen">
      <ProgressBar />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Certifications />
      <TechStack />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  )
}
