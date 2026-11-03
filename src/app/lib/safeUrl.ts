/**
 * Returns the URL only if it is an absolute http(s) URL, otherwise null.
 * Use for links and images that come from external APIs (e.g. the blog), so a bad or compromised
 * response can't inject `javascript:`, `data:` or other unexpected schemes into the page.
 */
export const safeHttpUrl = (value: string | undefined | null): string | null => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
};
