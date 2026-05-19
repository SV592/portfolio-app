"use client";

import React from "react";
import Image from "next/image";
import InsightsModal from "../shared/InsightsModal";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C++": "#f34b7d",
};

const STATUS_STYLES: Record<string, string> = {
  Live: "bg-green-100 text-green-700",
  "In Development": "bg-yellow-100 text-yellow-700",
  Archived: "bg-gray-100 text-gray-500",
};

export interface Project {
  id: string;
  title: string;
  image: string;
  alt: string;
  description: string;
  longDescription: string;
  features: string[];
  language: string;
  year: string;
  status: "Live" | "In Development" | "Archived";
  tags: { name: string; color: string }[];
  github?: string;
  live?: string;
}

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
  layoutId: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  onClose,
  project,
  layoutId,
}) => {
  return (
    <InsightsModal
      open={open}
      onClose={onClose}
      title="Project"
      subtitle={project.title}
      layoutId={layoutId}
    >
      <div className="flex flex-col gap-4">
        {/* Screenshot */}
        {project.image && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={project.image}
              alt={project.alt}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, 960px"
              priority
            />
          </div>
        )}

        {/* Status + Year + Language row */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[project.status]}`}>
            {project.status}
          </span>
          <span className="text-xs text-gray-400 font-medium">{project.year}</span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: LANGUAGE_COLORS[project.language] ?? "#9ca3af" }}
            />
            <span className="text-xs text-gray-400 font-medium">{project.language}</span>
          </div>
        </div>

        <hr className="border-gray-200/10" />

        {/* About */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">About</p>
          <p className="text-sm leading-relaxed">{project.longDescription}</p>
        </div>

        <hr className="border-gray-200/10" />

        {/* Key features */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Key Features</p>
          <ul className="flex flex-col gap-1.5">
            {project.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-gray-300 mt-0.5 flex-shrink-0">▸</span>
                {feat}
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-gray-200/10" />

        {/* Tech stack */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag.name}
                className={`${tag.color} text-xs font-medium px-2.5 py-0.5 rounded-full`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-gray-200/10" />

        {/* Links */}
        <div className="flex gap-3 flex-wrap">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="more-links inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
            >
              GitHub →
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="more-links inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Visit →
            </a>
          )}
        </div>
      </div>
    </InsightsModal>
  );
};

export default ProjectModal;
