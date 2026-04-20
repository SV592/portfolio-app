"use client";

import React from "react";
import { LeetCodeProfileType } from "@/app/types/leetcode";
import { useLeetcodeInsights } from "@/app/Hooks/useLeetcodeInsights";
import InsightsModal from "../shared/InsightsModal";
import { ErrorTile, SkeletonTile } from "../shared/Tile";
import DifficultySummary from "./DifficultySummary";
import PerformanceStats from "./PerformanceStats";
import TagBreakdown from "./TagBreakdown";

interface LeetcodeInsightsModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
  profile: LeetCodeProfileType | null;
  layoutId?: string;
}

const LeetcodeInsightsModal: React.FC<LeetcodeInsightsModalProps> = ({
  open,
  onClose,
  username,
  profile,
  layoutId,
}) => {
  const { data, loading, error } = useLeetcodeInsights(username, open);

  return (
    <InsightsModal
      open={open}
      onClose={onClose}
      title="LeetCode insights"
      subtitle={`@${username}`}
      layoutId={layoutId}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profile ? (
          <DifficultySummary profile={profile} />
        ) : (
          <SkeletonTile
            title="Difficulty breakdown"
            className="sm:col-span-2"
          />
        )}

        {loading && !data && (
          <>
            <SkeletonTile title="Performance" />
            <SkeletonTile title="Top topics" className="sm:col-span-2" />
          </>
        )}

        {data && (
          <PerformanceStats
            beats={data.beats}
            acceptanceRate={data.acceptanceRate}
          />
        )}

        {data && <TagBreakdown tags={data.tags} />}

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

export default LeetcodeInsightsModal;
