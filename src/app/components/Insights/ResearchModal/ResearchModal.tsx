"use client";

import React from "react";
import Link from "next/link";
import InsightsModal from "../shared/InsightsModal";
import { Tile } from "../shared/Tile";

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
      <div className="flex flex-col gap-3">
        {/* Authors + Topics metadata row */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 font-medium">{paper.authors}</p>
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

        {/* Abstract */}
        <Tile title="Abstract">
          <div className="flex flex-col gap-3">
            {paper.abstract.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm leading-relaxed">{para}</p>
            ))}
          </div>
        </Tile>

        {/* PDF link */}
        <div className="flex items-center justify-between pt-1">
          <Link
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="more-links inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity"
          >
            View / Download PDF →
          </Link>
        </div>
      </div>
    </InsightsModal>
  );
};

export default ResearchModal;
