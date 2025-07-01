"use client";
import React, { useState, useEffect } from "react";
import { easeInOut, motion } from "framer-motion";

import Profile from "./components/Profile/Profile";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";
import Skills from "./components/Skills/Skills";
import Github from "./components/Github/Github";

import LeetCodeProfileDisplay from "./components/Leetcode/Leetcode";

import { useLeetCodeData } from "./Hooks/useLeetcodeData";
import { useGithubContributions } from "./Hooks/useGithubContributions";

export default function Home() {
  // State to control the visibility/animation of skills
  const [, setSkillsVisible] = useState(false);

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
    <div className="flex justify-center items-center min-h-screen w-full p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="grid xl:grid-cols-12  gap-6">
        {/* Main Grid Container*/}
        {/* Left Column - Adjusted col-span */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 } as const}
          >
            <Profile />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.2 } as const}
          >
            <Skills />
          </motion.div>
        </div>

        {/* Right Main Content Grid - Adjusted col-span */}
        <div className="lg:col-span-9 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-4 xl:col-span-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left side of the inner grid - Adjusted col-span to lg:col-span-2 */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springTransition, delay: 0.1 } as const}
              >
                <Education />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springTransition, delay: 0.2 } as const}
              >
                <Experience />
              </motion.div>
            </div>

            {/* Right side of the inner grid - Adjusted col-span to lg:col-span-2 (making it wider) */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.1 } as const}
              >
                <LeetCodeProfileDisplay
                  profile={leetCodeProfile} // Pass the fetched data
                  loading={leetCodeLoading}
                  error={leetCodeError}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.2 } as const}
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
              >
                <div className="flex flex-col min-h-[250px] rounded-3xl shadow-lg p-6 gap-4 w-full colors">
                  Stackoverflow
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
