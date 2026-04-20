import useSWR from "swr";
import { GithubInsightsPayload } from "../types/insights";

const fetcher = async (url: string): Promise<GithubInsightsPayload> => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to fetch insights: ${response.status}`
    );
  }
  return response.json();
};

interface UseGithubInsightsResult {
  data: GithubInsightsPayload | null;
  loading: boolean;
  error: string | null;
}

export const useGithubInsights = (
  username: string,
  enabled: boolean
): UseGithubInsightsResult => {
  const swrKey =
    enabled && username ? `/api/github/${username}/insights` : null;

  const { data, error, isLoading } = useSWR<GithubInsightsPayload, Error>(
    swrKey,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    data: data || null,
    loading: isLoading,
    error: error ? error.message : null,
  };
};
