import useSWR from "swr";
import { LeetCodeProfileType } from "../types/leetcode";

/**
 * Fetcher function for SWR to get LeetCode profile data from the API.
 * Throws an error if the response is not OK.
 * @param url The API endpoint URL.
 * @returns The LeetCode profile data.
 */
const fetcher = async (url: string): Promise<LeetCodeProfileType> => {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.error || `Failed to fetch data: ${response.status}`;
    // SWR's error handling
    throw new Error(errorMessage);
  }

  const data: LeetCodeProfileType = await response.json();

  return data;
};

/**
 * The return type for the useLeetCodeData hook.
 */
interface UseLeetCodeDataResult {
  data: LeetCodeProfileType | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook to fetch and provide LeetCode profile data for a given username.
 * Calls the internal Next.js API route, which then handles server-side caching.
 * @param {string} username The LeetCode username to fetch data for.
 * @returns {UseLeetCodeDataResult} Data, loading state, and any errors.
 */
export const useLeetCodeData = (username: string): UseLeetCodeDataResult => {
  // SWR key will be null if no username, preventing fetch
  const swrKey = username ? `/api/leetcode/${username}` : null;

  // Use SWR for data fetching and caching
  const { data, error, isLoading } = useSWR<LeetCodeProfileType, Error>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false, // Prevents re-fetching on window focus if you don't need it
      revalidateIfStale: true, // Re-fetches in background if data is stale
    }
  );

  return {
    data: data || null, // Ensure data is null if undefined
    loading: isLoading,
    error: error ? error.message : null, // Extract error message
  };
};
