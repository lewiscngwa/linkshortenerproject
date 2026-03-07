---
description: Read this file before creating or updating any frontend code. This document defines the project-wide frontend guidelines for Next.js, TypeScript, and Drizzle usage to ensure consistent, maintainable code.
---
# Frontend Guidelines — Next.js + TypeScript + Drizzle

Purpose: Provide concise, actionable frontend conventions for this repository. Follow these rules to keep code consistent, safe, and easy to review.

Project Structure
- Routes: use the Next.js `app/` directory for pages and route handlers.
- UI: use the shared shadcn UI components (see `docs/shadcn-ui.md`) — do not create custom UI primitives.
- Utilities: place reusable helpers in `lib/` and server-only DB code in `db/`.

TypeScript & Code Style
- Export explicit return types on public functions and handlers.
- Keep components small and focused; prefer composition over prop drilling.
- Use the project's linting and formatting commands before PRs: `npm run lint` and `npm run format` (if available).

Data Fetching & Drizzle
- Keep database access in `db/` and server components or server actions. Avoid calling DB from client components.
- Use prepared queries and follow the project's Drizzle patterns (see `db/drizzle.config.ts`).
- When changing schema, add a migration and include tests demonstrating the change.

Environment & Secrets
- Never hard-code secrets. Use `.env.local` for local development and `process.env` in code.

Forms & Validation
- Use `react-hook-form` or the repo's chosen form library with shadcn form controls.
- Validate inputs on both client (user experience) and server (security). Prefer schema validators where available.

Accessibility & Testing
- Follow accessibility practices: meaningful labels, focus management, and keyboard navigation.
- Add tests for core UI flows (links, form submission, redirects). Run `npm run test` locally before PRs.

UI Changes & Approvals
- All UI changes must use shadcn components. If a UI pattern is missing, open an issue and get maintainer approval before adding shared primitives.

Build & CI
- Ensure `npm run build` succeeds locally. Fix linting and type errors before opening a PR.

Rationale
- These guidelines minimize accidental UI drift, keep the codebase accessible, and respect the project's design system and DB patterns.
