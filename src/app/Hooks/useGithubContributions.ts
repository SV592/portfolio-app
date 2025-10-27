import useSWR from "swr";
import { ProcessedGitHubContributionsData } from "../types/github";


/**
 * Fetcher function for SWR to get GitHub contributions data from the API.
 * Throws an error if the response is not OK or the data format is unexpected.
 * @param url The API endpoint URL.
 * @returns The processed GitHub contributions data.
 */
const fetcher = async (
  url: string
): Promise<ProcessedGitHubContributionsData> => {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.error || `Failed to fetch data: ${response.status}`;
    throw new Error(errorMessage);
  }

  const data: ProcessedGitHubContributionsData = await response.json();

  // Validate the structure of the fetched data
  if (
    typeof data.totalContributions !== "number" ||
    !Array.isArray(data.weeks)
  ) {
    throw new Error("Fetched GitHub data has an unexpected format.");
  }

  // Return data as-is - GitHub already provides correct dates
  return data;
};

/**
 * The return type for the useGithubContributions hook.
 */
interface UseGithubContributionsResult {
  data: ProcessedGitHubContributionsData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook to fetch and provide GitHub contributions data for a given username.
 * Uses SWR for data fetching and caching.
 * @param username The GitHub username to fetch contributions for.
 * @returns An object containing the data, loading state, and error (if any).
 */
export const useGithubContributions = (
  username: string
): UseGithubContributionsResult => {
  // Only fetch if a username is provided
  const swrKey = username ? `/api/github/${username}` : null;

  // Use SWR for data fetching and caching
  const { data, error, isLoading } = useSWR<
    ProcessedGitHubContributionsData,
    Error
  >(swrKey, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error ? error.message : null,
  };
};
