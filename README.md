# Wave

A calm 75-day wellness ritual tracker. Tick off five daily rituals, reflect on your pace, and track your presence — no punishment, no restarts.

## Features

- **Five daily rituals** — complete in under 30 seconds
- **Reflection flow** — mood check-in and pace reflection (Wave, Building Swell, Tsunami) only when you choose to complete your day
- **75-day journey** — progress over perfection, no restarting
- **Onboarding** — first-time tutorial explaining how Wave works
- **Convex sync** — cloud persistence with localStorage fallback

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CONVEX_URL` | No | Convex deployment URL. If missing, the app uses localStorage only. |

The app **does not break** if Convex env vars are missing — it falls back to localStorage automatically.

## Convex setup

### 1. Install and initialise

```bash
npm install
npx convex dev
```

This will:
- Prompt you to log in or create a Convex account
- Create a Convex project linked to this repo
- Generate `convex/_generated/` API types
- Write `VITE_CONVEX_URL` to `.env.local`

### 2. Deploy schema

`npx convex dev` automatically pushes the schema defined in `convex/schema.ts`:

- **userProfiles** — challenge start date, onboarding status (keyed by device ID)
- **dailyEntries** — ritual completion, reflection, mood, day status

### 3. Deploy to production

```bash
npx convex deploy
```

Copy the production deployment URL into your Vercel environment variables.

## Vercel deployment

1. Connect your GitHub repo to Vercel
2. Add environment variable:
   - `VITE_CONVEX_URL` = your Convex production URL (from `npx convex deploy`)
3. Deploy

Build command: `npm run build`
Output directory: `dist`

## Authentication options

Currently Wave uses a **device ID** stored in localStorage to identify users — no login required. This is simple and works well for a personal wellness tracker.

If you want to add authentication later, Convex supports:

| Option | Best for |
|--------|----------|
| **Convex Auth** | Email/password or OAuth built into Convex |
| **Clerk** | Polished auth UI, social logins |
| **Auth0** | Enterprise SSO needs |

Adding auth would mean replacing `deviceId` with a `userId` from the auth provider. The schema and mutations would stay largely the same.

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Type-check and build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Design philosophy

Wave is not a productivity app or a punishment app. The language is calm and supportive. Daily completion should take under 30 seconds. Missed days don't restart the challenge — you simply pick up where you left off.
