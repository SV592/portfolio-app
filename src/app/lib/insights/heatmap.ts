import { ProcessedGitHubContributionsData } from "../../types/github";
import { CommitTimeBucket, DayMonthCell } from "../../types/insights";

export const buildDayMonthHeatmap = (
  data: ProcessedGitHubContributionsData
): DayMonthCell[] => {
  const totals = new Array<number>(7 * 12).fill(0);
  const counts = new Array<number>(7 * 12).fill(0);

  for (const week of data.weeks) {
    for (const day of week.contributionDays) {
      if (!day.date) continue;
      const d = new Date(day.date);
      const wd = d.getUTCDay();
      const mo = d.getUTCMonth();
      const idx = wd * 12 + mo;
      totals[idx] += day.contributionCount;
      counts[idx] += 1;
    }
  }

  const cells: DayMonthCell[] = [];
  for (let wd = 0; wd < 7; wd++) {
    for (let mo = 0; mo < 12; mo++) {
      const idx = wd * 12 + mo;
      const avg = counts[idx] > 0 ? totals[idx] / counts[idx] : 0;
      cells.push({ weekday: wd, month: mo, avg });
    }
  }
  return cells;
};

export const buildTimeOfDayHeatmap = (
  commitDates: string[]
): CommitTimeBucket[] => {
  const counts = new Array<number>(7 * 24).fill(0);
  for (const iso of commitDates) {
    if (!iso) continue;
    const d = new Date(iso);
    const wd = d.getUTCDay();
    const hr = d.getUTCHours();
    counts[wd * 24 + hr] += 1;
  }

  const buckets: CommitTimeBucket[] = [];
  for (let wd = 0; wd < 7; wd++) {
    for (let hr = 0; hr < 24; hr++) {
      buckets.push({ weekday: wd, hour: hr, count: counts[wd * 24 + hr] });
    }
  }
  return buckets;
};
