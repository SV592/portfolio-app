export interface LanguageBreakdown {
  name: string;
  color: string;
  bytes: number;
  percentage: number;
}

export interface CommitTimeBucket {
  weekday: number;
  hour: number;
  count: number;
}

export interface GithubInsightsPayload {
  languages: LanguageBreakdown[] | null;
  commitTimes: CommitTimeBucket[] | null;
  languagesError?: string;
  commitTimesError?: string;
}

export interface StreakStats {
  current: number;
  longest: number;
  mostActiveDay: string;
  mostActiveDayCount: number;
  avgPerWeek: number;
  totalThisYear: number;
}

export interface DayMonthCell {
  weekday: number;
  month: number;
  avg: number;
}

export interface BeatsStats {
  easy: number | null;
  medium: number | null;
  hard: number | null;
}

export interface TagBreakdown {
  name: string;
  solved: number;
}

export interface LeetcodeInsightsPayload {
  beats: BeatsStats;
  acceptanceRate: number | null;
  tags: TagBreakdown[];
}
