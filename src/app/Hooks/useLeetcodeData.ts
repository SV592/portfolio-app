import useSWR from "swr";
import { LeetCodeProfileType } from "../types/leetcode"; // Import LeetCodeType from its current definition

// Make the HTTP request to the internal API route.
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

interface UseLeetCodeDataResult {
  data: LeetCodeProfileType | null;
  loading: boolean;
  error: string | null;
}

/**
 *
 * Calls the internal Next.js API route, which then handles server-side caching.
 * @param {string} username
 * @returns {UseLeetCodeDataResult} Data, loading state, and any errors.
 */
export const useLeetCodeData = (username: string): UseLeetCodeDataResult => {
  // SWR key will be null if no username, preventing fetch
  const swrKey = username ? `/api/leetcode/${username}` : null;

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
