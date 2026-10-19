# Common developer tasks. Run `make help` for the list.

.DEFAULT_GOAL := help
.PHONY: help install dev lint typecheck test build cf-build cf-preview gen-api scan

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-12s %s\n", $$1, $$2}'

install: ## Install dependencies exactly from package-lock.json
	npm ci

dev: ## Next.js dev server on http://localhost:3000
	@test -f .env.local || cp .env.example .env.local
	npm run dev

lint: ## ESLint (next/core-web-vitals)
	npm run lint

typecheck: ## TypeScript, no emit
	npm run typecheck

test: lint typecheck ## Static checks (lint + typecheck); E2E: npm run test:e2e

build: ## Next.js production build
	npm run build

cf-build: ## Cloudflare Workers bundle via OpenNext (no deploy)
	npm run cf:build

cf-preview: ## Run the Worker bundle locally with wrangler dev
	npm run cf:preview

gen-api: ## Regenerate src/lib/api-types.ts from ../backend/schema.yaml
	npm run gen:api

scan: ## gitleaks over the git history
	gitleaks git --redact .
