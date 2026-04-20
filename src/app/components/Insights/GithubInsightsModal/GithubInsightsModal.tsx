"use client";

import React from "react";
import { ProcessedGitHubContributionsData } from "@/app/types/github";
import { useGithubInsights } from "@/app/Hooks/useGithubInsights";
import InsightsModal from "../shared/InsightsModal";
import { ErrorTile, SkeletonTile } from "../shared/Tile";
import StreakStats from "./StreakStats";
import LanguageDonut from "./LanguageDonut";
import DayMonthHeatmap from "./DayMonthHeatmap";
import CommitTimeHeatmap from "./CommitTimeHeatmap";

interface GithubInsightsModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
  contributions: ProcessedGitHubContributionsData | null;
  layoutId?: string;
}

const GithubInsightsModal: React.FC<GithubInsightsModalProps> = ({
  open,
  onClose,
  username,
  contributions,
  layoutId,
}) => {
  const { data, loading, error } = useGithubInsights(username);

  return (
    <InsightsModal
      open={open}
      onClose={onClose}
      title="GitHub insights"
      subtitle={`@${username}`}
      layoutId={layoutId}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contributions ? (
          <StreakStats contributions={contributions} />
        ) : (
          <SkeletonTile
            title="Activity overview"
            className="sm:col-span-2"
          />
        )}

        {loading && !data && (
          <>
            <SkeletonTile title="Language breakdown" />
            <SkeletonTile title="Commit time-of-day" />
          </>
        )}

        {data?.languages && <LanguageDonut languages={data.languages} />}
        {data?.languagesError && (
          <ErrorTile
            title="Language breakdown"
            message={data.languagesError}
          />
        )}

        {contributions && (
          <DayMonthHeatmap contributions={contributions} />
        )}

        {data?.commitTimes && (
          <CommitTimeHeatmap commitTimes={data.commitTimes} />
        )}
        {data?.commitTimesError && (
          <ErrorTile
            title="Commit time-of-day"
            message={data.commitTimesError}
          />
        )}

        {error && !data && (
          <ErrorTile
            title="Insights"
            message={error}
            className="sm:col-span-2"
          />
        )}
      </div>
    </InsightsModal>
  );
};

export default GithubInsightsModal;
