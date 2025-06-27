"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Profile from "./components/Profile/Profile";
import Education from "./components/Education/Education";
import Experience from "./components/Experience/Experience";
import Skills from "./components/Skills/Skills";

export default function Home() {
  // State to control the visibility/animation of skills (original functionality)
  const [skillsVisible, setSkillsVisible] = useState(false);

  useEffect(() => {
    // Trigger skills animation after component mounts
    setSkillsVisible(true);
  }, []);

  // Define common spring transition for a bouncy effect
  const springTransition = {
    type: "spring" as const,
    stiffness: 100, // Controls the stiffness of the spring
    damping: 10, // Controls the oscillation (bounciness)
    duration: 0.5, // Overall duration of the animation
  };

  return (
    <div className="flex items-center min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Main Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">
        {/* Left Column: User Profile & Skills */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
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

        {/* Right Main Content Grid */}
        <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Row 2 & 3: Education, Contests, Job History (left part of main content) and Line of Code, Problem Solved (right part of main content) */}
          <div className="lg:col-span-3 xl:col-span-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side of the inner grid (Education, Contests, Job History) */}
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

            {/* Right side of the inner grid (Line of Code, Problem Solved) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl shadow-lg p-6 h-62 flex items-center justify-center">
                Leetcode
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 h-62 flex items-center justify-center">
                Github
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 h-62 flex items-center justify-center">
                Stackoverflow
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
