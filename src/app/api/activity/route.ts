import { NextResponse } from "next/server";
import type { ActivityItem, ActivityPayload } from "@/app/types/activity";

const GITHUB_USERNAME = "SV592";
const LEETCODE_USERNAME = "SV592";
const REVALIDATE_SECONDS = 600;
const MAX_ITEMS = 25;

interface GithubRepoRef {
  name: string;
}
interface GithubCommit {
  message: string;
  sha: string;
}
interface GithubEventBase {
  id: string;
  type: string;
  created_at: string;
  repo: GithubRepoRef;
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    size?: number;
    commits?: GithubCommit[];
    pull_request?: { title?: string; html_url?: string; merged?: boolean };
    issue?: { title?: string; html_url?: string };
    release?: { tag_name?: string; html_url?: string };
  };
}

const repoUrl = (repo: string): string => `https://github.com/${repo}`;

const mapGithubEvent = (ev: GithubEventBase): ActivityItem | null => {
  const repo = ev.repo.name;
  const ts = ev.created_at;
  switch (ev.type) {
    case "PushEvent": {
      const size = ev.payload.size ?? ev.payload.commits?.length ?? 0;
      const text =
        size > 0
          ? `Pushed ${size} commit${size === 1 ? "" : "s"} to ${repo}`
          : `Pushed to ${repo}`;
      return {
        id: `gh-${ev.id}`,
        type: "github-push",
        text,
        repo,
        href: repoUrl(repo),
        timestamp: ts,
      };
    }
    case "PullRequestEvent": {
      const pr = ev.payload.pull_request;
      if (!pr) return null;
      const merged = pr.merged && ev.payload.action === "closed";
      return {
        id: `gh-${ev.id}`,
        type: merged ? "github-pr-merged" : "github-pr",
        text: `${merged ? "Merged" : "Opened"} PR "${pr.title}" in ${repo}`,
        repo,
        href: pr.html_url ?? repoUrl(repo),
        timestamp: ts,
      };
    }
    case "CreateEvent": {
      if (ev.payload.ref_type === "repository") {
        return {
          id: `gh-${ev.id}`,
          type: "github-repo",
          text: `Created new repo ${repo}`,
          repo,
          href: repoUrl(repo),
          timestamp: ts,
        };
      }
      return null;
    }
    case "ReleaseEvent": {
      if (ev.payload.action !== "published") return null;
      const tag = ev.payload.release?.tag_name;
      return {
        id: `gh-${ev.id}`,
        type: "github-release",
        text: `Released ${tag ?? "a new version"} of ${repo}`,
        repo,
        href: ev.payload.release?.html_url ?? repoUrl(repo),
        timestamp: ts,
      };
    }
    case "ForkEvent": {
      return {
        id: `gh-${ev.id}`,
        type: "github-fork",
        text: `Forked ${repo}`,
        repo,
        href: repoUrl(repo),
        timestamp: ts,
      };
    }
    case "WatchEvent": {
      return {
        id: `gh-${ev.id}`,
        type: "github-star",
        text: `Starred ${repo}`,
        repo,
        href: repoUrl(repo),
        timestamp: ts,
      };
    }
    case "IssuesEvent": {
      if (ev.payload.action !== "opened") return null;
      const issue = ev.payload.issue;
      if (!issue) return null;
      return {
        id: `gh-${ev.id}`,
        type: "github-issue",
        text: `Opened issue "${issue.title}" in ${repo}`,
        repo,
        href: issue.html_url ?? repoUrl(repo),
        timestamp: ts,
      };
    }
    default:
      return null;
  }
};

const fetchGithubEvents = async (
  token: string
): Promise<ActivityItem[]> => {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "portfolio-app",
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: REVALIDATE_SECONDS },
    }
  );
  if (!res.ok) {
    throw new Error(`GitHub events ${res.status}`);
  }
  const events = (await res.json()) as GithubEventBase[];
  return events
    .map(mapGithubEvent)
    .filter((v): v is ActivityItem => v !== null);
};

const LEETCODE_RECENT_QUERY = `
  query recentSubs($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

interface LeetcodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
}

const fetchLeetcodeRecent = async (): Promise<ActivityItem[]> => {
  const res = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: LEETCODE_RECENT_QUERY,
      variables: { username: LEETCODE_USERNAME, limit: 20 },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`LeetCode ${res.status}`);
  const body = await res.json();
  if (body.errors) throw new Error(body.errors[0]?.message || "GraphQL error");
  const subs: LeetcodeSubmission[] =
    body.data?.recentAcSubmissionList ?? [];
  return subs.map((s) => ({
    id: `lc-${s.id}`,
    type: "leetcode" as const,
    text: `Solved "${s.title}" on LeetCode`,
    href: `https://leetcode.com/problems/${s.titleSlug}/`,
    timestamp: new Date(Number(s.timestamp) * 1000).toISOString(),
  }));
};

interface BlogPost {
  title: string;
  url: string;
  date: string;
  description?: string;
}

const fetchBlogLatest = async (
  token: string
): Promise<ActivityItem | null> => {
  const res = await fetch(
    "https://theprogrammersgazette.vercel.app/api/latest-blog-post",
    {
      headers: { "x-auth-token": token },
      next: { revalidate: REVALIDATE_SECONDS },
    }
  );
  if (!res.ok) throw new Error(`Blog ${res.status}`);
  const post: BlogPost | null = await res.json();
  if (!post || !post.title || !post.date) return null;
  const iso = new Date(post.date).toISOString();
  return {
    id: `blog-${post.url || post.title}`,
    type: "blog",
    text: `Published blog post "${post.title}"`,
    href: post.url || null,
    timestamp: iso,
  };
};

export async function GET() {
  const githubToken = process.env.GITHUB_TOKEN;
  const blogToken = process.env.LATEST_BLOG_POST_AUTH_TOKEN;

  const [ghResult, lcResult, blogResult] = await Promise.allSettled([
    githubToken
      ? fetchGithubEvents(githubToken)
      : Promise.reject(new Error("GITHUB_TOKEN not set")),
    fetchLeetcodeRecent(),
    blogToken
      ? fetchBlogLatest(blogToken)
      : Promise.reject(new Error("LATEST_BLOG_POST_AUTH_TOKEN not set")),
  ]);

  const byTimestampDesc = (a: ActivityItem, b: ActivityItem) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();

  const github: ActivityItem[] = [];
  const leetcode: ActivityItem[] = [];
  const blog: ActivityItem[] = [];

  if (ghResult.status === "fulfilled") github.push(...ghResult.value);
  else console.error("GitHub events failed:", ghResult.reason);
  if (lcResult.status === "fulfilled") leetcode.push(...lcResult.value);
  else console.error("LeetCode recent failed:", lcResult.reason);
  if (blogResult.status === "fulfilled" && blogResult.value) {
    blog.push(blogResult.value);
  } else if (blogResult.status === "rejected") {
    console.error("Blog latest failed:", blogResult.reason);
  }

  // Newest first within each source.
  github.sort(byTimestampDesc);
  leetcode.sort(byTimestampDesc);
  blog.sort(byTimestampDesc);

  // Round-robin across sources so the ticker cycles through them evenly.
  const items: ActivityItem[] = [];
  const buckets: ActivityItem[][] = [github, leetcode, blog];
  while (items.length < MAX_ITEMS && buckets.some((b) => b.length > 0)) {
    for (const bucket of buckets) {
      if (bucket.length === 0) continue;
      items.push(bucket.shift()!);
      if (items.length >= MAX_ITEMS) break;
    }
  }

  const payload: ActivityPayload = { items };
  return NextResponse.json(payload);
}
