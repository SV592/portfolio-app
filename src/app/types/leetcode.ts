export interface LeetCodeProfileType {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export interface LeetCodeProfileDisplayProps {
  profile: LeetCodeProfileType | null;
  loading: boolean;
  error: string | null;
}
