"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import ProjectModal, { Project } from "../Insights/ProjectModal/ProjectModal";

const projects: Project[] = [
  {
    id: "p1",
    title: "Blog App",
    image: "/images/blog.png",
    alt: "Screenshot of Blog Website",
    description:
      "A full-stack blog built with Next.js featuring static and dynamic page serving, Spotify API integration, and PostgreSQL for newsletter storage.",
    longDescription:
      "A full-stack blog platform built with Next.js 14 App Router, combining ISR for high-traffic posts with dynamic rendering for real-time features. The backend integrates with Spotify's OAuth API to display currently playing tracks, with server-side token management to avoid exposing credentials. A PostgreSQL database stores newsletter subscriber emails with a custom API endpoint for subscriptions.",
    language: "TypeScript",
    year: "2024",
    status: "Live",
    features: [
      "Spotify API with server-side OAuth token caching",
      "PostgreSQL newsletter subscriber storage",
      "Static + dynamic ISR page serving",
    ],
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
      "This portfolio, built with Next.js App Router, integrates live GitHub, LeetCode, and blog data via SWR with framer-motion shared-element animations.",
    longDescription:
      "This portfolio is built with Next.js 15 App Router and React 19, using SWR for client-side data fetching with intelligent caching. The GitHub integration uses GraphQL to pull contribution data, LeetCode data comes from a custom API proxy, and framer-motion powers shared-element card-to-modal transitions. The layout adapts from mobile to a 3-column desktop view at 1700px+ with custom DaisyUI theming.",
    language: "TypeScript",
    year: "2025",
    status: "Live",
    features: [
      "SWR data fetching with 2-hour API cache",
      "Framer-motion shared-element card-to-modal animations",
      "GitHub GraphQL + LeetCode API integration",
    ],
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
    image: "/images/pitch-deck.png",
    alt: "Screenshot of AI Pitch Deck Generator",
    description:
      "An AI-powered pitch deck generator that transforms a prompt into a structured slide deck, built with Next.js and a NestJS REST API.",
    longDescription:
      "A full-stack AI tool with a Next.js frontend and a NestJS REST API backend. The backend sends structured prompts to an LLM, parses the response into a typed JSON schema, and the frontend renders it as a formatted slide deck. Users can input a product or idea description and receive a complete, structured pitch deck in seconds.",
    language: "TypeScript",
    year: "2024",
    status: "Archived",
    features: [
      "LLM-powered slide structure generation from a single prompt",
      "NestJS REST API with typed JSON schema validation",
      "Structured JSON → rendered slide output",
    ],
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
    image: "/images/ip-locator.png",
    alt: "Screenshot of IP Locator App",
    description:
      "An IP address lookup tool with a 3D interactive globe visualization powered by Three.js, with smooth animations and a few easter eggs.",
    longDescription:
      "An IP lookup tool that renders a 3D globe in the browser using Three.js WebGL. When a user enters an IP address, the globe camera animates to the corresponding latitude/longitude returned by a geolocation API. The project also hides several interactive easter eggs triggered by specific IP inputs.",
    language: "TypeScript",
    year: "2024",
    status: "Live",
    features: [
      "3D globe rendered with Three.js WebGL",
      "Animated camera fly-to on IP geolocation lookup",
      "Hidden easter eggs triggered by specific inputs",
    ],
    tags: [
      { name: "Next.js", color: "bg-blue-50 text-blue-700" },
      { name: "TypeScript", color: "bg-green-50 text-green-700" },
      { name: "Three.js", color: "bg-purple-50 text-purple-700" },
      { name: "IP API", color: "bg-yellow-50 text-yellow-700" },
      { name: "3D", color: "bg-red-50 text-red-700" },
    ],
    github: "https://github.com/SV592/ip_locator",
    live: "https://ip-locator-omega.vercel.app",
  },
  {
    id: "p5",
    title: "Secure File Manager",
    image: "",
    alt: "",
    description:
      "A C++ file encryption tool using AES-256-CBC and RSA digital signatures, with an Electron GUI and a headless CLI for secure file management.",
    longDescription:
      "A cross-platform secure file manager built in C++ using OpenSSL for cryptography. Files are encrypted with AES-256-CBC and signed with RSA to guarantee authenticity. SHA-256 hashes verify file integrity before decryption. The project ships with both an Electron-based GUI for everyday use and a headless CLI for scripting and automation.",
    language: "C++",
    year: "2024",
    status: "Archived",
    features: [
      "AES-256-CBC encryption + RSA digital signatures",
      "SHA-256 file integrity hashing pre-decryption",
      "Electron GUI + headless CLI interface",
    ],
    tags: [
      { name: "C++", color: "bg-blue-50 text-blue-700" },
      { name: "OpenSSL", color: "bg-red-50 text-red-700" },
      { name: "Electron", color: "bg-green-50 text-green-700" },
      { name: "Cryptography", color: "bg-purple-50 text-purple-700" },
      { name: "CLI", color: "bg-yellow-50 text-yellow-700" },
    ],
    github: "https://github.com/SV592/secure-file-manager",
  },
  {
    id: "p6",
    title: "GitHub Repo ETL Pipeline",
    image: "",
    alt: "",
    description:
      "A Python ETL pipeline that extracts GitHub repository metadata via GraphQL, transforms it, and loads it into a PostgreSQL database for analysis.",
    longDescription:
      "A Python ETL pipeline that extracts repository metadata from GitHub's GraphQL API — stars, language, topics, contributors — transforms it into a normalized schema, and loads it into a PostgreSQL database. Built to support empirical software engineering research on open-source project characteristics at scale.",
    language: "Python",
    year: "2024",
    status: "Archived",
    features: [
      "GitHub GraphQL API with cursor-based pagination",
      "Automated schema validation and data normalization",
      "PostgreSQL storage with a flexible normalized schema",
    ],
    tags: [
      { name: "Python", color: "bg-blue-50 text-blue-700" },
      { name: "GitHub API", color: "bg-gray-50 text-gray-700" },
      { name: "GraphQL", color: "bg-purple-50 text-purple-700" },
      { name: "PostgreSQL", color: "bg-indigo-50 text-indigo-700" },
      { name: "ETL", color: "bg-green-50 text-green-700" },
    ],
    github: "https://github.com/SV592/repo_pipeline",
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
          {projects.map((project) =>
            openId === project.id ? null : (
              <motion.div
                key={project.id}
                layoutId={`project-card-${project.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="rounded-xl border p-4 flex flex-col h-full hover:border-gray-400/40 transition-colors"
                whileTap={{ y: -6, rotate: -1.8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                <h3 className="text-lg font-medium mb-2">{project.title}</h3>
                <p className="text-gray-400 font-medium text-sm mb-3 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className={`${tag.color} text-xs font-medium px-2 py-0.5 rounded-full`}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(project.id)}
                  className="cursor-pointer hover:underline font-medium text-[11px] text-gray-400 text-left"
                >
                  View project →
                </button>
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
