# Saiyad Naved — Portfolio + Admin Dashboard

A React + Vite + Tailwind portfolio site with a small Node/Express API
behind it, so you can log in to a private `/admin` dashboard and edit
everything visitors see — without touching code or redeploying.

## What changed from the original project

The original version had no backend: content lived in `src/data/profile.js`,
and the "editable" bits (work certificates, project links on the Experience
section) were saved to **each visitor's own browser** via `localStorage` —
meaning edits you made while previewing the site were invisible to everyone
else, and any visitor could technically edit their own copy of the page.

This version fixes that:

- **A real backend** (`server/`) stores all content in a small JSON database
  and serves it over an API. Every visitor sees the same data.
- **Visitors get a read-only site.** The public pages fetch content from the
  API; there's no click-to-edit UI left in the public views.
- **You get a private `/admin` dashboard**, protected by a login, for
  editing your profile, about section, skills, experience (with per-role
  certificates and project links), projects, education, certifications,
  tech stack, and contact/social links.
- **File uploads** (photo, résumé, certificates) go through the backend and
  are served back to everyone, instead of being embedded as
  browser-local base64 data.
- **The contact form now actually delivers messages** to an inbox in your
  dashboard (`/admin/messages`), instead of only opening the visitor's
  email client (which doesn't work if they don't have one configured). If
  the backend is unreachable it still falls back to `mailto:`.
- **Resilience:** if the backend is ever down, the public site falls back
  to the bundled defaults in `src/data/profile.js` instead of showing a
  blank page.

## Project structure

```
├── src/                  # Public site + admin dashboard (React, Vite)
│   ├── api/client.js      # Fetch wrapper used by both public site & admin
│   ├── context/           # ContentContext (public data) + AuthContext (admin login)
│   ├── components/, sections/   # Public site UI (unchanged look & feel)
│   ├── admin/             # Everything under /admin
│   │   ├── Login.jsx, ProtectedRoute.jsx, AdminLayout.jsx
│   │   └── pages/         # One page per content type
│   └── data/profile.js    # Bundled fallback content only (offline mode)
├── server/                # Express API + JSON database + file uploads
│   ├── index.js           # App entry point
│   ├── db.js              # lowdb setup, seeds from data/seed.json on first run
│   ├── data/seed.json      # Your real content, used to seed a fresh install
│   ├── data/db.json        # Runtime database (gitignored, created on first run)
│   ├── uploads/            # Uploaded photo/résumé/certificates (gitignored)
│   ├── routes/             # auth, content (CRUD), upload, messages
│   └── middleware/auth.js  # JWT check for protected routes
└── public/                # Static assets served as-is (favicon fallback etc.)
```

## Running it locally

You need two things running at once: the API (`server/`) and the Vite
dev server (frontend). Two terminals is easiest.

**1. Install dependencies (once):**

```bash
npm run install:all
```

This runs `npm install` in the root and in `server/`.

**2. Configure environment variables (once):**

```bash
cp .env.example .env                   # frontend: VITE_API_URL
cp server/.env.example server/.env     # backend: JWT_SECRET, admin credentials, CORS
```

Edit `server/.env` and set a real `JWT_SECRET` (a long random string) and
whatever `ADMIN_USERNAME` / `ADMIN_PASSWORD` you want to log in with the
first time. These are only used to create the admin account on the very
first run — after that, the password lives in `server/data/db.json` and you
change it from the dashboard's Settings page.

**3. Run both servers:**

```bash
# terminal 1
npm run server      # API on http://localhost:4000

# terminal 2
npm run dev          # frontend on http://localhost:5173
```

**4. Log in:**

Visit `http://localhost:5173/admin/login` and sign in with the
`ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in `server/.env`. Go to
**Settings** and change your password immediately — the value from `.env`
is only meant to bootstrap the very first login.

## Updating content

Everything is editable from `/admin` once you're logged in:

| Dashboard page | What it controls |
|---|---|
| Profile & About | Hero name/role/tagline/intro, about paragraphs, quick facts, contact info, social links, photo, résumé |
| Skills | Grouped skill categories |
| Experience | Work history entries, plus per-role certificates (file upload) and project/work links |
| Projects | Project cards, tech tags, detail bullets, GitHub/live links |
| Education | Academic background timeline |
| Certifications | Courses / virtual internships list |
| Tech Stack | The layered stack diagram |
| Messages | Contact form submissions |
| Settings | Change your admin password |

`src/data/profile.js` is no longer the source of truth for the live site —
it's only used as a fallback if the API can't be reached, so the public
site never shows a blank page. You generally don't need to touch it.

## Deploying

This is no longer a purely static site — because it has a backend that
writes to disk (the JSON database and uploaded files), **the backend needs
to run somewhere with a persistent, writable filesystem**. A serverless-only
host (e.g. Vercel/Netlify functions) will not work for `server/`, because
their filesystem is ephemeral or read-only between invocations.

Suggested setup:

- **Backend (`server/`):** deploy to a host with a persistent disk — Render
  (Web Service + a small persistent disk), Railway, Fly.io, or any VPS.
  Set the same environment variables as `server/.env.example`, pointing
  `CORS_ORIGIN` at your deployed frontend's URL.
- **Frontend:** `npm run build` outputs a static `dist/` folder — deploy it
  to Vercel, Netlify, GitHub Pages, or any static host, same as before. Set
  `VITE_API_URL` (as a build-time env var on your host) to your deployed
  backend's URL.

After deploying, log in at `https://your-site.com/admin/login`, and change
the password from Settings right away.

## Notes

- Rate limiting is applied to the login and contact-form endpoints to
  reduce brute-force/spam risk on a small, single-admin app.
- Uploaded files are limited to images and PDFs, 10MB max.
- The database is a single JSON file (`server/data/db.json`) via `lowdb` —
  fine for a personal portfolio's traffic and data volume. If this ever
  needs to scale beyond that, swap `db.js` for a real database without
  changing any of the route files' logic.
