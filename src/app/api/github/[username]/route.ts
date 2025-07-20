import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  username: string;
}

interface RouteContext {
  params: Promise<RouteParams>;
}

// GraphQL query to fetch GitHub contribution data for a user
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

// GET handler for the API route
export async function GET(
  request: NextRequest,
  context: RouteContext // Context contains the dynamic route params
) {
  // Await the params to extract the username from the URL
  const { username } = await context.params;

  // Validate that a username was provided
  if (!username) {
    return NextResponse.json(
      { error: "GitHub username is required" },
      { status: 400 }
    );
  }

  // Get the GitHub token from environment variables
  const githubToken = process.env.GITHUB_TOKEN;

  // If the token is missing, return a server error
  if (!githubToken) {
    console.error("GITHUB_TOKEN environment variable is not set.");
    return NextResponse.json(
      { error: "Server configuration error: GitHub token missing." },
      { status: 500 }
    );
  }

  try {
    // Make a POST request to the GitHub GraphQL API
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
      next: { revalidate: 7200 }, // Cache for 2 hours
    });

    // If the response is not OK, log and return an error
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

    // Extract the contributions data from the response
    const contributionsData =
      result.data?.user?.contributionsCollection?.contributionCalendar;

    // If no data is found, return a 404 error
    if (!contributionsData) {
      return NextResponse.json(
        { error: `No contribution data found for GitHub user "${username}".` },
        { status: 404 }
      );
    }

    // Return the contributions data as JSON
    return NextResponse.json(contributionsData);
  } catch (error) {
    // Handle unexpected errors
    console.error(`Error in GitHub API route for ${username}:`, error);
    return NextResponse.json(
      { error: "Internal server error while fetching GitHub data." },
      { status: 500 }
    );
  }
}
