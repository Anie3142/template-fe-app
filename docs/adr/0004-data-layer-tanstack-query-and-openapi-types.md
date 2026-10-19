# ADR 0004: Data layer with TanStack Query and OpenAPI-generated types

- Status: Accepted

## Context

The app reads mostly from a single REST API whose schema is published by
drf-spectacular. Pages should paint quickly on repeat visits, avoid refetching the
same data on every navigation, and fail at compile time when the API contract
changes.

## Decision

- **TanStack Query v5** for server state, configured in `src/components/providers.tsx`:
  `staleTime` 5 minutes, `gcTime` 24 hours, no refetch on window focus or reconnect,
  one retry.
- **Persisted cache:** `PersistQueryClientProvider` with a sync `localStorage`
  persister (writes throttled to 1 s), `maxAge` 24 hours, only successful queries
  dehydrated, and a `PERSIST_BUSTER` version string. The persister is created in an
  effect so SSR never touches `window`.
- **Generated types:** `npm run gen:api` runs `openapi-typescript` against the
  backend's `schema.yaml` and writes `src/lib/api-types.ts`; `apiFetch<T>` is the
  single typed fetch wrapper.
- **Bundle hygiene:** Recharts charts and Radix dialogs are loaded with
  `next/dynamic`, and `useDebouncedValue` debounces search inputs.

## Consequences

- Repeat visits render from cache immediately and refresh in the background.
- Data can be up to 5 minutes stale by default; screens that need fresher data must
  override `staleTime` or invalidate after mutations.
- Persisted data is readable by anyone with access to the browser profile; do not
  cache sensitive responses, or exclude them via `shouldDehydrateQuery`.
- Types are only as current as the last `gen:api` run; regenerate after backend
  schema changes.

## Alternatives considered

- **SWR:** simpler, but no built-in persistence or mutation tooling comparable to
  TanStack Query.
- **React Server Components fetching only:** fewer client bundles, but every
  authenticated request would go through the Worker and lose the client cache.
- **Hand-written API types or a full generated client (orval):** hand-written types
  drift; a generated client adds more code than the thin `apiFetch` wrapper needs.
