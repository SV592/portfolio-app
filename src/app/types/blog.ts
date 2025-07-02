export interface LatestBlogPostData {
  title: string;
  url: string;
  date: string; // Consider using a more specific date type if parsing is needed
  description: string;
  imageUrl?: string; // Optional image URL
}
