"use client";

import React from "react";
import { ProcessedGitHubContributionsData } from "@/app/types/github";
import { buildDayMonthHeatmap } from "@/app/lib/insights/heatmap";
import { Tile } from "../shared/Tile";

interface DayMonthHeatmapProps {
  contributions: ProcessedGitHubContributionsData;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

const pickColor = (value: number, max: number): string => {
  if (max === 0 || value === 0) return COLORS[0];
  const ratio = value / max;
  if (ratio < 0.25) return COLORS[1];
  if (ratio < 0.5) return COLORS[2];
  if (ratio < 0.75) return COLORS[3];
  return COLORS[4];
};

const DayMonthHeatmap: React.FC<DayMonthHeatmapProps> = ({ contributions }) => {
  const cells = buildDayMonthHeatmap(contributions);
  const max = cells.reduce((m, c) => (c.avg > m ? c.avg : m), 0);

  return (
    <Tile title="Day-of-week × month" subtitle="Avg daily contributions per cell">
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="flex">
            <div className="w-8" />
            <div className="grid grid-cols-12 gap-1 flex-1">
              {MONTHS.map((m) => (
                <span
                  key={m}
                  className="text-[10px] text-gray-400 text-center"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="flex mt-1">
            <div className="flex flex-col justify-between text-[10px] text-gray-400 w-8 pr-1">
              {DAYS.map((d) => (
                <span key={d} className="h-5 flex items-center">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-rows-7 gap-1 flex-1">
              {DAYS.map((_, wd) => (
                <div key={wd} className="grid grid-cols-12 gap-1">
                  {MONTHS.map((_, mo) => {
                    const cell = cells.find(
                      (c) => c.weekday === wd && c.month === mo
                    );
                    const avg = cell?.avg ?? 0;
                    return (
                      <div
                        key={`${wd}-${mo}`}
                        className="h-5 rounded-sm"
                        style={{ backgroundColor: pickColor(avg, max) }}
                        title={`${DAYS[wd]}, ${MONTHS[mo]}: ${avg.toFixed(
                          1
                        )} avg`}
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

export default DayMonthHeatmap;
