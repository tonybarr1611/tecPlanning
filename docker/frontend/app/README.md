# Campus Plan – Vite + React

A modular academic planning prototype built with React, TypeScript, Vite, and Tailwind CSS.

## Getting Started

1. Install dependencies
2. Start dev server

## Scripts

- dev: Start Vite dev server
- build: Production build
- preview: Preview the production build

## Project Structure

- `src/components/ui`: Reusable UI primitives (Button, Card, Modal, Badge)
- `src/components`: Feature components
- `src/pages`: Route pages (Dashboard, Curriculum, Schedule, Catalog)
- `src/shared`: Types, hooks, and helpers

## Notes

- React 18 entrypoint uses `createRoot` and `BrowserRouter` in `src/index.tsx`.
- Routing is defined in `src/App.tsx`.
