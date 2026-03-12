# SoulSquad Deployment Guide

## Architecture

```
soulsquad.ai (Vercel)          api.soulsquad.ai (Railway)
+-----------------------+      +---------------------------+
| Next.js Landing       |      | opensoul Server           |
| - Marketing pages     | ---> | - Express API             |
| - Google OAuth flow   |      | - React dashboard UI      |
| - Onboarding wizard   |      | - PostgreSQL (Railway)    |
| - Stripe checkout     |      | - Stripe webhooks         |
+-----------------------+      | - Agent orchestration     |
                               | - better-auth (Google)    |
                               +---------------------------+
```

## Prerequisites

- Node.js 20+
- pnpm 9.15+
- Vercel account
- Railway account
- Google Cloud Console project (for OAuth)
- Stripe account
- Domain: soulsquad.ai

---

## Step 1: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URIs:
   - `https://api.soulsquad.ai/api/auth/callback/google`
   - `http://localhost:3200/api/auth/callback/google` (dev)
6. Save the Client ID and Client Secret

## Step 2: Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create a new product "SoulSquad Pro"
3. Add a recurring price: $49/month
4. Copy the Price ID (starts with `price_`)
5. In Developers > Webhooks, add endpoint:
   - URL: `https://api.soulsquad.ai/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
6. Copy the Webhook Signing Secret

## Step 3: Deploy Backend to Railway

1. Fork the opensoul repo
2. Apply the backend patches from `backend-patches/`:
   - Replace `server/src/auth/better-auth.ts` with `auth/better-auth-hosted.ts`
   - Add `server/src/services/stripe.ts` from `stripe/stripe-service.ts`
   - Add `server/src/routes/subscriptions.ts` from `routes/subscription-routes.ts`
   - Add `server/src/middleware/tier-enforcement.ts` from `middleware/tier-enforcement.ts`
   - Update `server/src/app.ts` per `app-patch.ts` instructions
   - Add `stripe` to server/package.json dependencies
3. Push to GitHub
4. In Railway:
   - New Project > Deploy from GitHub repo
   - Add PostgreSQL plugin
   - Add all env vars from `railway-env.example`
   - Set custom domain: `api.soulsquad.ai`
5. The existing `Dockerfile.railway` handles the build

## Step 4: Deploy Landing to Vercel

1. In Vercel:
   - Import the `landing/` directory
   - Set root directory to `landing`
   - Framework: Next.js
2. Add environment variables from `.env.example`
3. Set custom domain: `soulsquad.ai`

## Step 5: DNS Configuration

At your domain registrar (for soulsquad.ai):

```
soulsquad.ai        CNAME  cname.vercel-dns.com
api.soulsquad.ai    CNAME  your-railway-app.up.railway.app
```

---

## Local Development

```bash
# Terminal 1: Backend (opensoul with patches)
cd opensoul
cp .env.example .env
# Edit .env with your Google OAuth + Stripe credentials
pnpm install
pnpm dev

# Terminal 2: Landing site
cd soulsquad/landing
cp .env.example .env.local
# Edit .env.local, set NEXT_PUBLIC_API_URL=http://localhost:3200
npm install
npm run dev
```

---

## Auth Flow

1. User visits soulsquad.ai
2. Clicks "Get started free"
3. Redirected to `api.soulsquad.ai/api/auth/signin/google`
4. Google OAuth consent screen
5. Callback to `api.soulsquad.ai/api/auth/callback/google`
6. better-auth creates session cookie
7. New users redirected to `soulsquad.ai/onboarding`
8. Existing users redirected to `api.soulsquad.ai` (dashboard)

## Stripe Flow

1. User on free tier clicks "Upgrade to Pro"
2. Frontend calls `POST /api/companies/:id/checkout`
3. Backend creates Stripe Checkout session
4. User completes payment on Stripe
5. Stripe sends webhook to `api.soulsquad.ai/api/webhooks/stripe`
6. Backend updates company metadata with `tier: "pro"`
7. Tier enforcement middleware unlocks Pro limits

## Tier Limits

| Feature | Free | Pro ($49/mo) |
|---------|------|-------------|
| Projects | 1 | Unlimited |
| Agents | 3 (Director + 2) | All 6 |
| Heartbeat interval | 60 min | 15 min |
| Custom instructions | No | Yes |
| Support | Community | Priority |
