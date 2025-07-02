"use client";
import React, { useState, useEffect } from "react";
import { easeInOut, motion } from "framer-motion";

import Profile from "./components/Profile/Profile";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";
import Skills from "./components/Skills/Skills";
import Github from "./components/Github/Github";
import Blog from "./components/Blog/Blog";
import LeetCodeProfileDisplay from "./components/Leetcode/Leetcode";

import { useLeetCodeData } from "./Hooks/useLeetcodeData";
import { useGithubContributions } from "./Hooks/useGithubContributions";
import { useLatestBlogPost } from "./Hooks/useLatestBlogPost";

export default function Home() {
  // State to control the visibility/animation of skills (still used by Skills component)
  const [, setSkillsVisible] = useState(false);
  // Removed isLargeScreen state and its useEffect logic - Tailwind will handle responsiveness

  // Username input
  const userName = "SV592";

  // Data fetched from github
  const {
    data: githubContributions,
    loading: githubLoading,
    error: githubError,
  } = useGithubContributions(userName);

  // Data fetched from leetcode
  const {
    data: leetCodeProfile,
    loading: leetCodeLoading,
    error: leetCodeError,
  } = useLeetCodeData(userName);

  //Data fetched from blog
  const {
    data: latestBlogPost,
    loading: latestBlogLoading,
    error: latestBlogError,
  } = useLatestBlogPost();

  useEffect(() => {
    // Trigger skills animation after component mounts
    setSkillsVisible(true);
  }, []);

  // A string effect
  const springTransition = {
    type: "spring" as const,
    stiffness: 100, // Stiffness of the spring
    damping: 10, // Animation
    duration: 0.5, // Animation duration
    easeInOut,
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full h-full p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Main content container that adapts its grid structure */}
      <div className="w-full grid grid-cols-1 gap-6 2xl:grid-cols-12">
        {/* Left Column - Profile and Skills */}
        <div className="space-y-6 2xl:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 } as const}
            style={{ minHeight: `300px` }} // Ensure stable height for animation
          >
            <Profile />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.2 } as const}
            style={{ minHeight: `200px` }} // Ensure stable height for animation
          >
            <Skills />
          </motion.div>
        </div>

        {/* Right Main Content Area (Education, Experience, LeetCode, Github, Blog) */}
        <div className="space-y-6 lg:grid-cols-4 2xl:col-span-9 grid 2xl:grid-cols-4 gap-6">
          {/* Education and Experience Column/Stack */}
          <div className="space-y-6 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.1 } as const}
              style={{ minHeight: `300px` }} // Ensure stable height for animation
            >
              <Education />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.2 } as const}
              style={{ minHeight: `300px` }} // Ensure stable height for animation
            >
              <Experience />
            </motion.div>
          </div>

          {/* LeetCode, Github, Blog Column/Stack */}
          <div className="space-y-6 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.1 } as const}
              style={{ minHeight: `250px` }} // Ensure stable height for animation
            >
              <LeetCodeProfileDisplay
                profile={leetCodeProfile}
                loading={leetCodeLoading}
                error={leetCodeError}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.2 } as const}
              style={{ minHeight: `250px` }} // Ensure stable height for animation
            >
              <Github
                data={githubContributions}
                loading={githubLoading}
                error={githubError}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.3 } as const}
              style={{ minHeight: `350px` }} // Ensure stable height for animation
            >
              <Blog
                data={latestBlogPost}
                loading={latestBlogLoading}
                error={latestBlogError}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
