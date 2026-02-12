# Interfit

Web application for planning, performing, and tracking interval workouts (HIIT, Tabata, circuit training). Mobile-first SPA optimized for 320–430px screens.

## Tech stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, CSS Variables
- **UI:** shadcn/ui (Radix primitives), Framer Motion
- **State:** React Context API
- **Storage:** localStorage (offline-first)

## Getting started

**Requirements:** Node.js 18+ and npm.

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd fitapp

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev
```

The app will be available at `http://localhost:8080` (or the port shown in the terminal).

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (output in `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## Project structure

- `src/` — application source (components, pages, contexts, data)
- `public/` — static assets (favicon, avatars)

## Deploy

1. Run `npm run build`.
2. Deploy the contents of the `dist/` folder to any static hosting (Vercel, Netlify, GitHub Pages, or your own server).
3. Ensure the server is configured for SPA routing (all routes serve `index.html`).

## License

Private project. All rights reserved.
