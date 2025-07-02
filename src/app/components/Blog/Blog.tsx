"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LatestBlogPostData {
  title: string;
  url: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export default function LatestBlogCard() {
  const [latestPost, setLatestPost] = useState<LatestBlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        // This fetches from your portfolio's internal API route, which in turn fetches from your blog's API.
        const response = await fetch("/api/latest-blog-post");
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.statusText}`);
        }
        const data: LatestBlogPostData = await response.json();
        setLatestPost(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error fetching latest blog post for portfolio:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <h2 className="text-xl font-bold mb-4 bg-gray-200 h-6 w-3/4 rounded"></h2>
        <div className="bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
        <div className="bg-gray-200 h-16 rounded mb-4"></div>
        <div className="bg-gray-300 h-10 w-24 rounded"></div>
      </div>
    );
  }

  if (error || !latestPost) {
    console.error(
      "Could not display latest blog post:",
      error || "No post data received."
    );
    return null;
  }

  return (
    <div className="bg-white rounded-3xl min-h-[350px] colors shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Blog</h2>
      <div className="items-center">
        {latestPost.imageUrl && (
          <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
            <Link
              href={latestPost.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:underline font-medium"
            >
              <Image
                src={latestPost.imageUrl}
                alt={latestPost.title}
                fill
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Link
            href={latestPost.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-medium"
          >
            <h3 className="text-lg font-bold hover:underline">
              {latestPost.title}
            </h3>
            <p className="font-medium text-gray-400 text-sm">
              ({latestPost.date})
            </p>
          </Link>
          <p className="font-medium text-gray-400 text-sm">
            {latestPost.description}
          </p>
        </div>
      </div>
    </div>
  );
}
