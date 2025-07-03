import { NextRequest, NextResponse } from "next/server";

// Define a specific interface for the route context's params
interface RouteParams {
  username: string;
}

// Define the full context interface, explicitly stating params is a Promise
// This is to satisfy the build-time type checker based on the error message.
interface RouteContext {
  params: Promise<RouteParams>; // Explicitly define params as a Promise
}

const GITHUB_GRAPHQL_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

export async function GET(
  request: NextRequest,
  // Use the explicitly defined RouteContext to tell TypeScript that params is a Promise
  context: RouteContext
) {
  // Keep the await here, as the console log shows it's necessary in your environment
  const { username } = await context.params;

  // // --- DEBUGGING LOGS (keep these for now, they were very helpful!) ---
  // console.log("GitHub API Route: Request received for username:", username);
  // console.log(
  //   "GitHub API Route: Type of context.params:",
  //   typeof context.params
  // );
  // console.log(
  //   "GitHub API Route: Value of context.params (before await):",
  //   context.params
  // ); // Log the promise object
  // console.log(
  //   "GitHub API Route: Value of destructured username (after await):",
  //   username
  // );
  // // --- END DEBUGGING LOGS ---

  if (!username) {
    return NextResponse.json(
      { error: "GitHub username is required" },
      { status: 400 }
    );
  }

  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    console.error("GITHUB_TOKEN environment variable is not set.");
    return NextResponse.json(
      { error: "Server configuration error: GitHub token missing." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        query: GITHUB_GRAPHQL_QUERY,
        variables: { username },
      }),
      next: { revalidate: 7200 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `GitHub GraphQL API error for ${username}: ${response.status} - ${errorText}`
      );
      return NextResponse.json(
        { error: `Failed to fetch GitHub data: ${response.statusText}` },
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

    const contributionsData =
      result.data?.user?.contributionsCollection?.contributionCalendar;

    if (!contributionsData) {
      return NextResponse.json(
        { error: `No contribution data found for GitHub user "${username}".` },
        { status: 404 }
      );
    }

    return NextResponse.json(contributionsData);
  } catch (error) {
    console.error(`Error in GitHub API route for ${username}:`, error);
    return NextResponse.json(
      { error: "Internal server error while fetching GitHub data." },
      { status: 500 }
    );
  }
}
