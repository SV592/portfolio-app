import React from "react";
import { ProcessedGitHubContributionsData } from "../../types/github";

// Props for the GithubContributions component
interface GithubContributionsProps {
  data: ProcessedGitHubContributionsData | null;
  loading: boolean;
  error: string | null;
}

const GithubContributions: React.FC<GithubContributionsProps> = ({
  data,
  loading,
  error,
}) => {
  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="flex flex-col min-h-[250px] rounded-3xl shadow-lg p-6 gap-4 w-full colors">
        Fetching GitHub Contributions...
      </div>
    );
  }

  // Show error or empty state if no data is available
  if (error || !data) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 min-h-[180px] flex items-center justify-center text-gray-400">
        {error || `No GitHub contributions found for "${"SV592"}".`}
      </div>
    );
  }

  // Helper function to create a full year's worth of contribution weeks (52 weeks)
  const createContributionGrid = () => {
    const allWeeks = data.weeks;
    const displayWeeks = 52; // Full year

    // Empty week template for missing weeks
    const emptyWeek = {
      contributionDays: Array(7).fill({
        contributionCount: 0,
        color: "#ebedf0",
        date: new Date().toISOString(),
      }),
    };

    // Fill in any missing weeks with empty data
    const filledWeeks = Array(displayWeeks)
      .fill(emptyWeek)
      .map((week, index) => {
        return allWeeks[index] || week;
      });

    return filledWeeks;
  };

  // Array of weeks to display in the grid
  const contributionWeeks = createContributionGrid();

  // Month labels for the top of the grid
  const monthLabels = [
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      {/* Header */}
      <h2 className="text-xl font-bold mb-1">Total Line Of Codes</h2>
      <p className="text-sm text-gray-500 mb-4">
        {data.totalContributions} contributions in the last year
      </p>

      <div className="flex flex-col">
        {/* Month Labels */}
        <div className="flex pl-8 mb-1">
          <div className="grid grid-cols-12 w-full text-[11px] text-gray-400">
            {monthLabels.map((month) => (
              <span key={month} className="text-center">
                {month}
              </span>
            ))}
          </div>
        </div>

        {/* Contribution Grid */}
        <div className="flex">
          {/* Day Labels (Mon, Wed, Fri) */}
          <div className="flex flex-col justify-between text-[11px] text-gray-400 mr-2 h-[72px]">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Contribution Squares */}
          <div className="grid grid-flow-col gap-[2px] w-full">
            {contributionWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.contributionDays.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-[8px] h-[8px] rounded-[1px]"
                    style={{ backgroundColor: day.color }}
                    title={`${
                      day.contributionCount
                    } contributions on ${new Date(
                      day.date
                    ).toLocaleDateString()}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend and Info */}
        <div className="flex justify-between items-center w-full mt-4 text-[11px] text-gray-400">
          <span className="hover:text-gray-600 cursor-pointer">
            Learn how we count contributions
          </span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="flex gap-[2px]">
              {/* Color legend for contribution intensity */}
              <div className="w-[8px] h-[8px] rounded-[1px] bg-[#ebedf0]" />
              <div className="w-[8px] h-[8px] rounded-[1px] bg-[#9be9a8]" />
              <div className="w-[8px] h-[8px] rounded-[1px] bg-[#40c463]" />
              <div className="w-[8px] h-[8px] rounded-[1px] bg-[#30a14e]" />
              <div className="w-[8px] h-[8px] rounded-[1px] bg-[#216e39]" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubContributions;
