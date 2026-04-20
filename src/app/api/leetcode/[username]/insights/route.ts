import { NextRequest, NextResponse } from "next/server";
import {
  BeatsStats,
  LeetcodeInsightsPayload,
  TagBreakdown,
} from "@/app/types/insights";

interface RouteParams {
  username: string;
}

interface RouteContext {
  params: Promise<RouteParams>;
}

const LEETCODE_API_URL = "https://leetcode.com/graphql/";

const INSIGHTS_QUERY = `
  query insights($username: String!) {
    matchedUser(username: $username) {
      problemsSolvedBeatsStats {
        difficulty
        percentage
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      tagProblemCounts {
        advanced { tagName problemsSolved }
        intermediate { tagName problemsSolved }
        fundamental { tagName problemsSolved }
      }
    }
  }
`;

interface BeatsEntry {
  difficulty: string;
  percentage: number | null;
}
interface SubmissionEntry {
  difficulty: string;
  count: number;
  submissions: number;
}
interface TagEntry {
  tagName: string;
  problemsSolved: number;
}

const mapBeats = (entries: BeatsEntry[] | undefined): BeatsStats => {
  const beats: BeatsStats = { easy: null, medium: null, hard: null };
  if (!entries) return beats;
  for (const e of entries) {
    if (e.difficulty === "Easy") beats.easy = e.percentage;
    else if (e.difficulty === "Medium") beats.medium = e.percentage;
    else if (e.difficulty === "Hard") beats.hard = e.percentage;
  }
  return beats;
};

const computeAcceptanceRate = (
  entries: SubmissionEntry[] | undefined
): number | null => {
  if (!entries) return null;
  const all = entries.find((e) => e.difficulty === "All");
  if (!all || all.submissions === 0) return null;
  return (all.count / all.submissions) * 100;
};

const mergeTags = (tagBuckets: {
  advanced?: TagEntry[];
  intermediate?: TagEntry[];
  fundamental?: TagEntry[];
}): TagBreakdown[] => {
  const all = [
    ...(tagBuckets.advanced || []),
    ...(tagBuckets.intermediate || []),
    ...(tagBuckets.fundamental || []),
  ];
  const merged = new Map<string, number>();
  for (const t of all) {
    merged.set(t.tagName, (merged.get(t.tagName) || 0) + t.problemsSolved);
  }
  return Array.from(merged.entries())
    .map(([name, solved]) => ({ name, solved }))
    .filter((t) => t.solved > 0)
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 10);
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { username } = await context.params;
  if (!username) {
    return NextResponse.json(
      { error: "LeetCode username is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(LEETCODE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: INSIGHTS_QUERY,
        variables: { username },
      }),
      next: { revalidate: 7200 },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(
        `LeetCode insights error for ${username}: ${response.status} - ${text}`
      );
      return NextResponse.json(
        { error: `Failed to fetch LeetCode insights: ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    if (result.errors) {
      console.error(
        `LeetCode insights GraphQL errors for ${username}:`,
        result.errors
      );
      return NextResponse.json(
        { error: result.errors[0]?.message || "GraphQL error occurred." },
        { status: 400 }
      );
    }

    const user = result.data?.matchedUser;
    if (!user) {
      return NextResponse.json(
        { error: `No LeetCode user "${username}" found.` },
        { status: 404 }
      );
    }

    const payload: LeetcodeInsightsPayload = {
      beats: mapBeats(user.problemsSolvedBeatsStats),
      acceptanceRate: computeAcceptanceRate(
        user.submitStatsGlobal?.acSubmissionNum
      ),
      tags: mergeTags(user.tagProblemCounts || {}),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error(`Error in LeetCode insights route for ${username}:`, error);
    return NextResponse.json(
      { error: "Internal server error while fetching LeetCode insights." },
      { status: 500 }
    );
  }
}
