# Manikanta R — Portfolio

Personal portfolio site for **Manikanta R** (MBA candidate — HR & Business Analytics, AI research).

Live at **[https://manikantar.in](https://manikantar.in)**

## Tech Stack

- **TanStack Start** (file-based routing, SSR-capable) + **TanStack Router** / **React Query**
- **Vite** + **React 19**
- **Tailwind CSS v4**
- **motion** (Framer Motion) for animations, **three.js** / **@react-three/fiber** for 3D
- **Supabase** (remote content — see `src/services/api.ts`)
- **Nodemailer** + **Zoho SMTP** for the contact form (`src/routes/api/public/contact.ts`)
- Deployed on **Vercel** with **Vercel Analytics**

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

```env
# API / content backend
VITE_API_URL=http://localhost:5000/api

# SMTP / Mail (Zoho)
SMTP_HOST=smtp.zoho.in
SMTP_PORT=465
SMTP_USER=contact@manikantar.in
SMTP_PASS=your-zoho-app-password
CONTACT_EMAIL=contact@manikantar.in
```

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the dev server                 |
| `npm run build`    | Production build                     |
| `npm run build:dev`| Development-mode build               |
| `npm run preview`  | Preview the production build         |
| `npm run lint`     | Run ESLint                           |
| `npm run format`   | Run Prettier                         |

## Testing the contact form / SMTP

A manual send script is included:

```bash
node --env-file=.env test-mail.js
# optionally send to a specific address:
node --env-file=.env test-mail.js you@example.com
```

## Project Structure

```
src/
  routes/                TanStack Start file-based routes
    __root.tsx           App shell (head meta, Analytics, layout)
    index.tsx            Home page — assembles all chapters + dynamic SEO
    api/public/
      contact.ts         Contact form → Zoho SMTP via Nodemailer
      linkedin-feed.ts   LinkedIn feed proxy
  components/
    chrome/              Nav, footer, reading progress, recruiter view
    chapters/            One component per portfolio section (Ch00–Ch14)
    hero/                Intro / landing sequence
  hooks/usePortfolio.ts  React Query data layer (Supabase-backed)
  services/api.ts        API client for all content endpoints
public/
  robots.txt
  sitemap.xml
```

## Content

All content is served from the CMS backend through `src/services/api.ts`.
Each chapter fetches only what it needs via `usePortfolio()`, deduplicated by
React Query, so a failing endpoint never blanks the whole page.

## SEO & Analytics

- Dynamic per-page meta, Open Graph, Twitter cards, and canonical tags are
  injected from the `page_seo` table (see `src/routes/index.tsx`).
- `public/robots.txt` and `public/sitemap.xml` cover the main URL.
- JSON-LD structured data (Person / WebSite) is emitted in `__root.tsx`.
- **Vercel Analytics** is mounted once in `__root.tsx` (`<Analytics />`);
  install the package with `npm i @vercel/analytics` if it's ever missing.

## Deployment

Push to `main` and Vercel auto-deploys to `https://manikantar.in`.

> Note: this repo is connected to Lovable. Don't rewrite published git history.
