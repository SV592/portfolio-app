"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Project } from "../Insights/ProjectModal/ProjectModal";

// Forces Motion's JS animation path: its browser-animation path blinks to opacity 0 for one
// frame when a fade-in finishes (see JS_ANIM in app/card/CardExperience.tsx).
const noop = () => {};

type ProjectTileProps = {
  project: Project;
  onOpen: () => void;
  /** Shows the pulsing green "Live" badge. */
  live?: boolean;
  /** Green ring + glow, used when arriving from the digital card (/card). */
  highlight?: boolean;
};

/** A project card with a shared layoutId so it morphs into its ProjectModal when opened. */
const ProjectTile: React.FC<ProjectTileProps> = ({ project, onOpen, live = false, highlight = false }) => (
  <motion.div
    layoutId={`project-card-${project.id}`}
    onUpdate={noop}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 16 }}
    className={`rounded-xl border p-4 flex flex-col h-full hover:border-gray-400/40 transition-[border-color,box-shadow] duration-700 ${
      highlight
        ? "featured-highlight ring-2 ring-green-500 ring-offset-2 ring-offset-transparent shadow-lg shadow-green-500/20"
        : ""
    }`}
    whileTap={{ y: -6, rotate: -1.8, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 500, damping: 28 }}
  >
    <div className="flex items-center justify-between gap-2 mb-2">
      <h3 className="text-lg font-medium">{project.title}</h3>
      {live && (
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
          </span>
          Live
        </span>
      )}
    </div>
    <p className="text-gray-400 font-medium text-sm mb-3 flex-1">{project.description}</p>
    <div className="flex flex-wrap gap-1 mb-2">
      {project.tags.map((tag) => (
        <span key={tag.name} className={`${tag.color} text-xs font-medium px-2 py-0.5 rounded-full`}>
          {tag.name}
        </span>
      ))}
    </div>
    <button
      type="button"
      onClick={onOpen}
      className="cursor-pointer hover:underline font-medium text-[11px] text-gray-400 text-left"
    >
      View project →
    </button>
  </motion.div>
);

export default ProjectTile;
