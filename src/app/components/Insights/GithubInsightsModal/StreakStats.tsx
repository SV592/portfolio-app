"use client";

import React from "react";
import { ProcessedGitHubContributionsData } from "@/app/types/github";
import { computeStreaks } from "@/app/lib/insights/streaks";
import { StatCard, Tile } from "../shared/Tile";

interface StreakStatsProps {
  contributions: ProcessedGitHubContributionsData;
}

const StreakStats: React.FC<StreakStatsProps> = ({ contributions }) => {
  const stats = computeStreaks(contributions);

  return (
    <Tile title="Activity overview" className="sm:col-span-2">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard
          label="Total (1y)"
          value={stats.totalThisYear.toLocaleString()}
        />
        <StatCard
          label="Current streak"
          value={stats.current}
          hint={stats.current === 1 ? "day" : "days"}
        />
        <StatCard
          label="Longest streak"
          value={stats.longest}
          hint={stats.longest === 1 ? "day" : "days"}
        />
        <StatCard
          label="Avg / week"
          value={stats.avgPerWeek}
        />
        <StatCard
          label="Most active"
          value={stats.mostActiveDay}
          hint={`${stats.mostActiveDayCount} contribs`}
        />
      </div>
    </Tile>
  );
};

export default StreakStats;
