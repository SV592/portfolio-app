import useSWR from "swr";
import { LeetcodeInsightsPayload } from "../types/insights";

const fetcher = async (url: string): Promise<LeetcodeInsightsPayload> => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to fetch insights: ${response.status}`
    );
  }
  return response.json();
};

interface UseLeetcodeInsightsResult {
  data: LeetcodeInsightsPayload | null;
  loading: boolean;
  error: string | null;
}

export const useLeetcodeInsights = (
  username: string,
  enabled: boolean
): UseLeetcodeInsightsResult => {
  const swrKey =
    enabled && username ? `/api/leetcode/${username}/insights` : null;

  const { data, error, isLoading } = useSWR<LeetcodeInsightsPayload, Error>(
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
