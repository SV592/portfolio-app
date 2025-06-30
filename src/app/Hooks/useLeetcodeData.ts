import { useState, useEffect } from "react";

// LeetCodeProfile type definition
export interface LeetCodeProfileType {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

interface UseLeetCodeDataResult {
  data: LeetCodeProfileType | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch LeetCode user data from the Next.js API route.
 * @param {string} username The LeetCode username to fetch data for.
 * @returns {UseLeetCodeDataResult} An object containing the data, loading state, and any error.
 */
export const useLeetCodeData = (username: string): UseLeetCodeDataResult => {
  const [data, setData] = useState<LeetCodeProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError("Username is required for fetching LeetCode data.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Call YOUR internal Next.js API route (which then proxies to the external API)
        const response = await fetch(`/api/leetcode/${username}`, {
          next: { revalidate: 7200 },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `Failed to fetch LeetCode data for ${username}`
          );
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching LeetCode data.");
        }
        setData(null); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]); // Re-run effect if the username changes

  return { data, loading, error };
};
