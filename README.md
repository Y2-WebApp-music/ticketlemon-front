# TicketLemon Frontend

Frontend application for TicketLemon, built with React, TypeScript, Vite, and Bun.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- TanStack Router
- Bun (package manager + scripts)

## Prerequisites

- Bun 1.x
- Node.js 20+ (recommended)
- Docker (optional, for containerized build/run)

## Getting Started

```bash
bun install
bun run dev
```

The app will start with Vite dev server (default: `http://localhost:5173`).

## Available Scripts

- `bun run dev` - start local dev server
- `bun run build` - create production build in `dist/`
- `bun run preview` - preview the production build locally
- `bun run lint` - run ESLint
- `bun run typecheck` - run TypeScript type checking
- `bun run format` - format `ts/tsx` files with Prettier
- `bun run format:check` - verify Prettier formatting
- `bun run test` - placeholder test script (currently prints "No tests configured")

## Docker

Build the image:

```bash
docker build -t ticketlemon-front .
```

Run the container:

```bash
docker run --rm -p 8080:80 ticketlemon-front
```

Then open `http://localhost:8080`.

Notes:
- Multi-stage build: Bun builder -> Nginx runtime
- SPA routing is handled with Nginx `try_files` fallback in `nginx.conf`

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

It runs on push/PR for `main`, `master`, and `dev`, and checks:

- formatting (`bun run format:check`)
- lint (`bun run lint`)
- typecheck (`bun run typecheck`)
- test (`bun run test`)
- app build (`bun run build`)
- Docker build (`docker build -t ticketlemon-front:ci .`)

## Project Structure

- `src/pages` - page-level screens
- `src/features` - feature modules
- `src/components` - shared UI/layout components
- `src/routes` - route definitions
- `src/services` - API/http services
- `src/mocks` - mock data

