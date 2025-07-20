import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  username: string;
}

interface RouteContext {
  params: Promise<RouteParams>;
}

// LeetCode GraphQL endpoint and query to fetch user submission stats
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

/**
 * GET handler for the LeetCode API route.
 * Fetches submission stats for a given username from LeetCode's GraphQL API.
 */
export async function GET(
  request: NextRequest,
  context: RouteContext // Context contains the dynamic route params
) {
  // Await the params to extract the username from the URL
  const { username } = await context.params;

  // Validate that a username was provided
  if (!username) {
    return NextResponse.json(
      { error: "LeetCode username is required" },
      { status: 400 }
    );
  }

  try {
    // Make a POST request to the LeetCode GraphQL API
    const response = await fetch(LEETCODE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: LEETCODE_GRAPHQL_QUERY,
        variables: { username },
      }),
      next: { revalidate: 7200 }, // Cache for 2 hours
    });

    // If the response is not OK, log and return an error
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

    // Parse the JSON response
    const result = await response.json();

    // Handle GraphQL errors
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

    // Extract solved counts by difficulty
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

    // Build the response object
    const leetCodeProfileData = {
      solvedProblem,
      easySolved,
      mediumSolved,
      hardSolved,
    };

    // Return the processed data as JSON
    return NextResponse.json(leetCodeProfileData);
  } catch (error) {
    // Handle unexpected errors
    console.error(`Error in LeetCode API route for ${username}:`, error);
    return NextResponse.json(
      { error: "Internal server error while fetching LeetCode data." },
      { status: 500 }
    );
  }
}
