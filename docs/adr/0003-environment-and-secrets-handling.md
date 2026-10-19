# ADR 0003: Environment variables and secrets handling

- Status: Accepted

## Context

Next.js treats `NEXT_PUBLIC_*` variables differently from server-only ones: the
former are inlined into the client bundle at build time. On Cloudflare Workers,
`wrangler.toml` is committed to the repo, so anything in it is public. The repo
itself is public.

## Decision

- **Local development:** `.env.example` documents every variable with placeholders;
  developers copy it to `.env.local`, which is git-ignored (as are `.env`,
  `.dev.vars` and `.wrangler/`).
- **Public config in production:** non-secret values such as
  `NEXT_PUBLIC_API_BASE_URL` live in `wrangler.toml [vars]`. Per-environment values
  use `[env.<name>.vars]` and `wrangler deploy --env <name>`.
- **Secrets in production:** `AUTH0_SECRET` and `AUTH0_CLIENT_SECRET` are set with
  `wrangler secret put` and stored encrypted by Cloudflare. They are never written
  to `wrangler.toml`.
- **Secret scanning:** gitleaks runs in CI over the full history and as a
  pre-commit hook.
- `src/lib/api-client.ts` falls back to `http://localhost:8000/api/v1` when
  `NEXT_PUBLIC_API_BASE_URL` is unset, matching the backend's local default.

## Consequences

- Anything prefixed `NEXT_PUBLIC_` must be treated as public, and changing it needs
  a rebuild (or a dev-server restart), not just a redeploy of config.
- Secrets can be rotated with `wrangler secret put` without a code change.
- Forgetting to set `NEXT_PUBLIC_API_BASE_URL` in production silently points the
  app at localhost; it is in the production checklist for that reason.
- The cached TanStack Query data in `localStorage` is user-visible; the
  `PERSIST_BUSTER` constant must be bumped after breaking API shape changes.

## Alternatives considered

- **Commit `.dev.vars` with dummy values:** convenient, but blurs the line between
  placeholders and real secrets; `.env.example` is the single documented source.
- **Runtime config fetched from the API:** avoids rebuilds for URL changes, but adds
  a request on every cold start for little gain.
- **External secret manager (Doppler, Vault):** overkill for two secrets.
