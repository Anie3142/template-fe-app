# Changelog

All notable changes to this template. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Architecture decision records in `docs/adr/`.
- `Makefile` (`dev`, `lint`, `typecheck`, `test`, `build`, `cf-build`, `scan`).
- `.pre-commit-config.yaml` (eslint, tsc, gitleaks).
- `SECURITY.md`, `CONTRIBUTING.md`, this changelog.
- README: production checklist and "What this template gives you".

## 2026-10-19: Public release

### Added
- GitHub Actions CI: lint, typecheck, `next build`, OpenNext Workers bundle, gitleaks.
- `package-lock.json` for reproducible `npm ci`; MIT license.

### Changed
- Real Auth0 tenant and domains replaced with `example.com` placeholders.
- Worker given a valid placeholder name so the OpenNext build succeeds.
- README rewritten for a public audience.

## 2026-04-12

### Added
- Production-ready Next.js scaffold: shadcn/ui, Auth0 (`@auth0/nextjs-auth0`),
  persisted TanStack Query cache, OpenAPI type generation, lazy-loaded charts and
  modals, Playwright smoke test, dev container for the backend's full-stack profile.

### Changed
- Deployment target moved from Cloudflare Pages to Cloudflare Workers via
  `@opennextjs/cloudflare`.

## 2025-12-26

### Added
- Initial Next.js frontend template for Cloudflare Pages.
