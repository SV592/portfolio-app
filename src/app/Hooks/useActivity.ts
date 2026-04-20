import useSWR from "swr";
import type { ActivityPayload } from "../types/activity";

const fetcher = async (url: string): Promise<ActivityPayload> => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Failed to fetch activity: ${response.status}`
    );
  }
  return response.json();
};

interface UseActivityResult {
  items: ActivityPayload["items"];
  loading: boolean;
  error: string | null;
}

export const useActivity = (): UseActivityResult => {
  const { data, error, isLoading } = useSWR<ActivityPayload, Error>(
    "/api/activity",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      refreshInterval: 10 * 60 * 1000, // 10 min
    }
  );

  return {
    items: data?.items ?? [],
    loading: isLoading,
    error: error ? error.message : null,
  };
};
