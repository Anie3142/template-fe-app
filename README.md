# Frontend App Template

React/Next.js frontend template for Cloudflare Pages deployment.

## Quick Start

1. Clone this template for your new frontend
2. Update `wrangler.toml` with your project name
3. Push to main → Cloudflare Pages auto-deploys

## Structure

```
├── src/                # React/Next.js source
├── public/             # Static assets
├── package.json        # Dependencies
└── wrangler.toml       # Cloudflare Pages config
```

## Deployment

**Option 1: Cloudflare Pages Git Integration (Recommended)**
1. Connect repo to Cloudflare Pages dashboard
2. Set build command: `npm run build`
3. Set output directory: `out` or `.next`

**Option 2: Wrangler CLI**
```bash
npm run build
npx wrangler pages deploy out --project-name=YOUR_PROJECT
```

## Environment Variables

Set in Cloudflare Pages dashboard:
- `NEXT_PUBLIC_API_URL` = `https://api.example.com`
