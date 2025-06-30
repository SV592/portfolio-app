"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Profile from "./components/Profile/Profile";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";
import Skills from "./components/Skills/Skills";

import LeetCodeProfileDisplay from "./components/Leetcode/Leetcode";

import { useLeetCodeData } from "./Hooks/useLeetcodeData";

export default function Home() {
  // State to control the visibility/animation of skills
  const [, setSkillsVisible] = useState(false);

  // Username input
  const targetLeetCodeUsername = "SV592";

  // Data fetched from leetcode
  const {
    data: leetCodeProfile,
    loading: leetCodeLoading,
    error: leetCodeError,
  } = useLeetCodeData(targetLeetCodeUsername);

  useEffect(() => {
    // Trigger skills animation after component mounts
    setSkillsVisible(true);
  }, []);

  // A string effect
  const springTransition = {
    type: "spring" as const,
    stiffness: 100, // Controls the stiffness of the spring
    damping: 10, // Controls the oscillation (bounciness)
    duration: 0.5, // Overall duration of the animation
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 lg:p-8">
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
                {leetCodeLoading ? (
                  <div className="bg-white rounded-xl shadow-lg p-6 h-48 flex items-center justify-center text-gray-500 font-semibold text-lg animate-pulse border border-gray-200">
                    Fetching LeetCode Data...
                  </div>
                ) : leetCodeError ? (
                  <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl shadow-lg p-6 h-48 flex flex-col items-center justify-center text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mb-2 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="font-semibold">Error Loading Profile</p>
                    <p className="text-sm">{leetCodeError}</p>
                  </div>
                ) : (
                  // Only render LeetCodeProfileDisplay if data is not loading and no error occurred
                  <LeetCodeProfileDisplay
                    profile={leetCodeProfile} // Pass the fetched data
                  />
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.2 } as const}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 h-62 flex items-center justify-center border border-gray-200">
                  Github
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.3 } as const}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 h-62 flex items-center justify-center border border-gray-200">
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
