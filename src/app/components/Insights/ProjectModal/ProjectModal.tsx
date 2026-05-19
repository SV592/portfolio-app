"use client";

import React from "react";
import InsightsModal from "../shared/InsightsModal";

export interface Project {
  id: string;
  title: string;
  image: string;
  alt: string;
  description: string;
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
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">About</p>
          <p className="text-sm leading-relaxed">{project.description}</p>
        </div>

        <hr className="border-gray-200/10" />

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
