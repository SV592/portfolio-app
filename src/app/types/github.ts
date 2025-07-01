// Represents a single day's contribution data directly from GitHub API
export interface GitHubContributionDay {
  date: string; // YYYY-MM-DD
  contributionCount: number;
  color: string; // Hex color code from GitHub API, e.g., "#ebedf0"
}

// Represents a week of contribution data
export interface GitHubContributionWeek {
  contributionDays: GitHubContributionDay[];
}

// Represents the overall contribution calendar data from GitHub API
export interface GitHubContributionCalendar {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
}

// This is the type that your useGithubContributions hook will return
// and that GithubContributions component will expect.
export type ProcessedGitHubContributionsData = GitHubContributionCalendar;
