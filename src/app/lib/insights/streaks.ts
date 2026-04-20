import { ProcessedGitHubContributionsData } from "../../types/github";
import { StreakStats } from "../../types/insights";

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const computeStreaks = (
  data: ProcessedGitHubContributionsData
): StreakStats => {
  const days = data.weeks
    .flatMap((w) => w.contributionDays)
    .filter((d) => !!d.date);

  if (days.length === 0) {
    return {
      current: 0,
      longest: 0,
      mostActiveDay: "—",
      mostActiveDayCount: 0,
      avgPerWeek: 0,
      totalThisYear: 0,
    };
  }

  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.contributionCount > 0) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }

  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) current += 1;
    else break;
  }

  const byWeekday = new Array<number>(7).fill(0);
  for (const d of days) {
    const wd = new Date(d.date).getUTCDay();
    byWeekday[wd] += d.contributionCount;
  }
  let bestIdx = 0;
  for (let i = 1; i < 7; i++) {
    if (byWeekday[i] > byWeekday[bestIdx]) bestIdx = i;
  }

  const totalThisYear = data.totalContributions;
  const avgPerWeek =
    data.weeks.length > 0 ? totalThisYear / data.weeks.length : 0;

  return {
    current,
    longest,
    mostActiveDay: WEEKDAY_NAMES[bestIdx],
    mostActiveDayCount: byWeekday[bestIdx],
    avgPerWeek: Math.round(avgPerWeek * 10) / 10,
    totalThisYear,
  };
};
