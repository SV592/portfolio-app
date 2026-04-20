"use client";

import React from "react";
import { LeetCodeProfileType } from "@/app/types/leetcode";
import DifficultyDonut from "@/app/components/Leetcode/DifficultyDonut";
import { Tile } from "../shared/Tile";

interface DifficultySummaryProps {
  profile: LeetCodeProfileType;
}

const TOTALS = { easy: 883, medium: 1871, hard: 846 };

const DifficultySummary: React.FC<DifficultySummaryProps> = ({ profile }) => (
  <Tile title="Difficulty breakdown" className="sm:col-span-2">
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <DifficultyDonut
        solvedProblem={profile.solvedProblem}
        easySolved={profile.easySolved}
        mediumSolved={profile.mediumSolved}
        hardSolved={profile.hardSolved}
      />
      <div className="flex-1 w-full space-y-3">
        {(
          [
            ["Easy", profile.easySolved, TOTALS.easy, "bg-green-500"],
            ["Medium", profile.mediumSolved, TOTALS.medium, "bg-yellow-500"],
            ["Hard", profile.hardSolved, TOTALS.hard, "bg-red-500"],
          ] as const
        ).map(([label, solved, total, color]) => (
          <div key={label}>
            <div className="flex justify-between text-xs">
              <span className="font-medium">{label}</span>
              <span>
                {solved} / {total}
              </span>
            </div>
            <div className="w-full bg-gray-200/40 rounded-full h-2 mt-1">
              <div
                className={`${color} h-2 rounded-full`}
                style={{ width: `${(solved / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Tile>
);

export default DifficultySummary;
