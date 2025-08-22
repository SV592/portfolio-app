import { NextResponse } from "next/server";

/**
 * API route to fetch the latest blog post from an external blog API.
 */
export async function GET() {
  // Try to fetch the latest blog post from the external API
  try {
    const apiToken = process.env.LATEST_BLOG_POST_AUTH_TOKEN;

    if (!apiToken) {
      console.error("API token is not set in environment variables.");
      return NextResponse.json(
        { message: "API token not configured" },
        { status: 500 }
      );
    }
    // URL of the external blog API endpoint
    const blogApiUrl = `https://theprogrammersgazette.vercel.app/api/latest-blog-post`;

    // Fetch the latest blog post with the correct headers
    const response = await fetch(blogApiUrl, {
      next: { revalidate: 7200 },
      headers: {
        "x-auth-token": apiToken,
      },
    });

    // If the response is not OK, log the error and throw
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API Route ERROR: External blog API returned non-OK status: ${response.status} - ${errorText}`
      );
      throw new Error(
        `Failed to fetch from blog API: ${response.statusText} (${response.status}) - ${errorText}`
      );
    }

    // Parse the JSON response from the external API
    const latestPostData = await response.json();

    // Return the data received from your blog's API directly to your portfolio's frontend
    return NextResponse.json(latestPostData);
  } catch (error) {
    // This block runs if any error occurs in the try block
    console.error(
      "API Route CATCH ERROR: Error fetching latest blog post from external blog API:",
      error
    );
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Return a 500 error with the error message
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
