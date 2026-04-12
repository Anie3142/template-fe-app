# Frontend App Template

Production-ready Next.js 14 + shadcn/ui + Auth0 (server-side) + Cloudflare
Workers scaffold. Copy this repo, fill in your pages + API client, and deploy.

## Expected layout (sibling-checkout for full-stack dev)

When paired with a backend app spawned from `template-be-app`, both repos live
side-by-side under a shared parent directory:

```
~/code-repo/<app>/
├── backend/     # sibling repo (template-be-app)
└── frontend/    # this repo (template-fe-app)
```

Each is its own independent git repo with its own CI. The parent directory is
NOT a git repo — it's just an organizational wrapper so the backend's
`docker compose --profile full up` can bind-mount this source tree into a
hot-reloading container.

## Quick Start — two modes

Copy the env file once:

```bash
cp .env.example .env.local
```

**Mode 1: FE-only host dev** (no containers for the frontend — fastest
inner-loop, talks to whatever backend you point `NEXT_PUBLIC_API_BASE_URL` at):

```bash
npm install
npm run dev
# → Visit http://localhost:3000
```

**Mode 2: Full-stack dev via sibling backend** (FE runs in a container
alongside db + web — single command for the whole stack):

```bash
cd ../backend
docker compose --profile full up
# → db + Django + Next.js all hot-reloading. Visit http://localhost:3000
```

In Mode 2 the FE container mounts this repo at `/app`, anonymous volumes keep
`node_modules` and `.next` isolated from the host (see the gotcha below), and
the FE reaches the BE via the BE's published port `http://localhost:8000` (not
the internal Docker hostname — `NEXT_PUBLIC_*` gets baked into the client
bundle and runs in your browser on the host).

Either mode: the landing page shows a shadcn `Button` component and an Auth0
login link. The dev server boots fine with placeholder credentials; Auth0 is
only called when you actually click login.

## What's baked in

- **Next.js 14 App Router** with TypeScript strict mode and `@/*` path alias.
- **Tailwind CSS** + **shadcn/ui** (`new-york` style, slate base). `Button` and `Skeleton` are pre-installed — add more with `npx shadcn@latest add <component>`.
- **@auth0/nextjs-auth0** server-side SDK. Server routes live at `/api/auth/[auth0]/route.ts` (`login`, `logout`, `callback`, `me`).
- **`PersistQueryClientProvider`** with senior-dev TanStack Query defaults: `staleTime: 5*60*1000`, `gcTime: 24*60*60*1000`, `refetchOnWindowFocus: false`, `refetchOnReconnect: false`, localStorage persister with `PERSIST_BUSTER` version tag.
- **Lazy-loaded charts** via `next/dynamic` in `src/components/charts/index.tsx` (must be `.tsx`, returns JSX fallbacks). Recharts only ships in the bundle when a chart is actually rendered.
- **Lazy-loaded modals** via `next/dynamic` in `src/components/modals/index.ts`.
- **`useDebouncedValue`** hook for search inputs (300 ms default).
- **Typed API client** at `src/lib/api-client.ts` — `apiFetch<T>(path, opts)` wrapper that attaches the Auth0 access token.
- **OpenAPI type generation**: run `npm run gen:api` to regenerate `src/lib/api-types.ts` from the backend schema (`openapi-typescript ../backend/schema.yaml -o src/lib/api-types.ts`).
- **Cloudflare Workers deployment** via `@opennextjs/cloudflare` — `wrangler.toml` + `open-next.config.ts` pre-wired.
- **Playwright E2E** — `playwright.config.ts` (`workers: 4`, `retries: 1`), dev-bypass helper in `tests/e2e/helpers/auth.ts`, smoke test in `tests/e2e/smoke.spec.ts`.

## Structure

```
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── components.json             # shadcn/ui config
├── wrangler.toml               # Cloudflare Workers config
├── open-next.config.ts         # @opennextjs/cloudflare adapter config
├── playwright.config.ts
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx          # wraps children in Providers
│   │   ├── page.tsx            # landing page with Button + Auth0 login link
│   │   └── api/auth/[auth0]/route.ts  # handleAuth() (server-side)
│   ├── components/
│   │   ├── providers.tsx       # UserProvider + PersistQueryClientProvider
│   │   ├── ui/{button,skeleton}.tsx
│   │   ├── charts/index.tsx    # lazy Recharts wrappers
│   │   └── modals/index.ts     # lazy Radix Dialog wrappers
│   ├── hooks/useDebouncedValue.ts
│   └── lib/
│       ├── utils.ts            # cn() helper
│       ├── api-client.ts       # typed fetch wrapper
│       └── api-types.ts        # placeholder — regen via `npm run gen:api`
└── tests/e2e/
    ├── helpers/auth.ts
    └── smoke.spec.ts
```

## Overriding `NEXT_PUBLIC_API_BASE_URL`

The default `http://localhost:8000/api/v1` only makes sense for local dev with
the backend on its default port. Override it whenever you leave that setup:

**Non-default local ports** (e.g. BE remapped to `8001` to dodge a port clash):

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001/api/v1
```

`NEXT_PUBLIC_*` values are baked in at Next.js build/dev-start time, so
restart `npm run dev` (or re-`up` the `frontend` compose service) after
editing `.env.local`. **In Mode 2** (`docker compose --profile full up`), the
compose file's `environment:` block wins over `.env.local` — edit the
`NEXT_PUBLIC_API_BASE_URL` value in `template-be-app/docker-compose.yml`'s
`frontend:` service, not here.

**Production (Cloudflare Workers)** via `wrangler.toml` `[vars]` block:

```toml
# wrangler.toml
[vars]
NEXT_PUBLIC_API_BASE_URL = "https://<app>-api.example.com/api/v1"
```

Because this value is public (gets shipped to the browser), it lives in
`[vars]`, NOT in `wrangler secret put`. Real secrets (`AUTH0_SECRET`,
`AUTH0_CLIENT_SECRET`) go through `npx wrangler secret put` so they never
touch the repo.

**Staging / preview Workers environments** — use per-environment `[env.*]`
blocks in `wrangler.toml`:

```toml
[env.staging.vars]
NEXT_PUBLIC_API_BASE_URL = "https://<app>-api-staging.example.com/api/v1"
```

Deploy with `npx wrangler deploy --env staging`.

## Regenerating API types

When the backend schema changes, regenerate the frontend types:

```bash
npm run gen:api
```

This runs `openapi-typescript ../backend/schema.yaml -o src/lib/api-types.ts`
against the **sibling backend repo**. The `../backend/` path assumes the
sibling-checkout layout documented above. If your layout differs, adjust the
path in `package.json`'s `gen:api` script.

The backend exports its OpenAPI schema on startup via drf-spectacular. In the
sibling layout you can regenerate the schema file from the running container:

```bash
cd ../backend
docker compose exec web python manage.py spectacular --file schema.yaml
cd ../frontend
npm run gen:api
```

## Deployment — Cloudflare Workers

```bash
npm run cf:build      # @opennextjs/cloudflare build
npm run cf:deploy     # build + wrangler deploy
```

Set real secrets with `npx wrangler secret put AUTH0_SECRET` etc. Don't put
secrets in `wrangler.toml` `[vars]` — that block is public.

## Critical gotcha — Docker volume mount + `npm run build`

**Never run `npm run build` on the host while a docker container shares
`.next/` via a volume mount.** It nukes the dev webpack cache and the dev
server starts serving a blank white screen (500s on every chunk).

**In Mode 2 (sibling backend `--profile full`), this cannot happen** — the
backend compose uses anonymous volumes (`/app/node_modules` and `/app/.next`)
which keep host and container caches completely isolated. Run
`npm run build` on the host whenever you want; the container's `.next` lives
in a separate Docker-managed volume the host can't see.

**In Mode 1 (host-only `npm run dev`)**, there's no container sharing `.next`
at all, so there's nothing to clobber. Safe by construction.

The only way to hit this gotcha is to roll a custom compose that bind-mounts
the frontend directory **without** the `/app/.next` anonymous volume override.
If you do that, fix it by:

- Stopping the container first, OR
- Running the build inside the container: `docker compose exec frontend npm run build`

The anon-volume pattern in `template-be-app/docker-compose.yml`'s `frontend`
service is the canonical fix — don't strip it.

## Workflow Rules (NON-NEGOTIABLE)

This template inherits the infrastructure workflow rules. Read
[`~/code-repo/namesless-company-infra/CLAUDE.md`](../namesless-company-infra/CLAUDE.md)
before making any infrastructure changes. Short version:

1. **Terraform-first for ALL infrastructure changes.** No `aws ecs update-service`, no manual `aws ssm put-parameter` (except Rule 5).
2. **AWS CLI is read-only.** `describe-*`, `list-*`, `get-*`, `logs`, `wait`, `sts get-caller-identity` only.
3. **`aws2wrap --profile default -- terraform <cmd>`** for every Terraform invocation — plain `terraform` fails under OIDC SSO.
4. **OIDC SSO login is interactive.** `aws sso login --profile default` opens Chrome; the agent cannot click approve.
5. **SSM secret pattern** — Terraform creates `aws_ssm_parameter` with `lifecycle.ignore_changes = [value]`; real value set via console or one-time `put-parameter --overwrite`.
6. **Confirm before destructive actions.**

## Related

- Backend template: `~/code-repo/template-be-app/`
- Infrastructure repo: `~/code-repo/namesless-company-infra/`
- Reference implementation: `~/code-repo/personal-finance-app/personal-finance-fe/`
