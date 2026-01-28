# Agent Instructions — Link Shortener Project

Purpose: provide clear, actionable rules for LLM-based agents working in this repository. These guidelines are tailored for safe, consistent, and minimal-impact edits to a Next.js + TypeScript project using Drizzle for DB interactions.

## Scope
- Apply to any automated LLM agent, Copilot-style assistant, or human-in-the-loop automation that edits code, documentation, or configuration in this repo.
- Agents should make focused changes, explain intent, and avoid wide-reaching refactors unless explicitly asked.

## Core Principles
- Safety: never introduce secrets, credentials, or hard-coded environment variables. Use `.env.local` for local secrets and reference `process.env` only.
- Minimal diffs: prefer the smallest change that solves the problem. Avoid modifying unrelated files.
- Explain changes: for each non-trivial edit include a one-paragraph rationale and concise test instructions.
- Use project tools: respect existing linting, formatting, and build scripts (see `package.json`).

## Editing rules
- Use the `apply_patch` workflow for all edits (or the equivalent programmatic patch tool). Make atomic patches per logical change.
- Do not change unrelated import paths, formatting preferences, or build config unless the change is required.
- Preserve code style and patterns used in nearby files (TypeScript types, React/Next conventions, functional components, etc.).
- When adding dependencies, update `package.json` and include a short justification and any required build or install steps.

## Testing & verification
- Run linters and formatters before proposing changes. If scripts exist, run:

```
npm run lint
npm run build
npm run test
```

- For Next.js changes, ensure `npm run build` succeeds locally. For DB changes, ensure migrations and queries run against a local dev DB.

## Database & migrations
- This project uses Drizzle (see `drizzle.config.ts`). Do not modify DB credentials in code. Create migrations using the project's established workflow and include a migration description.
- When changing schema or queries, add or update tests that assert expected behavior.

## Security & privacy
- Sanitize and validate all user inputs. Do not log PII or tokens. Flag any potential security-sensitive findings immediately.

## Commits & PRs
- Use concise, imperative commit messages. Prefer the Conventional Commits format: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- Each PR should include:
	- Summary of change
	- Rationale
	- How to test (commands and expected results)
	- Files changed and why

## Communication conventions
- When referring to files or symbols in messages, wrap them in backticks, e.g. `app/page.tsx` or `lib/utils.ts`.
- Provide workspace-relative file links when possible in PR descriptions and code review comments.

## When to ask for clarification
- If a change touches core app behavior, auth, billing, or DB schema, request human review before merging.
- If tests or builds fail after your change, stop and ask for clarification; include failing logs.

## Splitting into `/docs`
These instructions should be split into focused docs under `/docs` for long-term maintainability. ALWAYS refer to the relevent .md file BEFORE generating any code:

- See `docs/authentication.md` for project-wide Clerk auth rules, protected-route patterns, and modal sign-in/sign-up guidance.
 - See `docs/authentication.md` for project-wide Clerk auth rules, protected-route patterns, and modal sign-in-sign-up guidance.
 - See `docs/shadcn-ui.md` for UI rules: always use shadcn UI components, import patterns, composition, and accessibility guidance.
 - See `docs/frontend-guidelines.md` for Next.js + TypeScript frontend conventions, environment rules, and Drizzle usage patterns.

## Final note
Be conservative and transparent. Prefer asking a human when in doubt. When you finish edits, include the test steps and mark the relevant TODOs as complete.

