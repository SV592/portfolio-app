// Represents the structure of a user's LeetCode profile data
export interface LeetCodeProfileType {
  solvedProblem: number; // Total number of problems solved
  easySolved: number; // Number of easy problems solved
  mediumSolved: number; // Number of medium problems solved
  hardSolved: number; // Number of hard problems solved
}

// Props for the LeetCodeProfileDisplay component
export interface LeetCodeProfileDisplayProps {
  profile: LeetCodeProfileType | null; // The user's LeetCode profile data, or null if not loaded
  loading: boolean; // Indicates if the data is currently loading
  error: string | null; // Error message if fetching data failed, or null if no error
}
