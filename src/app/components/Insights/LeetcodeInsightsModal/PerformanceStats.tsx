"use client";

import React from "react";
import { BeatsStats } from "@/app/types/insights";
import { StatCard, Tile } from "../shared/Tile";

interface PerformanceStatsProps {
  beats: BeatsStats;
  acceptanceRate: number | null;
}

const format = (value: number | null, suffix = "%"): string =>
  value === null ? "—" : `${value.toFixed(1)}${suffix}`;

const PerformanceStats: React.FC<PerformanceStatsProps> = ({
  beats,
  acceptanceRate,
}) => (
  <Tile title="Performance" subtitle="Beats % vs other users">
    <div className="grid grid-cols-2 gap-4">
      <StatCard label="Easy" value={format(beats.easy)} />
      <StatCard label="Medium" value={format(beats.medium)} />
      <StatCard label="Hard" value={format(beats.hard)} />
      <StatCard label="Acceptance" value={format(acceptanceRate)} />
    </div>
  </Tile>
);

export default PerformanceStats;
