import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LatestBlogPostData } from "../../types/blog";

// Define the props expected by the Blog component
interface BlogProps {
  data: LatestBlogPostData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Blog component to display the latest blog post.
 * Shows a loading skeleton, error state, or the latest post.
 */
export default function Blog({ data, loading, error }: BlogProps) {
  // Show a loading skeleton while fetching data
  if (loading) {
    return (
      <div className="bg-white rounded-lg min-h-[350px] p-6 animate-pulse">
        <h2 className="text-xl font-bold mb-4 bg-gray-200 h-6 w-3/4 rounded"></h2>
        <div className="bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
        <div className="bg-gray-200 h-16 rounded mb-4"></div>
        <div className="bg-gray-300 h-10 w-24 rounded"></div>
      </div>
    );
  }

  // If there's an error or no data, log and render nothing
  if (error || !data) {
    console.error(
      "Could not display latest blog post:",
      error || "No post data received."
    );
    return null;
  }

  // Render the latest blog post
  return (
    <div className="bg-white rounded-3xl min-h-[350px] colors p-6">
      <h2 className="text-xl font-bold mb-4">Blog</h2>
      <div className="items-center">
        {/* Display blog post image if available */}
        {data.imageUrl && (
          <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
            <Link
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:underline font-medium"
            >
              <Image
                src={data.imageUrl}
                alt={data.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {/* Blog post title and date */}
          <Link
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium"
          >
            <h3 className="text-lg font-bold hover:underline">{data.title}</h3>
            <p className="font-medium text-gray-400 text-sm">({data.date})</p>
          </Link>
          {/* Blog post description */}
          <p className="font-medium text-gray-400 text-sm">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}
