# Water Balance Frontend

Next.js 14 App Router frontend for the water balance and leakage correction platform. The implementation follows the provided specification covering layout, routing, data fetching scaffolding, and visualization components.

## Getting Started

```bash
pnpm install
pnpm dev
```

Set the required environment variables before running:

```bash
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL, APP_NAME, APP_BRAND_COLOR as needed
```

## Available Scripts

- `pnpm dev` – start the development server.
- `pnpm build` – create a production build.
- `pnpm start` – run the production server.
- `pnpm lint` – run ESLint.
- `pnpm typecheck` – run TypeScript checks.
- `pnpm test` – run Vitest unit tests (to be added).
- `pnpm test:ui` – run Playwright end-to-end tests (to be added).

## Project Structure

Key directories:

- `src/app` – App Router routes, grouped into `(auth)` and `(app)` segments.
- `src/components` – shared UI, chart, table, form, and feedback components.
- `src/lib` – API client, query client, types, formatting helpers, and service wrappers.
- `src/hooks` – custom React hooks.
- `src/styles` – Tailwind and global styles.

## Next Steps

- Wire pages to the backend endpoints once available.
- Replace mocked data with real API responses and handle optimistic updates.
- Expand shadcn/ui component coverage and introduce toast notifications.
- Implement column persistence, table virtualization, and full form validation flows.
- Add Vitest unit tests and Playwright scenarios as outlined in the spec.
