"use client";

import React from "react";
import InsightsModal from "../shared/InsightsModal";

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  description: string;
  abstract: string;
  pdfUrl: string;
  tags: { name: string; color: string }[];
}

interface ResearchModalProps {
  open: boolean;
  onClose: () => void;
  paper: ResearchPaper;
  layoutId: string;
}

const ResearchModal: React.FC<ResearchModalProps> = ({
  open,
  onClose,
  paper,
  layoutId,
}) => {
  return (
    <InsightsModal
      open={open}
      onClose={onClose}
      title="Research"
      subtitle={paper.title}
      layoutId={layoutId}
    >
      <div className="flex flex-col gap-4">
        {/* Authors + Topics two-column */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Authors</p>
            <p className="text-sm">{paper.authors}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {paper.tags.map((tag) => (
                <span
                  key={tag.name}
                  className={`${tag.color} text-xs font-medium px-2.5 py-0.5 rounded-full`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-gray-200/10" />

        {/* Abstract */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Abstract</p>
          {paper.abstract.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm leading-relaxed">{para}</p>
          ))}
        </div>

        <hr className="border-gray-200/10" />

        {/* PDF */}
        <a
          href={paper.pdfUrl}
          download
          className="more-links inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity self-start"
        >
          Download PDF →
        </a>
      </div>
    </InsightsModal>
  );
};

export default ResearchModal;
