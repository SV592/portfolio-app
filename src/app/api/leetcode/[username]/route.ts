import { NextRequest, NextResponse } from "next/server";

// Define a specific interface for the route context's params
interface RouteParams {
  username: string;
}

// Define the full context interface, explicitly stating params is a Promise
interface RouteContext {
  params: Promise<RouteParams>; // This is the crucial part: params is a Promise
}

// (Your LeetCode GraphQL Query or external API URL would go here)
const LEETCODE_API_URL = "https://leetcode.com/graphql/";
const LEETCODE_GRAPHQL_QUERY = `
  query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

export async function GET(
  request: NextRequest,
  // FIXED: Use the explicitly defined RouteContext to tell TypeScript that params is a Promise
  context: RouteContext
) {
  // FIXED: Keep the await here, as the console log shows it's necessary in your environment
  const { username } = await context.params;

  // // --- ADDED DEBUGGING LOGS (similar to GitHub route) ---
  // console.log("LeetCode API Route: Request received for username:", username);
  // console.log(
  //   "LeetCode API Route: Type of context.params:",
  //   typeof context.params
  // );
  // console.log(
  //   "LeetCode API Route: Value of context.params (before await):",
  //   context.params
  // );
  // console.log(
  //   "LeetCode API Route: Value of destructured username (after await):",
  //   username
  // );
  // // --- END DEBUGGING LOGS ---

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
        query: LEETCODE_GRAPHQL_QUERY,
        variables: { username },
      }),
      next: { revalidate: 7200 }, // Adjust revalidate as needed
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `LeetCode API error for ${username}: ${response.status} - ${errorText}`
      );
      return NextResponse.json(
        { error: `Failed to fetch LeetCode data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    if (result.errors) {
      console.error(`GraphQL errors for ${username}:`, result.errors);
      return NextResponse.json(
        { error: result.errors[0]?.message || "GraphQL error occurred." },
        { status: 400 }
      );
    }

    // Process LeetCode data to match your expected profile structure
    type SubmissionStat = { difficulty: string; count: number };
    const submitStats: SubmissionStat[] =
      result.data?.matchedUser?.submitStats?.acSubmissionNum;
    if (!submitStats) {
      return NextResponse.json(
        { error: `No submission stats found for LeetCode user "${username}".` },
        { status: 404 }
      );
    }

    const easySolved =
      submitStats.find((s: SubmissionStat) => s.difficulty === "Easy")?.count ||
      0;
    const mediumSolved =
      submitStats.find((s: SubmissionStat) => s.difficulty === "Medium")
        ?.count || 0;
    const hardSolved =
      submitStats.find((s: SubmissionStat) => s.difficulty === "Hard")?.count ||
      0;
    const solvedProblem = easySolved + mediumSolved + hardSolved;

    const leetCodeProfileData = {
      solvedProblem,
      easySolved,
      mediumSolved,
      hardSolved,
      // Add other profile fields if your component expects them
    };

    return NextResponse.json(leetCodeProfileData);
  } catch (error) {
    console.error(`Error in LeetCode API route for ${username}:`, error);
    return NextResponse.json(
      { error: "Internal server error while fetching LeetCode data." },
      { status: 500 }
    );
  }
}
