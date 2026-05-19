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

export interface Project {
  id: string;
  title: string;
  image: string;
  alt: string;
  description: string;
  features: string[];
  language: string;
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
          <div className="relative w-full h-48 rounded-xl overflow-hidden">
            <Image
              src={project.image}
              alt={project.alt}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 960px"
              priority
            />
          </div>
        )}

        {/* Language + About row */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Language</p>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: LANGUAGE_COLORS[project.language] ?? "#9ca3af" }}
              />
              <span className="text-sm">{project.language}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">About</p>
            <p className="text-sm leading-relaxed">{project.description}</p>
          </div>
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
