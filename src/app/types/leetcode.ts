export interface LeetCodeProfileType {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  beats: number | null;
}

export interface LeetCodeProfileDisplayProps {
  profile: LeetCodeProfileType | null;
  loading: boolean;
  error: string | null;
}
