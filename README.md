# Banana Theory — Customer Review App

Mobile-first review capture for Banana Theory. Next.js 15 + App Router, Tailwind,
Framer Motion, MongoDB, and a proxy to a self-hosted [oracle-uploadthing](https://github.com/) instance for photo uploads.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

Then open <http://localhost:3000/review>.

`/` redirects to `/review`. `/admin` is protected by Basic Auth.

## Environment

| Var | Purpose |
| --- | --- |
| `MONGODB_URI` | Mongo Atlas / self-hosted connection string |
| `MONGODB_DB` | DB name (default `banana_theory`) |
| `ADMIN_USER` / `ADMIN_PASS` | Basic Auth for `/admin` |
| `UPLOAD_API_URL` | Base URL of your `oracle-uploadthing` `/api/upload` |
| `UPLOAD_API_TOKEN` | Bearer token from that service |
| `UPLOAD_PROJECT_NAME` | Bucket project name (default `banana-theory`) |

Without `UPLOAD_API_URL` + `UPLOAD_API_TOKEN`, the photo step still works but returns
`503 Upload service not configured` if you try to submit an image. Users can skip
the photo step and continue.

## Brand assets

Drop your PNGs into `public/assets/banana-theory/`. The filenames the app looks for
live in `lib/assets.ts` — mostly:

- `logo.png`, `hero-banana.png`, `thank-you.png`
- `reaction-love.png`, `reaction-sweet.png`, `reaction-ok.png`, `reaction-meh.png`
- optional product / decoration shots

Any missing file falls back to a Lucide icon in a branded circle (see `BrandImage`),
so the UI never breaks while you're staging assets.

## Deploy to Vercel

1. Push to Git.
2. Import in Vercel, set the env vars above.
3. Deploy. Point your QR code at `https://<your-domain>/review`.

## Endpoints

- `POST /api/reviews` — Zod-validated. Body: `{ impression, loved[], photoUrl?, photoType?, rating, comment? }`. Rate-limited to 10/min per IP, 30 s dedupe.
- `POST /api/upload` — multipart `file`; proxies to oracle-uploadthing so the bearer token never touches the browser.

## Project shape

```
app/
  layout.tsx, page.tsx (redirects to /review)
  review/page.tsx          # main flow
  thank-you/page.tsx       # standalone thank-you screen
  admin/page.tsx           # basic-auth dashboard
  api/reviews/route.ts     # POST review → Mongo
  api/upload/route.ts      # POST image proxy
components/
  brand/                   # logo, decorations, image-with-fallback
  ui/                      # PrimaryButton, StarRating, OptionCard, ImageUploadCard...
  review/                  # ReviewShell + one component per step
lib/
  mongodb.ts               # cached mongoose connection + Review model
  validations.ts           # Zod schema + comment sanitization
  review-types.ts, assets.ts
```

## Production considerations still open

- `POST /api/reviews` uses an in-process rate limiter; swap to Upstash Ratelimit if you run more than one lambda.
- Comment sanitization strips control chars only. If you later render comments in HTML somewhere with `dangerouslySetInnerHTML`, add a proper sanitizer.
- `/admin` uses Basic Auth. Fine for internal review. If it grows beyond a couple of eyes, put it behind SSO or NextAuth.
