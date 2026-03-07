---
description: Read this file before creating or modifying any shadcn UI components or using shadcn components in your code. This document defines the project-wide guidelines for using the shadcn UI component library to ensure a consistent, accessible design system across the codebase.
---
# shadcn UI Guidelines

Purpose: Enforce consistent, accessible UI by using the project's shadcn UI component library for every UI element. Do not create standalone custom design-system components unless explicitly approved by maintainers.

Quick Rules
- **Always** use shadcn UI components for buttons, forms, navigation, modals, dialogs, lists, etc.
- **Do not** create custom UI components that duplicate shadcn functionality. Prefer composition and props customization.
- **Prefer** Tailwind utility classes passed to shadcn components for styling variations.

Import Patterns

Use the shared UI entrypoint the project exposes (commonly `ui` or `components/ui`). Example:

```ts
import { Button, Input, Dialog } from 'ui'
```

Composition & Variants
- For small variations, compose shadcn components (wrap in a feature-specific wrapper file) instead of re-implementing them.
- Keep wrappers narrow: they should only set defaults or wire props (e.g., className, size). Avoid adding new visual styles that conflict with the design system.

Forms
- Use `react-hook-form` (or the project form library) with shadcn form components. Use accessible labels and error messaging provided by shadcn.

Accessibility
- Always provide accessible labels (`aria-label`, `aria-labelledby`) when the visible label is not present.
- Prefer shadcn components' builtin accessibility features (focus management, keyboard handling) over custom implementations.

Styling
- Prefer Tailwind classes and component props; avoid global CSS overrides that target shadcn internals.
- If theming is required, use the established theme tokens or design tokens in the repo rather than ad-hoc CSS variables.

When to Add New Components
- Only add a new design-system component if shadcn lacks the needed primitive. Open an issue and get maintainer approval first.
- Place approved shared UI additions under `components/ui/` (or the project's designated UI package) and include documentation and examples.

Testing
- Include interaction tests for complex compositions (keyboard navigation, focus traps, form error states).

Rationale & Notes
- This repo relies on shadcn to keep a consistent, accessible UI surface. Enforcing this reduces visual drift and duplicated effort.
