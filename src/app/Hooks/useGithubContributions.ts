import useSWR from "swr";
import { ProcessedGitHubContributionsData } from "../types/github";

/**
 * Helper function to shift a date string back by one year.
 * Used to align contribution data with the current year.
 */
const adjustDateToCurrentYear = (dateString: string): string => {
  const date = new Date(dateString);
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString();
};

/**
 * Processes the contribution data by shifting all contribution day dates back by one year.
 * @param data The raw contribution data from the API.
 * @returns The processed data with adjusted dates.
 */
const processContributionData = (data: ProcessedGitHubContributionsData) => {
  // Process all weeks and shift dates back by one year
  const processedWeeks = data.weeks.map((week) => ({
    ...week,
    contributionDays: week.contributionDays.map((day) => ({
      ...day,
      date: adjustDateToCurrentYear(day.date),
    })),
  }));

  return {
    ...data,
    weeks: processedWeeks,
  };
};

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

  // Process and adjust the dates
  return processContributionData(data);
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
