# Unique Web Layer

Company website for uniqueweblayer.com — one Next.js 15 app containing both the
site and its API. App Router, Tailwind v4, TypeScript, MySQL.

```
app/
├── api/             the API — route handlers, replaces the old Express server
├── lib/server/      database, auth, mailer, uploads, validation (server-only)
├── lib/api.ts       browser client for those routes
├── components/      shared UI
├── data/            site config, services, countries — edit these, not the pages
├── admin/           enquiry inbox
├── portfolio/       listing, project pages, add/edit modals
└── uploads/         serves uploaded screenshots
db/                  migrations and seed data
scripts/             migrate, seed, backup
uploads/             uploaded screenshots (gitignored, back these up)
```

---

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where it comes from |
| --- | --- |
| `DB_*` | Your MySQL details (cPanel prefixes the names, e.g. `uniqueq1_uwl`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | You choose — the login for the admin screens |
| `JWT_SECRET` | Generate it (command below) |
| `SMTP_*` | The contact@uniqueweblayer.com mailbox |
| `GROQ_API_KEY` | For the on-site chatbot |

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Then:

```bash
npm run migrate   # creates the database and tables
npm run seed      # loads the existing portfolio projects (first run only)
npm run dev       # http://localhost:3000
```

One command, one server. MySQL must be running.

---

## Database

```bash
npm run migrate          # apply pending migrations
npm run migrate:status   # what has been applied
npm run seed             # idempotent — skips projects that already exist
```

Migrations are plain `.sql` files in `db/migrations`, applied once each in
filename order. To add one, create `003_your_change.sql` and run `npm run migrate`.

**Tables**

- `projects` — everything the portfolio renders. `service_type` is one of the
  seven service-line slugs, `tags` is JSON, `is_published` hides without
  deleting, `sort_order` controls ordering (lower first).
- `contact_messages` — every submission is saved *before* the email is
  attempted, so a mail outage never loses a lead.
- `schema_migrations` — bookkeeping for the migration runner.

---

## API

All routes are under `/api` in this same app, so there is no second origin, no
CORS configuration and no `NEXT_PUBLIC_API_URL` to get wrong at build time.

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/health` | — (also pings MySQL) |
| GET | `/api/projects` | optional (admin also sees unpublished + `country`) |
| GET | `/api/projects/filters` | — |
| GET | `/api/projects/:idOrSlug` | optional |
| POST | `/api/projects` | admin |
| PATCH | `/api/projects/:id` | admin |
| DELETE | `/api/projects/:id` | admin |
| POST | `/api/contact` | rate limited |
| GET | `/api/contact/messages` | admin |
| PATCH | `/api/contact/messages/:id` | admin |
| POST | `/api/auth/login` | rate limited |
| GET | `/api/auth/me` | admin |

**Server components do not call these.** Pages like `/portfolio` import
`app/lib/server/projects` and query MySQL directly — the render already runs on
the server, so an HTTP hop back into the same process would only add latency.
The route handlers call the same functions, so both paths see identical data.

---

## Admin

| Page | What |
| --- | --- |
| `/portfolio` | Add, edit and delete projects |
| `/admin` | Contact enquiries, with an **Email failed** filter |

Both use `ADMIN_EMAIL` / `ADMIN_PASSWORD`, are `noindex`, and are blocked in
`robots.ts`. Projects live in the database, not in code — adding one creates an
indexable `/portfolio/<slug>` page automatically.

---

## Images

Uploads are resized to a maximum of 1600×1200 and re-encoded as WebP before
they touch the disk (a 1.5 MB screenshot becomes ~36 KB). They are written to
`./uploads` and served by `app/uploads/[...path]/route.ts`.

> They are deliberately **not** in `public/`. Next indexes that folder when it
> builds, so a file written there afterwards 404s until the next deploy — which
> would defeat the point of adding a project without touching code.

Back up `uploads/` along with the database.

---

## Email

Contact-form mail goes out through nodemailer using the cPanel mailbox:

```
SMTP   uniqueweblayer.com : 465   SSL/TLS, auth required
```

`contact@` is the sending account, `info@` is where leads are delivered. The
enquirer also gets an automatic acknowledgement — turn that off with
`SEND_AUTOREPLY=false`.

If a send fails the lead is still in the database and shows as **Email failed**
in the admin inbox.

---

## Backups

```bash
./scripts/backup.sh
```

Dumps MySQL (gzipped) and archives `uploads/`, keeping 14 days. Cron:

```
15 3 * * * /home/USER/uniqueweblayer/scripts/backup.sh >> /home/USER/backup.log 2>&1
```

Run it by hand once and confirm the files are not empty before trusting it.

---

## Common edits

| What | Where |
| --- | --- |
| Company name, emails, phone, socials, stats | `app/data/site.ts` |
| Services and the seven service lines | `app/data/services.ts` |
| The service-line slugs themselves | `app/lib/serviceTypes.ts` (single source) |
| Country pages (SEO only, not shown in the UI) | `app/data/countries.ts` |
| Client quotes on the home page | `CLIENT_QUOTES` in `app/components/Testimonials.tsx` |
| Icons | `app/components/Icon.tsx` |

Adding a service: add an entry to `services` in `app/data/services.ts`, then
create `app/services/<slug>/page.tsx`.

---

## Theming

Light and dark are driven by CSS variables in `app/globals.css`, set via
`data-theme` on `<html>`.

> Never hardcode a dark hex (`bg-[#140d28]`) on anything holding text. It stays
> dark in light mode while the text flips to ink, and the result is invisible.
> Use `.uwl-panel` / `.uwl-modal`, which follow the theme.

---

## SEO

- Metadata on every page via `pageMeta()` in `app/lib/seo.ts`
- Organization, WebSite, Service, FAQ, CreativeWork and Breadcrumb schema
- `sitemap.ts` regenerates hourly and includes every portfolio project
- Country pages exist for search only — no country is shown in the normal UI

**Still to do:** paste the Google Search Console verification code into
`verification` in `app/layout.tsx`, rebuild, then submit
`https://uniqueweblayer.com/sitemap.xml`.

---

## Deploying

See `DEPLOY.md`. In short: one Node app on cPanel, startup file `server.js`,
`npm run migrate` before the first boot.
