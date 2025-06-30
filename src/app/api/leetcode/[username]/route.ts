import { NextRequest, NextResponse } from "next/server";

/**
 * Handles GET requests to fetch LeetCode user data from an unofficial community API.
 * This route acts as a proxy to avoid CORS issues and centralize external API calls.
 *
 * @param {NextRequest} request The incoming request object (not directly used for params here but good practice to include).
 * @param {Object} context The context object containing route parameters.
 * @param {Object} context.params The route parameters, specifically { username: string }.
 * @returns {NextResponse} A JSON response containing the LeetCode user data or an error message.
 */
export async function GET(
  request: NextRequest,
  context: { params: { username: string } }
) {
  const { username } = await context.params; // Extract the username from the URL path

  // Basic validation: Ensure a username was provided in the route
  if (!username) {
    return NextResponse.json(
      {
        error: "Username is required in the path (/api/leetcode/[username])",
      },
      { status: 400 } // Bad Request
    );
  }

  try {
    // This is the base URL for one of the popular unofficial LeetCode APIs.
    // If you found another one you prefer, replace this URL.
    const UNOFFICIAL_LEETCODE_API_BASE_URL =
      "https://alfa-leetcode-api.onrender.com";

    // Construct the full URL for the external API call
    const externalApiUrl = `${UNOFFICIAL_LEETCODE_API_BASE_URL}/${username}/solved`;

    // Make the actual request to the unofficial external LeetCode API
    const response = await fetch(externalApiUrl, {
      next: { revalidate: 7200 },
    });

    // Check if the response from the external API was successful
    if (!response.ok) {
      // If the external API returned an error, parse its body and return it
      const errorData = await response.json(); // Attempt to parse error message from external API
      console.error(`External LeetCode API error for ${username}:`, errorData);
      return NextResponse.json(
        {
          error:
            errorData.message || "Failed to retrieve data from LeetCode API",
        },
        { status: response.status } // Pass through the status code from the external API
      );
    }

    // Parse the successful response data from the external API
    const data = await response.json();

    // Return the data directly to your frontend
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // Catch any network or parsing errors during the fetch operation
    console.error(`Error fetching LeetCode data for ${username}:`, error);

    // Return a generic internal server error for unexpected issues
    return NextResponse.json(
      { error: "Internal server error while processing LeetCode request." },
      { status: 500 }
    );
  }
}
