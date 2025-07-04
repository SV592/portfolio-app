import React, { useState, useEffect } from "react";
import { ProcessedGitHubContributionsData } from "../../types/github";

// Props for the GithubContributions component
interface GithubContributionsProps {
  data: ProcessedGitHubContributionsData | null;
  loading: boolean;
  error: string | null;
}

/**
 * GithubContributions component displays a GitHub-style contributions graph
 * for the past year, with responsive layouts for mobile, tablet, and desktop.
 */
const GithubContributions: React.FC<GithubContributionsProps> = ({
  data,
  loading,
  error,
}) => {
  // State to track the current screen width for responsive rendering
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    // Handler to update screen width on resize
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);
    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 animate-pulse">
        <h2 className="text-xl font-bold mb-4 bg-gray-200 h-6 w-3/4 rounded"></h2>
        <div className="bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
        <div className="bg-gray-200 h-16 rounded mb-4"></div>
        <div className="bg-gray-300 h-10 w-24 rounded"></div>
      </div>
    );
  }

  // Show error or empty state if no data is available
  if (error || !data) {
    return (
      <div className="bg-white rounded-3xl p-6 min-h-[250px] flex items-center justify-center text-gray-400">
        {error || `No GitHub contributions found for "${"SV592"}".`}
      </div>
    );
  }

  /**
   * Helper function to get the last N weeks of contributions.
   * Pads with empty weeks if there are not enough.
   */
  const getLastNWeeks = (
    weeks: {
      contributionDays: {
        contributionCount: number;
        color: string;
        date: string;
      }[];
    }[],
    count: number
  ) => {
    const emptyWeek = {
      contributionDays: Array(7).fill({
        contributionCount: 0,
        color: "#ebedf0",
        date: new Date().toISOString(),
      }),
    };

    // Get the most recent weeks
    const recentWeeks = weeks.slice(-count);

    // Fill to exact count if needed
    while (recentWeeks.length < count) {
      recentWeeks.unshift(emptyWeek);
    }

    return recentWeeks;
  };

  // Determine which layout to show based on screen width
  const showFullYear = screenWidth >= 1680;
  const showTablet = screenWidth >= 768 && screenWidth < 1680;
  const showMobile = screenWidth < 768;

  // Month arrays for different breakpoints
  const monthLabels = {
    mobile: ["Mar", "Apr", "May", "Jun"],
    tablet: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    desktop: [
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
    ],
  };

  return (
    <div className="bg-white flex flex-col min-h-[250px] colors rounded-3xl p-6">
      {/* Header */}
      <h2 className="text-xl font-bold mb-1">Github</h2>
      <p className="font-medium text-gray-400 text-sm mb-2">
        {data.totalContributions} contributions in the last year
      </p>

      <div className="flex flex-col text-[11px] font-medium text-gray-400">
        {/* Month Labels */}
        <div className="pl-8 mb-1">
          {showMobile && (
            <div className="grid grid-cols-4 w-full">
              {monthLabels.mobile.map((month, index) => (
                <span key={index} className="text-center">
                  {month}
                </span>
              ))}
            </div>
          )}
          {showTablet && (
            <div className="grid grid-cols-8 w-full">
              {monthLabels.tablet.map((month, index) => (
                <span key={index} className="text-center">
                  {month}
                </span>
              ))}
            </div>
          )}
          {showFullYear && (
            <div className="grid grid-cols-12 w-full">
              {monthLabels.desktop.map((month, index) => (
                <span key={index} className="text-center">
                  {month}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contribution Grid */}
        <div className="flex">
          {/* Day Labels (Mon, Wed, Fri) - Hide on very small screens */}
          <div className="hidden sm:flex flex-col justify-between font-medium text-[11px] mr-2 h-[72px]">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Mobile: 17 weeks (4 months) */}
          {showMobile && (
            <div className="grid grid-flow-col gap-[2px] w-full">
              {getLastNWeeks(data.weeks, 17).map((week, weekIndex) => (
                // Each week is a column of days
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.contributionDays.map(
                    (
                      day: {
                        contributionCount: number;
                        color: string;
                        date: string;
                      },
                      dayIndex: number
                    ) => (
                      // Each day is a colored square representing contributions
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="w-[10px] h-[10px] rounded-[1px]"
                        style={{ backgroundColor: day.color }}
                        title={`${
                          day.contributionCount
                        } contributions on ${new Date(
                          day.date
                        ).toLocaleDateString()}`}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tablet: 35 weeks (8 months) */}
          {showTablet && (
            <div className="grid grid-flow-col gap-[2px] w-full">
              {getLastNWeeks(data.weeks, 35).map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.contributionDays.map(
                    (
                      day: {
                        contributionCount: number;
                        color: string;
                        date: string;
                      },
                      dayIndex: number
                    ) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="w-[9px] h-[9px] rounded-[1px]"
                        style={{ backgroundColor: day.color }}
                        title={`${
                          day.contributionCount
                        } contributions on ${new Date(
                          day.date
                        ).toLocaleDateString()}`}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Desktop 1680px+: 52 weeks (12 months) */}
          {showFullYear && (
            <div className="grid grid-flow-col gap-[2px] w-full">
              {getLastNWeeks(data.weeks, 52).map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.contributionDays.map(
                    (
                      day: {
                        contributionCount: number;
                        color: string;
                        date: string;
                      },
                      dayIndex: number
                    ) => (
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
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend and Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mt-4 text-[11px] text-gray-400 gap-2 sm:gap-0">
          {/* Link to GitHub profile (hidden on mobile) */}
          <a
            href="https://github.com/SV592"
            className="cursor-pointer hidden sm:inline hover:underline"
            target="_blank"
          >
            Profile
          </a>
          {/* Contribution color legend */}
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="flex gap-[2px]">
              {/* Color legend for contribution intensity */}
              <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-[#ebedf0]" />
              <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-[#9be9a8]" />
              <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-[#40c463]" />
              <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-[#30a14e]" />
              <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[1px] bg-[#216e39]" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubContributions;
