# Contributing

1. Create a branch from `main`.
2. `make install` (Node.js 20+), then `pre-commit install`.
3. Make the change.
4. Run `make test build` and, if you touched Worker config or dependencies,
   `make cf-build`.
5. Open a pull request. CI must be green: lint, typecheck, Next.js build,
   OpenNext Workers bundle and secret scan.

Significant design changes should come with a new ADR in `docs/adr/`.
Never commit real tenant IDs, domains, tokens or `.env.local`.
