# AGENTS.md

## Frontend Rules
## Project Stack

- Use Next.js App Router.
- Use TypeScript for all frontend code.
- Use Next.js App Router with TypeScript.
- Use Tailwind CSS for styling.
- Use next-intl for multilingual routing, messages, and locale-aware UI.
- Use next-intl for multilingual routing, messages, metadata, and locale-aware UI.
- Use lucide-react icons when an icon is needed.
- Use assets from `public` through `next/image` when rendering images or flags.

## Folder Boundaries

- `src/app` is routing only.
  - Keep route files thin.
  - Route pages should import feature entry points and set locale/metadata.
  - Locale routes must live under `src/app/[locale]`.
- `src/features` contains business and page-level logic.
  - Put feature flows such as Home and CGV booking here.
  - Keep feature-specific state, data shaping, and composed sections in the feature folder.
  - Prefer an `index.ts` as the feature public export when it keeps route imports stable.
- `src/components` contains shared UI only.
  - Components here should be reusable across features.
  - Examples: `navbar`, `banner`, `searchbar`, `footer`, `locale-switcher`.
- `src/i18n` contains next-intl routing, navigation, and request config.
- Do not create app code in `src/pages`; this project uses App Router and `src/pages` can be interpreted as legacy Pages Router.

## Routing Rules

- Home route: `src/app/[locale]/page.tsx` -> `/vi`, `/en`.
- CGV booking route: `src/app/[locale]/cgv/page.tsx` -> `/vi/cgv`, `/en/cgv`.
- Internal localized navigation should use `Link` from `@/i18n/navigation`, not `next/link`.
- Keep non-routing page implementations in `src/features`.

## Internationalization

- Do not hardcode user-facing text in components unless it is stable product data.
- Add translated UI copy to both `messages/vi.json` and `messages/en.json`.
- Client components should use `useTranslations`.
- Server route files should use `getTranslations` for metadata.
- Keep translation namespaces clear by feature or shared UI responsibility.

## UI Rules

- Use Tailwind utility classes and keep styling consistent with the existing design.
- Prefer small, focused UI components instead of large monolithic files.
- Use client components only when hooks, state, browser events, or interactive UI are required.
- Keep shared UI presentation-focused; business decisions belong in `src/features`.
- Use accessible labels for icon-only buttons, selects, dropdowns, and interactive controls.

## Comment Rules

- Always add concise comments describing the purpose of each function or exported component.
- Always add concise comments for major logic groups, UI sections, and feature blocks.
- Comments should explain intent and responsibility, not restate obvious implementation details.
- Keep comments practical and maintainable; update or remove stale comments when changing behavior.

## Verification

- Run `npm run lint` after code changes.
- Run `npm run build` after routing, i18n, or TypeScript changes.
- If Next dev returns `Internal Server Error` after moving route folders, restart the dev server and clear generated `.next` cache before debugging source code.