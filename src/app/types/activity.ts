export type ActivityType =
  | "github-push"
  | "github-pr"
  | "github-pr-merged"
  | "github-repo"
  | "github-release"
  | "github-fork"
  | "github-star"
  | "github-issue"
  | "leetcode"
  | "blog";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  text: string;
  repo?: string;
  href: string | null;
  timestamp: string; // ISO 8601
}

export interface ActivityPayload {
  items: ActivityItem[];
}
