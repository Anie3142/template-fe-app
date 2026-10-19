# Security policy

## Reporting a vulnerability

Please report security issues privately through GitHub's
[private vulnerability reporting](https://github.com/Anie3142/template-fe-app/security/advisories/new)
for this repository. Do not open a public issue. You can expect an acknowledgement
within a few days.

## Scope

This is a template. Issues in the template code itself (auth wiring, env handling,
caching, CI or Worker configuration) are in scope. Apps created from it are
maintained by their owners.

## Built-in safeguards

- gitleaks runs in CI over the full history and as a pre-commit hook.
- `.env`, `.env.local`, `.dev.vars` and `.wrangler/` are git-ignored.
- `AUTH0_SECRET` and `AUTH0_CLIENT_SECRET` are Worker secrets, never in
  `wrangler.toml` (see `docs/adr/0003-environment-and-secrets-handling.md`).
- The Auth0 flow runs server-side, so the client secret never reaches the browser.
