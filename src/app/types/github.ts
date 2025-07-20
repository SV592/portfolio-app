export interface GitHubContributionDay {
  date: string; // YYYY-MM-DD
  contributionCount: number;
  color: string; // Hex color code from GitHub API
}

export interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

export interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
}

export type ProcessedGitHubContributionsData = GitHubContributionCalendar;
