import useSWR from "swr";
import { LatestBlogPostData } from "../types/blog";

/**
 * Fetcher function for SWR to get the latest blog post from the API.
 * Throws an error if the response is not OK.
 * @param url The API endpoint URL.
 * @returns The latest blog post data.
 */
const fetcher = async (url: string): Promise<LatestBlogPostData> => {
  const response = await fetch(url);

  // If the response is not OK, parse and throw the error
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.error || `Failed to fetch blog post: ${response.status}`;
    console.error("Fetcher received non-OK response:", {
      status: response.status,
      errorData,
    }); // Log non-OK response
    throw new Error(errorMessage);
  }

  // Parse and return the blog post data
  const data: LatestBlogPostData = await response.json();
  console.log("Fetcher about to return data:", data); // Log the fetched data
  return data;
};

/**
 * The return type for the useLatestBlogPost hook.
 */
interface UseLatestBlogPostResult {
  data: LatestBlogPostData | null; // The latest blog post data, or null if not loaded
  loading: boolean; // Indicates if the data is currently loading
  error: string | null; // Error message if fetching data failed, or null if no error
}

/**
 * Custom React hook to fetch and provide the latest blog post data.
 * Uses SWR for data fetching and caching.
 * @returns An object containing the data, loading state, and error (if any).
 */
export const useLatestBlogPost = (): UseLatestBlogPostResult => {
  // Use SWR to fetch the latest blog post from the API
  const { data, error, isLoading } = useSWR<LatestBlogPostData, Error>(
    "/api/latest-blog-post",
    fetcher,
    {
      revalidateOnFocus: false, // Do not revalidate on window focus
      revalidateIfStale: true, // Revalidate if data is stale
      onError: (err) => {
        console.error("SWR Hook Error:", err); // Log errors
      },
    }
  );

  // Return the blog post data, loading state, and error message
  return {
    data: data || null,
    loading: isLoading,
    error: error ? error.message : null,
  };
};
