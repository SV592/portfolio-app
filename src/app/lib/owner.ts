/**
 * The only accounts this site displays. The /api/github/[username] and /api/leetcode/[username]
 * routes reject any other name: otherwise anyone could use them as a proxy (spending this site's
 * GITHUB_TOKEN rate limit and function invocations) just by requesting random usernames.
 */
export const GITHUB_USERNAME = "SV592";
export const LEETCODE_USERNAME = "SV592";

/**
 * Exact match only. GitHub/LeetCode would accept other casings, but each casing is a separate cache
 * entry and upstream call, so only the canonical spelling (what the site itself requests) is served.
 */
export const isUsername = (requested: string | undefined, allowed: string): boolean => requested === allowed;
