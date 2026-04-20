import { NextRequest, NextResponse } from "next/server";
import {
  GithubInsightsPayload,
  LanguageBreakdown,
} from "@/app/types/insights";

interface RouteParams {
  username: string;
}

interface RouteContext {
  params: Promise<RouteParams>;
}

const LANGUAGES_QUERY = `
  query($username: String!) {
    user(login: $username) {
      repositories(
        first: 100
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
        isFork: false
      ) {
        nodes {
          name
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

const COMMITS_QUERY = `
  query($username: String!, $since: GitTimestamp!) {
    user(login: $username) {
      repositories(
        first: 10
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
        isFork: false
      ) {
        nodes {
          name
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 100, since: $since) {
                  nodes {
                    oid
                    committedDate
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface LanguageEdge {
  size: number;
  node: { name: string; color: string | null };
}
interface RepoLanguagesNode {
  name: string;
  languages: { edges: LanguageEdge[] };
}
interface CommitNode {
  oid: string;
  committedDate: string;
}
interface RepoCommitsNode {
  name: string;
  defaultBranchRef: {
    target: { history: { nodes: CommitNode[] } } | null;
  } | null;
}

const DEFAULT_LANG_COLOR = "#858585";

const aggregateLanguages = (
  nodes: RepoLanguagesNode[]
): LanguageBreakdown[] => {
  const totals = new Map<string, { bytes: number; color: string }>();
  for (const repo of nodes) {
    for (const edge of repo.languages.edges) {
      const existing = totals.get(edge.node.name);
      const color = edge.node.color || existing?.color || DEFAULT_LANG_COLOR;
      totals.set(edge.node.name, {
        bytes: (existing?.bytes || 0) + edge.size,
        color,
      });
    }
  }
  const totalBytes = Array.from(totals.values()).reduce(
    (acc, v) => acc + v.bytes,
    0
  );
  if (totalBytes === 0) return [];

  const sorted = Array.from(totals.entries())
    .map(([name, v]) => ({
      name,
      color: v.color,
      bytes: v.bytes,
      percentage: (v.bytes / totalBytes) * 100,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  const topN = 8;
  if (sorted.length <= topN) return sorted;

  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const restBytes = rest.reduce((acc, v) => acc + v.bytes, 0);
  top.push({
    name: "Other",
    color: DEFAULT_LANG_COLOR,
    bytes: restBytes,
    percentage: (restBytes / totalBytes) * 100,
  });
  return top;
};

const flattenCommitDates = (nodes: RepoCommitsNode[]): string[] => {
  const seen = new Set<string>();
  const dates: string[] = [];
  for (const repo of nodes) {
    const history = repo.defaultBranchRef?.target?.history?.nodes;
    if (!history) continue;
    for (const commit of history) {
      if (!seen.has(commit.oid)) {
        seen.add(commit.oid);
        dates.push(commit.committedDate);
      }
    }
  }
  return dates;
};

const runGraphQL = async <T>(
  query: string,
  variables: Record<string, unknown>,
  token: string,
  revalidate: number
): Promise<T> => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub ${response.status}: ${text.slice(0, 200)}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL error");
  }
  return result.data as T;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { username } = await context.params;
  if (!username) {
    return NextResponse.json(
      { error: "GitHub username is required" },
      { status: 400 }
    );
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("GITHUB_TOKEN environment variable is not set.");
    return NextResponse.json(
      { error: "Server configuration error: GitHub token missing." },
      { status: 500 }
    );
  }

  const since = new Date(
    Date.now() - 365 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [langResult, commitResult] = await Promise.allSettled([
    runGraphQL<{ user: { repositories: { nodes: RepoLanguagesNode[] } } }>(
      LANGUAGES_QUERY,
      { username },
      token,
      21600
    ),
    runGraphQL<{ user: { repositories: { nodes: RepoCommitsNode[] } } }>(
      COMMITS_QUERY,
      { username, since },
      token,
      43200
    ),
  ]);

  const payload: GithubInsightsPayload = {
    languages: null,
    commitTimes: null,
  };

  if (langResult.status === "fulfilled" && langResult.value.user) {
    payload.languages = aggregateLanguages(
      langResult.value.user.repositories.nodes
    );
  } else if (langResult.status === "rejected") {
    console.error("GitHub languages query failed:", langResult.reason);
    payload.languagesError =
      langResult.reason instanceof Error
        ? langResult.reason.message
        : "Failed to fetch languages";
  }

  if (commitResult.status === "fulfilled" && commitResult.value.user) {
    const dates = flattenCommitDates(
      commitResult.value.user.repositories.nodes
    );
    const { buildTimeOfDayHeatmap } = await import(
      "@/app/lib/insights/heatmap"
    );
    payload.commitTimes = buildTimeOfDayHeatmap(dates);
  } else if (commitResult.status === "rejected") {
    console.error("GitHub commits query failed:", commitResult.reason);
    payload.commitTimesError =
      commitResult.reason instanceof Error
        ? commitResult.reason.message
        : "Failed to fetch commit history";
  }

  if (!payload.languages && !payload.commitTimes) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub insights." },
      { status: 502 }
    );
  }

  return NextResponse.json(payload);
}
