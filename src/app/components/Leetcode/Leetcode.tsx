import React from "react";

//LeetCode profile data this component expects.
export interface LeetCodeProfileType {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

interface LeetCodeProfileDisplayProps {
  profile: LeetCodeProfileType | null;
  loading: boolean;
  error: string | null;
}

const LeetCodeProfileDisplay: React.FC<LeetCodeProfileDisplayProps> = ({
  profile,
  loading,
  error,
}) => {
  // --- Conditional Rendering ---
  if (loading) {
    return (
      <div className="flex flex-col h-48 min-h-[250px] rounded-3xl shadow-lg p-6 gap-4 w-full colors">
        Fetching LeetCode Data...
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
    <div className="flex flex-col min-h-[251px] rounded-3xl shadow-lg p-6 gap-4 w-full colors">
      <h2 className="text-left text-xl font-bold">Leetcode (SV592)</h2>

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
            <div className="flex justify-between items-center mb-1">
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
            <div className="flex justify-between items-center mb-1">
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
            <div className="flex justify-between items-center mb-1">
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
    </div>
  );
};

export default LeetCodeProfileDisplay;
