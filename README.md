# Shaquille Pearson — Portfolio

Personal portfolio site live at [shaquillepearson.com](https://shaquillepearson.com). It pulls live data from GitHub, LeetCode and my blog, [The Programmer's Gazette](https://theprogrammersgazette.vercel.app), next to resume sections, projects and research papers.

## Features

- **Resume sections**: profile, skills, education, experience, projects and research.
- **Project and research modals**: cards expand into detail views with screenshots, tech stack, status, authors, abstracts and PDF downloads.
- **GitHub contributions**: a contribution graph, plus an insights modal with streaks, a day/month heatmap and activity stats.
- **LeetCode stats**: solved-problem breakdown, plus an insights modal.
- **Activity ticker**: a live feed of recent GitHub and LeetCode activity.
- **Latest blog post**: the newest article from The Programmer's Gazette ([details](docs/blog-integration.md)).
- **Tetris**: a playable game in the sidebar on large screens (≥ 1700px).
- **Light and dark themes**: custom DaisyUI themes with gradient backgrounds.
- **Custom 404 page**.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 15 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4, DaisyUI 5 |
| Animation | Motion |
| Data | SWR, Next.js Route Handlers with the Data Cache |
| Charts and icons | Recharts, Font Awesome |
| Theming | next-themes |
| Analytics and hosting | Vercel Analytics, Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone https://github.com/SV592/portfolio-app.git
cd portfolio-app
npm install
```

Create a `.env.local` file in the project root:

```bash
GITHUB_TOKEN=                  # GitHub personal access token (GraphQL API)
LATEST_BLOG_POST_AUTH_TOKEN=   # Auth token for the blog API
```

Start the dev server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with Turbopack |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/app/
├── api/              # Route Handlers that proxy and cache external APIs
│   ├── activity/
│   ├── github/[username]/          (+ insights/)
│   ├── leetcode/[username]/        (+ insights/)
│   └── latest-blog-post/
├── components/       # UI sections (Profile, Skills, Projects, Github, Tetris, ...)
├── Hooks/            # SWR data hooks (useGithubContributions, useLeetcodeData, ...)
├── lib/insights/     # Streak and heatmap calculations
├── types/            # Shared TypeScript types
├── layout.tsx        # Root layout: metadata, fonts, theme provider, analytics
├── page.tsx          # Home page that lays out every section
└── globals.css       # Tailwind setup and custom themes
```

## How Live Data Works

Every external source goes through the same three layers:

```
External API → /api/<source> route → use<Source> SWR hook → component
```

1. **API routes** run on the server, attach the secret tokens and cache responses (from 10 minutes for the activity feed up to 12 hours for GitHub insights).
2. **Hooks** fetch from those routes with SWR, check the response shape and return `{ data, loading, error }`.
3. **Components** render a loading skeleton, an error state or the data.

Tokens are only read on the server, so they never reach the browser.

## Deployment

The site deploys on [Vercel](https://vercel.com). Set `GITHUB_TOKEN` and `LATEST_BLOG_POST_AUTH_TOKEN` in the Vercel project's environment variables. No other configuration is needed.

To load images from a new external domain, add it to `images.remotePatterns` in [next.config.ts](next.config.ts).
