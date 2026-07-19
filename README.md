# MemoFlow landing page

Marketing site for [MemoFlow](https://memoflow.app) — private, on-device AI
meeting notes and dictation for macOS. Next.js 15 + Tailwind, server-rendered
static homepage for SEO (JSON-LD `SoftwareApplication` + `FAQPage`, OG image,
sitemap).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production check (needs the env vars below)
```

Env vars (set in Vercel): `DATABASE_URL` (self-hosted Postgres — apply
`schema.sql` once with `psql "$DATABASE_URL" -f schema.sql`),
`RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`.

`/api/debug/db` reports whether the database is reachable (signup/download
counts only, no personal data).

## Design

Mirrors the app itself: near-black surfaces, the single red accent
(`--accent: #ff453a`), system font stack (SF Pro on Apple devices), and the
signature animated waveform (pure CSS, respects `prefers-reduced-motion`).
Tokens live in `src/app/globals.css`.

## Product visuals & real screenshots

The product UI shown on the page (`src/components/ui-frames.tsx`) is a
pixel-faithful HTML recreation of the actual app — retina-crisp at any size.

To use real screenshots instead, capture these from the app (⇧⌘4 + Space for
window shots, dark mode) and drop them in `public/screenshots/`:

1. `recording.png` — live recording screen with the waveform and live transcript
2. `summary.png` — a meeting's Summary tab with action items
3. `ask.png` — Ask chat with a cited answer
4. `hud.png` — the floating dictation capsule mid-dictation

Then swap the corresponding frame in `ui-frames.tsx` for an `<Image>` of the
file. Keep `alt` text descriptive — it carries SEO weight.

## Download CTA

All CTAs open the existing email-capture modal
(`src/context/SignupModalContext.tsx` → Supabase/Resend) which delivers the
download link. To switch to a direct download, replace `CTAButton`'s
`onClick` with an `<a href>` to the hosted DMG.

## SEO checklist (already wired)

- `layout.tsx`: title/description/keywords, canonical, OG + Twitter cards
  (`/og.png`), robots
- JSON-LD: `SoftwareApplication` (layout) + `FAQPage` (page)
- `public/sitemap.xml`, `public/robots.txt`
- Single `h1`, semantic heading tree, `lang="hi"` on Devanagari spans
