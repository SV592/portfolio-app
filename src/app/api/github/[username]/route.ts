import { NextRequest, NextResponse } from "next/server";

// Define the GraphQL query to fetch contribution calendar data
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

// Handle GET requests to /api/github/[username]
export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username;

  if (!username) {
    return NextResponse.json(
      { error: "GitHub username is required" },
      { status: 400 }
    );
  }

  // Get the GitHub Token from environment variables
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
      // *** THIS IS WHERE SERVER-SIDE CACHING IS APPLIED ***
      // Revalidate every hour (3600 seconds)
      next: { revalidate: 3600 },
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

    // Handle GraphQL errors returned in the data payload
    if (result.errors) {
      console.error(`GraphQL errors for ${username}:`, result.errors);
      return NextResponse.json(
        { error: result.errors[0]?.message || "GraphQL error occurred." },
        { status: 400 }
      );
    }

    // Extract the relevant data structure
    const contributionsData =
      result.data?.user?.contributionsCollection?.contributionCalendar;

    if (!contributionsData) {
      return NextResponse.json(
        { error: `No contribution data found for GitHub user "${username}".` },
        { status: 404 }
      );
    }

    return NextResponse.json(contributionsData); // Send the processed data back to the client
  } catch (error) {
    console.error(`Error in GitHub API route for ${username}:`, error);
    return NextResponse.json(
      { error: "Internal server error while fetching GitHub data." },
      { status: 500 }
    );
  }
}
