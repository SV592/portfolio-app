"use client";

import React from "react";

interface DifficultyDonutProps {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  size?: number;
}

const DifficultyDonut: React.FC<DifficultyDonutProps> = ({
  solvedProblem,
  easySolved,
  mediumSolved,
  hardSolved,
  size = 112,
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 8;

  const easyProportion = solvedProblem > 0 ? easySolved / solvedProblem : 0;
  const mediumProportion = solvedProblem > 0 ? mediumSolved / solvedProblem : 0;
  const hardProportion = solvedProblem > 0 ? hardSolved / solvedProblem : 0;

  const easyArcLength = easyProportion * circumference;
  const mediumArcLength = mediumProportion * circumference;
  const hardArcLength = hardProportion * circumference;

  const easyDashOffset = 0;
  const mediumDashOffset = -easyArcLength;
  const hardDashOffset = -(easyArcLength + mediumArcLength);

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {easySolved > 0 && (
          <circle
            className="text-green-500"
            strokeWidth={strokeWidth}
            strokeDasharray={`${easyArcLength} ${circumference - easyArcLength}`}
            strokeDashoffset={easyDashOffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
        )}
        {mediumSolved > 0 && (
          <circle
            className="text-yellow-500"
            strokeWidth={strokeWidth}
            strokeDasharray={`${mediumArcLength} ${
              circumference - mediumArcLength
            }`}
            strokeDashoffset={mediumDashOffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
        )}
        {hardSolved > 0 && (
          <circle
            className="text-red-500"
            strokeWidth={strokeWidth}
            strokeDasharray={`${hardArcLength} ${circumference - hardArcLength}`}
            strokeDashoffset={hardDashOffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold">{solvedProblem}</span>
        <span className="text-sm mt-0.5">Solved</span>
      </div>
    </div>
  );
};

export default DifficultyDonut;
