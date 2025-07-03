import React from "react";

import { LeetCodeProfileDisplayProps } from "@/app/types/leetcode";

const LeetCodeProfileDisplay: React.FC<LeetCodeProfileDisplayProps> = ({
  profile,
  loading,
  error,
}) => {
  // --- Conditional Rendering ---
  if (loading) {
    return (
      <div className="bg-white rounded-lg min-h-[250px] shadow-md p-6 animate-pulse">
        <h2 className="text-xl font-bold mb-4 bg-gray-200 h-6 w-3/4 rounded"></h2>
        <div className="bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
        <div className="bg-gray-200 h-16 rounded mb-4"></div>
        <div className="bg-gray-300 h-10 w-24 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col rounded-3xl min-h-[250px] h-48 shadow-lg p-6 gap-4 w-full colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 mb-2 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-semibold">Error Loading Profile</p>
        <p className="text-sm">{error}</p> {/* Use the error prop */}
      </div>
    );
  }

  // If no profile data is provided, show a "not found" message.
  if (!profile) {
    return (
      <div className="bg-white rounded-xl shadow-lg min-h-52 p-6 h-48 flex items-center w-full justify-center">
        No LeetCode profile found for &quot;{"SV592"}&quot;.
      </div>
    );
  }

  // --- Calculations for Multi-Colored Circular Progress ---
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 8; // Consistent stroke width

  const { solvedProblem, easySolved, mediumSolved, hardSolved } = profile;

  // Calculate proportions of each difficulty relative to totalSolved
  const easyProportion = solvedProblem > 0 ? easySolved / solvedProblem : 0;
  const mediumProportion = solvedProblem > 0 ? mediumSolved / solvedProblem : 0;
  const hardProportion = solvedProblem > 0 ? hardSolved / solvedProblem : 0;

  // Calculate arc lengths for each segment
  const easyArcLength = easyProportion * circumference;
  const mediumArcLength = mediumProportion * circumference;
  const hardArcLength = hardProportion * circumference;

  // Calculate offsets for drawing segments sequentially on the circle.
  const easyDashOffset = 0; // Easy starts at 0 (top after rotation)
  const mediumDashOffset = -easyArcLength; // Medium starts where Easy ends (clockwise)
  const hardDashOffset = -(easyArcLength + mediumArcLength); // Hard starts where Medium ends (clockwise)

  return (
    <div className="flex flex-col min-h-[251px] rounded-3xl shadow-lg p-6 colors">
      <h2 className="text-left text-xl font-bold mb-1">Leetcode</h2>
      <p className="font-medium text-gray-400 text-sm mb-4">
        {profile.solvedProblem} total algorithmic problems solved
      </p>
      <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
        {/* Left Section: Total Solved Multi-Color Circle */}
        <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle (full gray ring) */}
            <circle
              className="text-gray-200"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />

            {/* Easy Segment */}
            {easySolved > 0 && (
              <circle
                className="text-green-500"
                strokeWidth={strokeWidth}
                strokeDasharray={`${easyArcLength} ${
                  circumference - easyArcLength
                }`}
                strokeDashoffset={easyDashOffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="50"
                cy="50"
              />
            )}

            {/* Medium Segment */}
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

            {/* Hard Segment */}
            {hardSolved > 0 && (
              <circle
                className="text-red-500"
                strokeWidth={strokeWidth}
                strokeDasharray={`${hardArcLength} ${
                  circumference - hardArcLength
                }`}
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

        {/* Right Section: Easy, Medium, Hard progress bars */}
        <div className="flex-1 w-full sm:w-auto space-y-4">
          {/* Easy */}
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Easy</span>
              <span className="text-sm">
                {profile.easySolved ?? "N/A"} / {883}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{
                  width: `${(profile.easySolved / 883) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Medium</span>
              <span className="text-sm">
                {profile.mediumSolved ?? "N/A"} / {1871}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{
                  width: `${(profile.mediumSolved / 1871) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Hard */}
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Hard</span>
              <span className="text-sm">
                {profile.hardSolved ?? "N/A"} / {846}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{
                  width: `${(profile.hardSolved / 846) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[11px] font-medium text-gray-400 mt-2">
        <a
          href="https://leetcode.com/u/SV592/"
          className="cursor-pointer hover:underline"
          target="_blank"
        >
          Profile
        </a>
        <div className="flex gap-2 items-center">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="#2E2B2C"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.6153 12.7724L14.7613 10.014L10.8738 13.0663C9.87738 13.8485 8.45364 13.7632 7.55789 12.8674C6.58224 11.8918 6.58004 10.3106 7.55296 9.33223L10.9792 5.88687C9.86571 5.16585 8.40768 5.26131 7.39716 6.12703L5.44921 7.79585C5.3133 7.91229 5.14023 7.97629 4.96126 7.97629H2.75C2.33579 7.97629 2 8.31207 2 8.72629V14.7558C2 15.17 2.33579 15.5058 2.75 15.5058H4.83766C5.05324 15.5058 5.2584 15.5986 5.40079 15.7604L7.74003 18.4197C8.49372 19.2765 9.76945 19.4335 10.7083 18.7849L11.3925 18.3122L12.1263 18.5611C13.0569 18.8769 14.0847 18.5522 14.665 17.7591L15.135 17.1168L15.4611 17.1608C16.3853 17.2854 17.2905 16.827 17.7371 16.0084L18.0297 15.4702C18.5153 14.58 18.3459 13.4755 17.6153 12.7724Z" />
            <path d="M18.9239 15.9188C19.6048 14.6387 19.3548 13.0591 18.308 12.0511L15.5553 9.39068L15.7076 9.27115C15.9461 9.08387 15.9643 8.72909 15.7463 8.51834C15.5667 8.34476 15.2865 8.33035 15.09 8.4846L14.0355 9.31253L10.2562 12.2797C9.65789 12.7495 8.80291 12.6982 8.26499 12.1603C7.6791 11.5744 7.67778 10.6249 8.26204 10.0374L11.8248 6.45474C13.2178 5.12914 15.3979 5.07081 16.8614 6.3357L18.5483 7.79371C18.6846 7.91148 18.8587 7.97629 19.0388 7.97629H21.25C21.6642 7.97629 22 8.31207 22 8.72629V15.1688C22 15.583 21.6642 15.9188 21.25 15.9188H18.9239Z" />
          </svg>
          <p>Beats 89%</p>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeProfileDisplay;
