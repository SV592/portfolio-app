"use client";

import React from "react";
import { CommitTimeBucket } from "@/app/types/insights";
import { Tile } from "../shared/Tile";

interface CommitTimeHeatmapProps {
  commitTimes: CommitTimeBucket[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

const pickColor = (value: number, max: number): string => {
  if (max === 0 || value === 0) return COLORS[0];
  const ratio = value / max;
  if (ratio < 0.25) return COLORS[1];
  if (ratio < 0.5) return COLORS[2];
  if (ratio < 0.75) return COLORS[3];
  return COLORS[4];
};

const CommitTimeHeatmap: React.FC<CommitTimeHeatmapProps> = ({
  commitTimes,
}) => {
  const total = commitTimes.reduce((s, b) => s + b.count, 0);
  const max = commitTimes.reduce((m, b) => (b.count > m ? b.count : m), 0);

  if (total === 0) {
    return (
      <Tile title="Commit time-of-day">
        <p className="text-sm text-gray-400">No commit data available.</p>
      </Tile>
    );
  }

  return (
    <Tile
      title="Commit time-of-day"
      subtitle={`${total} commits across Shaquille's top repos (last year, UTC)`}
    >
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="w-8 flex-shrink-0" />
            <div
              className="grid gap-[2px] flex-1"
              style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
            >
              {Array.from({ length: 24 }, (_, h) => (
                <span
                  key={h}
                  className="text-[9px] text-gray-400 text-center"
                  style={{ width: "100%" }}
                >
                  {h % 3 === 0 ? h : ""}
                </span>
              ))}
            </div>
          </div>
          <div className="flex mt-1">
            <div className="flex flex-col justify-between text-[10px] text-gray-400 w-8 pr-1 flex-shrink-0">
              {DAYS.map((d) => (
                <span key={d} className="h-4 flex items-center">
                  {d}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-[2px] flex-1">
              {DAYS.map((_, wd) => (
                <div
                  key={wd}
                  className="grid gap-[2px]"
                  style={{
                    gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
                  }}
                >
                  {Array.from({ length: 24 }, (_, hr) => {
                    const bucket = commitTimes.find(
                      (b) => b.weekday === wd && b.hour === hr
                    );
                    const count = bucket?.count ?? 0;
                    return (
                      <div
                        key={`${wd}-${hr}`}
                        className="h-4 rounded-sm"
                        style={{ backgroundColor: pickColor(count, max) }}
                        title={`${DAYS[wd]} ${hr}:00 UTC — ${count} commits`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Tile>
  );
};

export default CommitTimeHeatmap;
