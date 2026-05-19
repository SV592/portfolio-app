"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import ProjectModal, { Project } from "../Insights/ProjectModal/ProjectModal";

const projects: Project[] = [
  {
    id: "p1",
    title: "Blog App",
    image: "/images/blog.png",
    alt: "Screenshot of Blog Website",
    description:
      "A full-stack blog built with Next.js, featuring static and dynamic page serving. Integrates Spotify API via a custom backend and uses PostgreSQL for newsletter subscriber storage.",
    tags: [
      { name: "Next.js", color: "bg-blue-50 text-blue-700" },
      { name: "TypeScript", color: "bg-green-50 text-green-700" },
      { name: "Tailwind CSS", color: "bg-purple-50 text-purple-700" },
      { name: "React", color: "bg-yellow-50 text-yellow-700" },
      { name: "Spotify API", color: "bg-red-50 text-red-700" },
      { name: "PostgreSQL", color: "bg-indigo-50 text-indigo-700" },
    ],
    github: "https://github.com/SV592/blog-app",
    live: "https://theprogrammersgazette.vercel.app/",
  },
  {
    id: "p2",
    title: "Portfolio App",
    image: "/images/portfolio.png",
    alt: "Screenshot of Portfolio App",
    description:
      "This portfolio, built with Next.js App Router, integrates live data from GitHub, LeetCode, and a custom blog API via SWR. Features framer-motion shared-element animations and a fully responsive layout.",
    tags: [
      { name: "Next.js", color: "bg-blue-50 text-blue-700" },
      { name: "TypeScript", color: "bg-green-50 text-green-700" },
      { name: "Tailwind CSS", color: "bg-purple-50 text-purple-700" },
      { name: "Framer Motion", color: "bg-yellow-50 text-yellow-700" },
      { name: "SWR", color: "bg-red-50 text-red-700" },
      { name: "APIs", color: "bg-indigo-50 text-indigo-700" },
    ],
    github: "https://github.com/SV592/portfolio-app",
  },
  {
    id: "p3",
    title: "AI Pitch Deck Generator",
    image: "",
    alt: "",
    description:
      "An AI-powered pitch deck generator that transforms a prompt into a structured, professional slide deck. Built with a Next.js frontend and a NestJS REST API backend.",
    tags: [
      { name: "Next.js", color: "bg-blue-50 text-blue-700" },
      { name: "TypeScript", color: "bg-green-50 text-green-700" },
      { name: "NestJS", color: "bg-red-50 text-red-700" },
      { name: "AI/LLM", color: "bg-purple-50 text-purple-700" },
      { name: "REST API", color: "bg-yellow-50 text-yellow-700" },
    ],
    github: "https://github.com/SV592/pitch_deck",
  },
  {
    id: "p4",
    title: "IP Locator",
    image: "",
    alt: "",
    description:
      "An IP address lookup tool featuring a 3D interactive globe visualization powered by Three.js. Pinpoints the physical location of any IP address with smooth animations and a few easter eggs.",
    tags: [
      { name: "Next.js", color: "bg-blue-50 text-blue-700" },
      { name: "TypeScript", color: "bg-green-50 text-green-700" },
      { name: "Three.js", color: "bg-purple-50 text-purple-700" },
      { name: "IP API", color: "bg-yellow-50 text-yellow-700" },
      { name: "3D", color: "bg-red-50 text-red-700" },
    ],
    github: "https://github.com/SV592/ip_locator",
  },
  {
    id: "p5",
    title: "Secure File Manager",
    image: "",
    alt: "",
    description:
      "A cryptographic file operations tool with both a C++ CLI and an Electron desktop GUI. Supports AES-256-CBC encryption, SHA-256 hashing, and RSA digital signatures, wrapped in a cyberpunk-themed interface.",
    tags: [
      { name: "C++", color: "bg-blue-50 text-blue-700" },
      { name: "OpenSSL", color: "bg-green-50 text-green-700" },
      { name: "Electron", color: "bg-purple-50 text-purple-700" },
      { name: "Cryptography", color: "bg-yellow-50 text-yellow-700" },
      { name: "CLI", color: "bg-red-50 text-red-700" },
      { name: "GUI", color: "bg-indigo-50 text-indigo-700" },
    ],
    github: "https://github.com/SV592/secure_file_manager",
  },
  {
    id: "p6",
    title: "GitHub Repo ETL Pipeline",
    image: "",
    alt: "",
    description:
      "An Extract, Transform, Load (ETL) pipeline built with Python to collect metadata about open-source GitHub repositories via the GraphQL API, transform it, and load it into a PostgreSQL database for analysis.",
    tags: [
      { name: "Python", color: "bg-blue-50 text-blue-700" },
      { name: "GitHub API", color: "bg-gray-50 text-gray-700" },
      { name: "GraphQL", color: "bg-purple-50 text-purple-700" },
      { name: "PostgreSQL", color: "bg-indigo-50 text-indigo-700" },
      { name: "ETL", color: "bg-green-50 text-green-700" },
    ],
    github: "https://github.com/SV592/repo_pipeline",
  },
  {
    id: "p7",
    title: "Flashcard App",
    image: "",
    alt: "",
    description:
      "A cross-platform mobile flashcard app built with React Native. Users can create, edit, and delete flashcard decks with local AsyncStorage persistence and local notification support in production builds.",
    tags: [
      { name: "React Native", color: "bg-blue-50 text-blue-700" },
      { name: "JavaScript", color: "bg-yellow-50 text-yellow-700" },
      { name: "AsyncStorage", color: "bg-green-50 text-green-700" },
      { name: "Mobile", color: "bg-purple-50 text-purple-700" },
      { name: "Expo", color: "bg-red-50 text-red-700" },
    ],
    github: "https://github.com/SV592/Flashcard-App-",
  },
];

const Projects: React.FC<{ className?: string }> = ({ className }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={`bg-white rounded-3xl colors shadow-lg p-6${className ? ` ${className}` : ""}`}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faFolderOpen} className="w-4 h-4" />
        Personal Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) =>
            openId === project.id ? null : (
              <motion.div
                key={project.id}
                layoutId={`project-card-${project.id}`}
                className="rounded-xl border p-4 flex flex-col h-full hover:border-gray-400/40 transition-colors"
                whileTap={{ y: -6, rotate: -1.8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                {project.image && (
                  <div className="relative w-full h-40 rounded-lg mb-4 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                )}
                <h3 className="text-lg font-medium mb-2">{project.title}</h3>
                <p className="text-gray-400 font-medium text-sm mb-3 flex-grow">
                  {project.description}
                </p>
                <div className="flex flex-wrap items-center gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className={`${tag.color} text-xs font-medium px-2 py-0.5 rounded-full`}
                    >
                      {tag.name}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setOpenId(project.id)}
                    className="ml-auto cursor-pointer hover:underline font-medium text-[11px] text-gray-400"
                  >
                    View project →
                  </button>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
      {projects.map((project) => (
        <ProjectModal
          key={project.id}
          open={openId === project.id}
          onClose={() => setOpenId(null)}
          project={project}
          layoutId={`project-card-${project.id}`}
        />
      ))}
    </div>
  );
};

export default Projects;
