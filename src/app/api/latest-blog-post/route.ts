import { NextResponse } from "next/server";

/**
 * API route to fetch the latest blog post from an external blog API.
 */
export async function GET() {
  // console.log("API Route: /api/latest-blog-post - Request received."); // Log start of request
  try {
    const blogApiUrl =
      "https://theprogrammersgazette.vercel.app/api/latest-blog-post"; // Assuming this is fixed now

    // console.log(`API Route: Fetching from external blog API: ${blogApiUrl}`); // Log external fetch attempt
    const response = await fetch(blogApiUrl, {
      next: { revalidate: 7200 },
    });

    // console.log(`API Route: External API response status: ${response.status}`); // Log external API status

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API Route ERROR: External blog API returned non-OK status: ${response.status} - ${errorText}`
      );
      throw new Error(
        `Failed to fetch from blog API: ${response.statusText} (${response.status}) - ${errorText}`
      );
    }

    const latestPostData = await response.json();
    // console.log(
    //   "API Route SUCCESS: Data received from external blog API:",
    //   latestPostData
    // ); // Log successful data from external API

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
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  } finally {
    console.log("Blog Request finished."); // Log end of request
  }
}
