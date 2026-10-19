# ADR 0002: Auth0 with server-side sessions (`@auth0/nextjs-auth0` v3)

- Status: Accepted

## Context

The paired backend (`template-be-app`) validates Auth0-issued RS256 JWTs against
the tenant's JWKS and checks audience and issuer. The frontend needs login, logout
and a session, must never expose the client secret to the browser, and should let
Playwright tests run without a real Auth0 round trip.

## Decision

- Use **`@auth0/nextjs-auth0` v3**. `src/app/api/auth/[auth0]/route.ts` exports
  `handleAuth()`, which registers `/api/auth/login`, `/logout`, `/callback` and `/me`
  as server route handlers. The session is an encrypted cookie keyed by
  `AUTH0_SECRET`.
- `UserProvider` (in `src/components/providers.tsx`) exposes the session to client
  components via `useUser()`.
- `AUTH0_AUDIENCE` must equal the backend's `AUTH0_API_AUDIENCE`, so access tokens
  issued at login are accepted by the API.
- `src/lib/api-client.ts` (`apiFetch<T>`) takes an optional token and sends it as
  `Authorization: Bearer <token>`.
- For local runs and E2E tests, `NEXT_PUBLIC_DEV_AUTH_BYPASS=true` pairs with the
  backend's `DEV_AUTH_BYPASS=true`, which accepts requests without a token
  (`tests/e2e/helpers/auth.ts`).

## Consequences

- The client secret and session key stay on the server (Worker secrets); the
  browser only holds an encrypted, HTTP-only session cookie.
- Auth0 is contacted only when `/api/auth/*` is hit, so the app boots with
  placeholder values on a fresh clone.
- Wiring the access token into `apiFetch` is left to each app: the template provides
  the token parameter, not a token-fetching hook.
- `@auth0/nextjs-auth0` v4 changes the API (middleware-based); upgrading is a
  deliberate migration.
- The dev bypass is a convention between the two templates. It must stay off in
  production on both sides.

## Alternatives considered

- **Auth0 SPA SDK (client-only PKCE):** no server needed, but tokens live in the
  browser and the session is lost across tabs without extra work.
- **NextAuth / Auth.js:** provider-agnostic, but the backend is already built around
  Auth0 JWT validation.
- **Clerk or Cloudflare Access:** less code, but a different identity provider from
  the backend's.
