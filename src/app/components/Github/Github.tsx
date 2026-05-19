import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { ProcessedGitHubContributionsData } from "../../types/github";
import GithubInsightsModal from "../Insights/GithubInsightsModal/GithubInsightsModal";

const GITHUB_CARD_LAYOUT_ID = "insights-card-github";

// Props for the GithubContributions component
interface GithubContributionsProps {
  data: ProcessedGitHubContributionsData | null;
  loading: boolean;
  error: string | null;
  username?: string;
}

/**
 * GithubContributions component displays a GitHub-style contributions graph
 * for the past year, with responsive layouts for mobile, tablet, and desktop.
 */
const GithubContributions: React.FC<GithubContributionsProps> = ({
  data,
  loading,
  error,
  username = "SV592",
}) => {
  // State to track the current screen width for responsive rendering
  const [screenWidth, setScreenWidth] = useState(0);
  const [insightsOpen, setInsightsOpen] = useState(false);

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

  // Compute which weeks should show a month label.
  // Skip the very first week (its month started before the slice) and
  // enforce a minimum gap so adjacent labels don't overlap.
  const getMonthLabels = (
    weeks: { contributionDays: { date: string }[] }[],
    minGap: number
  ): string[] => {
    const labels: string[] = [];
    let lastRenderedIndex = -Infinity;
    let lastMonth: string | null = null;
    weeks.forEach((week, i) => {
      const month = new Date(week.contributionDays[0].date).toLocaleString(
        "default",
        { month: "short" }
      );
      const monthChanged = month !== lastMonth;
      lastMonth = month;
      const farEnough = i - lastRenderedIndex >= minGap;
      if (i > 0 && monthChanged && farEnough) {
        labels.push(month);
        lastRenderedIndex = i;
      } else {
        labels.push("");
      }
    });
    return labels;
  };

  return (
    <div className="min-h-[250px]">
      {!insightsOpen && (
        <motion.div
          key="github-card"
          layoutId={GITHUB_CARD_LAYOUT_ID}
          className="bg-white flex flex-col min-h-[250px] colors rounded-3xl p-6"
          whileTap={{ y: -6, rotate: -1.8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          {/* Header */}
      <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
        <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
        Github
      </h2>
      <p className="font-medium text-gray-400 text-sm mb-2">
        {data.totalContributions} contributions in the last year
      </p>

      <div className="flex flex-col text-[11px] font-medium text-gray-400">
        {/* Month Labels */}
        <div className="pl-8 mb-1">
          {showMobile && (
            <div className="flex">
              {getMonthLabels(getLastNWeeks(data.weeks, 17), 3).map(
                (label, weekIndex) => (
                  <span
                    key={weekIndex}
                    className="text-[11px] text-gray-400 w-[10px] text-center flex-1"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          )}

          {showTablet && (
            <div className="flex">
              {getMonthLabels(getLastNWeeks(data.weeks, 35), 3).map(
                (label, weekIndex) => (
                  <span
                    key={weekIndex}
                    className="text-[11px] text-gray-400 w-[9px] text-center flex-1"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          )}

          {showFullYear && (
            <div className="flex">
              {getMonthLabels(getLastNWeeks(data.weeks, 52), 3).map(
                (label, weekIndex) => (
                  <span
                    key={weekIndex}
                    className="text-[11px] text-gray-400 w-[8px] text-center flex-1"
                  >
                    {label}
                  </span>
                )
              )}
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
                        } contributions on ${day.date.split('T')[0]}`}
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
                        } contributions on ${day.date.split('T')[0]}`}
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
                        } contributions on ${day.date.split('T')[0]}`}
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
          {/* Profile link and insights trigger */}
          <div className="flex items-center gap-3">
            <a
              href={`https://github.com/${username}`}
              className="cursor-pointer hidden sm:inline hover:underline"
              target="_blank"
            >
              Profile
            </a>
            <button
              type="button"
              onClick={() => setInsightsOpen(true)}
              className="cursor-pointer hover:underline font-medium"
            >
              View insights →
            </button>
          </div>
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
        </motion.div>
      )}
      <GithubInsightsModal
        open={insightsOpen}
        onClose={() => setInsightsOpen(false)}
        username={username}
        contributions={data}
        layoutId={GITHUB_CARD_LAYOUT_ID}
      />
    </div>
  );
};

export default GithubContributions;
