"use client";
import React, { useState, useEffect } from "react";
import { easeInOut, motion } from "framer-motion";

import Profile from "./components/Profile/Profile";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Copyright from "./components/Copyright/Copyright";
import Tetris from "./components/Tetris/Tetris";
import Research from "./components/Research/Research";
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
    <div className="flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden">
      {/* Main content container that adapts its grid structure */}
      <div className="w-full grid grid-cols-1 gap-2 2xl:grid-cols-12">
        {/* Left Column - Profile and Skills */}
        <div className="space-y-2 2xl:col-span-3">
          <motion.div
            layout={true}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 } as const}
            className="overflow-hidden will-change-transform"
          >
            <Profile />
          </motion.div>
          <motion.div
            layout={true}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.2 } as const}
            className="overflow-hidden will-change-transform"
          >
            <Skills />
          </motion.div>
          <motion.div
            layout={true}
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 } as const}
            className="overflow-hidden will-change-transform 2xl:flex hidden"
          >
            <Tetris />
          </motion.div>
        </div>

        {/* Right Main Content Area (Education, Experience, Projects, LeetCode, Github, Blog, Research) */}
        <div className="lg:grid-cols-4 2xl:col-span-9 grid 2xl:grid-cols-4 gap-2">
          {/* Education and Experience Column/Stack */}
          <div className="space-y-2 lg:col-span-2">
            <motion.div
              layout={true}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.1 } as const}
              className="overflow-hidden will-change-transform"
            >
              <Education />
            </motion.div>
            <motion.div
              layout={true}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.2 } as const}
              className="overflow-hidden will-change-transform"
            >
              <Experience />
            </motion.div>

            <motion.div
              layout={true}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.3 } as const}
            >
              <Projects />
            </motion.div>
          </div>

          {/* LeetCode, Github, Blog, Research */}
          <div className="space-y-2 lg:col-span-2">
            <motion.div
              layout={true}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.1 } as const}
              className="overflow-hidden will-change-transform"
            >
              <LeetCodeProfileDisplay
                profile={leetCodeProfile}
                loading={leetCodeLoading}
                error={leetCodeError}
              />
            </motion.div>
            <motion.div
              layout={true}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.2 } as const}
              className="overflow-hidden will-change-transform"
            >
              <Github
                data={githubContributions}
                loading={githubLoading}
                error={githubError}
              />
            </motion.div>
            <motion.div
              layout={true}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.3 } as const}
              className="overflow-hidden will-change-transform"
            >
              <Blog
                data={latestBlogPost}
                loading={latestBlogLoading}
                error={latestBlogError}
              />
            </motion.div>
            <motion.div
              layout={true}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.4 } as const}
              className="overflow-hidden will-change-transform"
            >
              <Research />
            </motion.div>
          </div>
        </div>
      </div>
      <Copyright />
    </div>
  );
}
