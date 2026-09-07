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

Env vars (set in Vercel): `DATABASE_URL` (hosted MySQL — apply `schema.sql` once, e.g. via phpMyAdmin),
`RESEND_API_KEY`, `NEXT_PUBLIC_APP_URL`, `SUPERADMIN_USER`, `SUPERADMIN_PASSWORD`.
`GITHUB_TOKEN` is optional and only lifts the GitHub API rate limit.

`/api/debug/db` reports whether the database is reachable (signup/download
counts only, no personal data). It is behind the superadmin login — it returns
live business numbers, so it is not something to leave open.

## Superadmin dashboard

`/superadmin` — signup and download numbers, behind HTTP Basic Auth.

- **Overview** — app downloads (from the GitHub release `.dmg` counts), email
  signups, the signup → email → download funnel, 30 days of daily signups, top
  mailbox domains, and the latest signups.
- **Signups** (`/superadmin/signups`) — the full list, searchable by email and
  filterable by status. Filters live in the URL, so a view is linkable.
- **Releases** (`/superadmin/releases`) — downloads per shipped version.

Two different numbers, deliberately. The GitHub count is every DMG fetched,
including forwarded links, the release page, and Sparkle in-app updates, but
cannot be attributed to a person. The `downloads` table only counts emailed
links that were clicked, but knows who clicked them.

### Signing in

`/superadmin/login` is a normal login page: it checks the credentials against
`SUPERADMIN_USER` / `SUPERADMIN_PASSWORD` and sets a signed session cookie
(`memoflow_admin`, httpOnly, SameSite=Lax, Secure in production, 12 hours).
"Sign out" is in the sidebar footer.

The cookie is `payload.HMAC-SHA256`, and **the signing key is derived from
`SUPERADMIN_PASSWORD`** — so there is no third secret to configure, and
changing the password invalidates every existing session. Editing the payload
(a later expiry, a different user) breaks the signature and the visitor is
bounced to the login page.

Failed attempts are throttled at 8 per 10 minutes per IP. The counter is
in-memory, so on serverless it is per-instance rather than global — enough to
stop an online guessing run, not a substitute for a strong password.

### What is gated

Enforced in `src/middleware.ts` over `/superadmin/:path*` and
`/api/debug/:path*`, so a new page or debug endpoint is protected the moment it
is created.

- **Pages** redirect to the login and come back to the page you asked for.
- **`/api/debug/*`** also accepts HTTP Basic Auth with the same credentials, so
  `curl -u user:pass .../api/debug/db` still works — redirecting a script to an
  HTML form would be useless.
- **`/api/signup` and `/api/download/[id]` are deliberately open.** The signup
  form posts to the first from a logged-out browser, and the second is the
  emailed download link itself.

**With `SUPERADMIN_USER` or `SUPERADMIN_PASSWORD` unset every route returns 503
rather than opening** — set both in Vercel before deploying. The dashboard is
`noindex` and excluded from the sitemap.

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
