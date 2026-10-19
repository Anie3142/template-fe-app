# ADR 0001: Next.js on Cloudflare Workers via OpenNext

- Status: Accepted (supersedes the original Cloudflare Pages setup)

## Context

The frontend is a Next.js 14 App Router app with server-side route handlers (the
Auth0 login/callback/logout/me endpoints) and SSR. It should run close to users,
cost little at low traffic, and need no servers to operate. The first version of
this template targeted Cloudflare Pages; the App Router's server features need a
full server runtime rather than a static export.

## Decision

Deploy to **Cloudflare Workers** using the **`@opennextjs/cloudflare`** adapter
(pinned to an exact version in `package.json`):

- `npm run cf:build` compiles the Next.js build into `.open-next/worker.js` plus
  `.open-next/assets`.
- `wrangler.toml` points `main` at the worker, binds the assets directory as
  `ASSETS`, and enables `nodejs_compat` so Node APIs used by Next.js and the Auth0
  SDK are available.
- `open-next.config.ts` uses the `cloudflare-node` wrapper for the server and
  `cloudflare-edge` for middleware, with `dummy` incremental cache, tag cache and
  queue (no ISR/revalidation storage is configured).
- CI runs `cf:build` on every push/PR, so a change that breaks the Workers bundle
  fails before anyone deploys. Deployment itself is an explicit `npm run cf:deploy`.

## Consequences

- No Node server to run or patch; the app scales to zero cost at idle.
- ISR and on-demand revalidation do nothing until a real incremental cache
  (e.g. R2 or KV) is configured in `open-next.config.ts`.
- The Workers runtime has CPU-time and bundle-size limits; heavy server-side work
  belongs in the backend API.
- The adapter is pinned exactly because OpenNext changes quickly; upgrades should
  be deliberate and verified with `cf:build` and `cf:preview`.
- The bundle build needs extra Node heap (`--max-old-space-size=4096`).

## Alternatives considered

- **Cloudflare Pages (`@cloudflare/next-on-pages`):** the original target. Being
  replaced upstream by the OpenNext adapter, and limited to the edge runtime.
- **Vercel:** first-class Next.js support and the least effort, but adds another
  vendor and per-seat/bandwidth pricing; the rest of the stack already uses Cloudflare.
- **Container on the backend's ECS platform:** reuses existing infra but means
  running and scaling a Node server for what is mostly a UI.
- **Static export (`output: 'export'`):** cheapest, but loses server route handlers,
  which the server-side Auth0 flow depends on.
