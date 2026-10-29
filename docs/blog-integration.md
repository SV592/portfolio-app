# Blog Integration

A quick write-up of how the latest blog post is pulled into the portfolio and the technology behind it.

## Overview

The portfolio surfaces the most recent post from an external blog ([The Programmer's Gazette](https://theprogrammersgazette.vercel.app)) inside a dedicated `Blog` card. The post is fetched at runtime, cached, and rendered with a loading skeleton and graceful error handling.

## Data Flow

The feature follows the standard three-layer pattern used throughout the app:

```
External Blog API → /api/latest-blog-post → useLatestBlogPost → <Blog />
```

1. **External source** — `https://theprogrammersgazette.vercel.app/api/latest-blog-post` exposes the most recent post as JSON. Access is gated by an `x-auth-token` header.
2. **Internal API route** — [src/app/api/latest-blog-post/route.ts](../src/app/api/latest-blog-post/route.ts) proxies the external call, attaches the auth token from env, and forwards the payload.
3. **Client hook** — [src/app/Hooks/useLatestBlogPost.ts](../src/app/Hooks/useLatestBlogPost.ts) calls the internal route with SWR and returns `{ data, loading, error }`.
4. **UI component** — [src/app/components/Blog/Blog.tsx](../src/app/components/Blog/Blog.tsx) renders the title, date, description, and image, linking out to the full article.

## Technology

- **Next.js 15 App Router** — the API route runs as a Route Handler (`GET` in [route.ts](../src/app/api/latest-blog-post/route.ts)).
- **Server-side caching** — `fetch(..., { next: { revalidate: 7200 } })` caches the external response for 2 hours via Next's Data Cache, so we don't hammer the blog API on every page load.
- **Environment-secured token** — the `LATEST_BLOG_POST_AUTH_TOKEN` env var is only read on the server; it's never shipped to the client.
- **SWR** — handles client-side caching, deduplication, and revalidation. Configured with `revalidateOnFocus: false` and `revalidateIfStale: true`.
- **TypeScript** — the payload is typed via `LatestBlogPostData` in [src/app/types/blog.ts](../src/app/types/blog.ts) (`title`, `url`, `date`, `description`, optional `imageUrl`).
- **next/image** — the remote image domain `theprogrammersgazette.vercel.app` is allow-listed in [next.config.ts](../next.config.ts) so the cover image can be optimized.
- **Tailwind + DaisyUI** — the card uses a rounded white panel with a skeleton loader during fetch.

## UI States

- **Loading** — animated skeleton placeholder with the same footprint as the loaded card.
- **Error / no data** — the component logs the issue and renders nothing, keeping the page clean.
- **Success** — cover image, linked title, publish date, and description, all linking out to the full post in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).

## Environment

Required in `.env.local`:

```bash
LATEST_BLOG_POST_AUTH_TOKEN=<token issued by the blog>
```

Without this, the API route short-circuits with a 500 and the `Blog` card silently omits itself from the page.
