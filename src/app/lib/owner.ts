/**
 * The only accounts this site displays. The /api/github/[username] and /api/leetcode/[username]
 * routes reject any other name: otherwise anyone could use them as a proxy (spending this site's
 * GITHUB_TOKEN rate limit and function invocations) just by requesting random usernames.
 */
export const GITHUB_USERNAME = "SV592";
export const LEETCODE_USERNAME = "SV592";

/** Case-insensitive match (GitHub and LeetCode usernames aren't case-sensitive). */
export const isUsername = (requested: string | undefined, allowed: string): boolean =>
  !!requested && requested.toLowerCase() === allowed.toLowerCase();
