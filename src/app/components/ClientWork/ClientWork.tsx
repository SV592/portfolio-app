"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import ProjectModal from "../Insights/ProjectModal/ProjectModal";
import ProjectTile from "../Projects/ProjectTile";
import { featuredProjects, HIGHLIGHT_KEY } from "../../lib/projects/featured";

const CONTACT_EMAIL = "shaquillepearson9@gmail.com";

/** Ghost T-piece for the "NEXT" preview: an empty slot waiting for the next commission. */
const GHOST_CELLS: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1]];

const NextPiecePreview: React.FC = () => (
  <div aria-hidden="true" className="self-center flex flex-col items-center gap-2 rounded-lg border border-gray-400/30 px-5 py-3">
    <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-gray-400">NEXT</span>
    <div className="relative h-[46px] w-[68px] next-piece-float">
      {GHOST_CELLS.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className="absolute h-5 w-5 rounded-[4px] border-2 border-dashed border-gray-400/60"
          style={{ left: x * 23, top: y * 23 }}
        />
      ))}
    </div>
  </div>
);

/**
 * Commissioned client projects, live in production. Full-width section at the bottom of the
 * homepage: two project tiles plus an open slot inviting the next commission.
 */
const ClientWork: React.FC<{ className?: string }> = ({ className }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Arriving from the digital business card (/card): scroll here and spotlight the live projects.
  // The flag is consumed once; the timers live in a separate effect so a re-run can't lose them.
  useEffect(() => {
    if (sessionStorage.getItem(HIGHLIGHT_KEY) !== "1") return;
    sessionStorage.removeItem(HIGHLIGHT_KEY);
    setHighlight(true);
  }, []);

  useEffect(() => {
    if (!highlight) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollTimer = setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    }, 600); // let the page's entrance animation settle first
    const clearTimer = setTimeout(() => setHighlight(false), 6000);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(clearTimer);
    };
  }, [highlight]);

  return (
    <section
      id="client-work"
      ref={sectionRef}
      aria-labelledby="client-work-h"
      className={`bg-white rounded-3xl colors shadow-lg p-6 scroll-mt-4${className ? ` ${className}` : ""}`}
    >
      <h2 id="client-work-h" className="text-xl font-bold mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />
        Client Work
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {featuredProjects.map((project) =>
            openId === project.id ? null : (
              <ProjectTile
                key={project.id}
                project={project}
                live
                highlight={highlight}
                onOpen={() => setOpenId(project.id)}
              />
            )
          )}
        </AnimatePresence>

        {/* The open slot: fills the rest of the row until there's more to show. */}
        <div className="md:col-span-2 rounded-xl border-2 border-dashed border-gray-400/40 p-5 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <span className="font-mono text-xs text-gray-400">
              {"// queue: "}
              <span className="text-green-600">2 shipped</span>
              {" · 1 slot open"}
              <span className="ml-0.5 inline-block w-[0.55em] h-[1.1em] align-text-bottom bg-gray-400/70 next-piece-cursor" />
            </span>
            <h3 className="text-lg font-bold leading-snug">Your project could be next.</h3>
            <p className="text-gray-400 font-medium text-sm">
              More client work is in the build pipeline. I&apos;m open to commissions and collaborations.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project enquiry")}`}
              className="more-links mt-1 self-start rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start a conversation →
            </a>
          </div>
          <NextPiecePreview />
        </div>
      </div>

      {featuredProjects.map((project) => (
        <ProjectModal
          key={project.id}
          open={openId === project.id}
          onClose={() => setOpenId(null)}
          project={project}
          layoutId={`project-card-${project.id}`}
        />
      ))}
    </section>
  );
};

export default ClientWork;
