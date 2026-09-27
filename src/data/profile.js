export const profile = {
  name: 'Saiyad Naved',
  role: 'Aspiring Full-Stack Developer',
  tagline: 'Computer Science · B.Tech 2023–2027',
  intro:
    "I build full-stack web applications with clean UIs and solid database design — currently sharpening my skills in JavaScript, React, Node.js and MySQL while solving 100+ DSA problems along the way.",
  about: [
    "I'm a Computer Science student at PR Pote Patil College of Engineering and Management, building toward a career in full-stack web development. Most of what I know comes from building — two independent full-stack projects have taken me from front-end layout through backend logic to MySQL database design.",
    "Alongside coursework in data structures, DBMS, operating systems and computer networks, I've picked up the basics of cloud computing and automation, and I'm actively working through HackerRank and LeetCode to sharpen problem-solving for technical interviews. Two virtual internships — in Android and Java full-stack development — rounded out that foundation with structured, guided practice.",
    "What I'm looking for next: a software or web development internship where I can apply these skills on real products, learn from experienced engineers, and keep growing as a developer.",
  ],
  facts: [
    { k: 'LOCATION', v: 'Amravati, Maharashtra' },
    { k: 'DEGREE', v: 'B.Tech, Computer Science' },
    { k: 'GRADUATING', v: '2027' },
    { k: 'FOCUS', v: 'Full-Stack · Automation' },
  ],
  contact: {
    email: 'saiyad.naved01@gmail.com',
    phone: '+91 9356471942',
    location: 'Amravati, Maharashtra',
  },
  social: {
    linkedin: 'https://linkedin.com/in/saiyad-naved-8565b9290',
    github: 'https://github.com/saiyadnaved',
  },
  resumeUrl: '/resume.pdf',
  photoUrl: '/photo.jpg',
}

export const skills = [
  { category: 'Programming Languages', items: ['C', 'C++', 'Java', 'JavaScript'] },
  { category: 'Web Technologies', items: ['HTML', 'CSS', 'React', 'Node.js'] },
  { category: 'Database', items: ['MySQL', 'RDBMS'] },
  { category: 'Cloud & Automation', items: ['Cloud Computing Basics', 'Automation Concepts'] },
  { category: 'Tools & Platforms', items: ['Git', 'GitHub', 'VS Code'] },
  { category: 'Core Concepts', items: ['Data Structures', 'DBMS', 'OOP', 'OS', 'Computer Networks'] },
]

export const projects = [
  {
    id: 'smart-farming',
    name: 'Smart Farming Assistance System',
    summary:
      'A data-driven system that recommends suitable crops based on soil and environmental data, with a MySQL-backed store and a farmer-friendly responsive UI.',
    tech: ['HTML', 'CSS', 'MySQL'],
    details: [
      'Integrated a MySQL database for storing and retrieving agricultural data',
      'Designed a responsive interface in HTML/CSS built for ease of use by farmers',
      'Applied basic data analysis techniques to improve recommendation accuracy',
    ],
    github: '', // add your project repo link here
    live: '',   // add a live demo link here
  },
  {
    id: 'swiftmed',
    name: 'SwiftMed — Healthcare Application',
    summary:
      'A web-based healthcare management system handling patient registration, appointment scheduling and records, with validated data entry.',
    tech: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    details: [
      'Built modules for patient registration, appointment scheduling and data management',
      'Structured, intuitive UI focused on usability',
      'Implemented form validation and structured database queries for data accuracy',
    ],
    github: '',
    live: '',
  },
]

export const education = [
  {
    degree: 'B.Tech in Computer Science',
    institution: 'PR Pote Patil College of Engineering and Management, Amravati',
    duration: '2023 — 2027',
  },
]

export const certifications = [
  { name: 'Google Android Developer Virtual Internship', org: 'EduSkills' },
  { name: 'Java Full Stack Developer Virtual Internship', org: 'EduSkills' },
  { name: 'Database Management System', org: 'NPTEL' },
]

export const techStackLayers = [
  { label: 'FRONTEND', items: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { label: 'BACKEND', items: ['Node.js', 'Java', 'C++'] },
  { label: 'DATABASE', items: ['MySQL', 'RDBMS'] },
  { label: 'CLOUD/OPS', items: ['Cloud Basics', 'Git', 'GitHub'] },
]

// The one experience entry provided so far. Fields left blank are shown as
// editable placeholders in the UI and saved to the visitor's browser
// (localStorage) until you fill them in permanently here.
export const experience = [
  {
    id: 'exp1',
    company: 'Web Content and Business Solutions',
    companyAlt: 'Web Content Services',
    roleTitle: 'Full Stack Developer',
    employmentType: '', // e.g. Internship, Full-time
    startDate: '',
    endDate: '', // leave blank + set current:true for "Present"
    current: false,
    location: '',
    description: '',
    responsibilities: '',
    technologies: '',
    contributions: '',
    website: '',
    linkedin: '',
    github: '',
    liveWork: '',
  },
]

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
]
