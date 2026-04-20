"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useActivity } from "@/app/Hooks/useActivity";
import type { ActivityItem, ActivityType } from "@/app/types/activity";

const CYCLE_MS = 5000;

const ICONS: Record<ActivityType, React.ReactNode> = {
  "github-push": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.8-.25.8-.56v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.3-.51-1.48.11-3.08 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.6.24 2.78.12 3.08.73.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.26 5.7.41.35.78 1.04.78 2.1v3.11c0 .31.2.67.81.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  ),
  "github-pr": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M6 3a3 3 0 0 1 1 5.83v6.34A3 3 0 1 1 5 15.17V8.83A3 3 0 0 1 6 3zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM14 3a3 3 0 1 1-1 5.83V15a3 3 0 0 1 3 3 3 3 0 1 1-5 2.24V8.83A3 3 0 0 1 14 3z" />
    </svg>
  ),
  "github-pr-merged": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M6 3a3 3 0 0 1 1 5.83v6.34A3 3 0 1 1 5 15.17V8.83A3 3 0 0 1 6 3zm0 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12-2a3 3 0 1 1-4 2.83A5 5 0 0 1 9 13V9a1 1 0 1 1 2 0v4a3 3 0 0 0 3 3c.35 0 .69-.06 1-.17A3 3 0 0 1 18 15z" />
    </svg>
  ),
  "github-repo": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M5 3h12a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2z" />
    </svg>
  ),
  "github-release": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M21 7l-9 10-5.5-5L8 10l3.9 3.5L19 5z" />
    </svg>
  ),
  "github-fork": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M8 3a3 3 0 1 1-4 2.83V9a3 3 0 0 0 3 3h3v3.17A3 3 0 1 1 9 15h-2a5 5 0 0 1-5-5V5.83A3 3 0 0 1 8 3zm8 0a3 3 0 1 1-1 5.83V10a3 3 0 0 1-3 3v-2a1 1 0 0 0 1-1V8.83A3 3 0 0 1 16 3z" />
    </svg>
  ),
  "github-star": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  ),
  "github-issue": (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm0 11a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
    </svg>
  ),
  leetcode: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.6 12.77l-2.86-2.76-3.89 3.05a2 2 0 0 1-2.6-3l3.43-3.44a3 3 0 0 0-3.58.77L5.45 9.18a1 1 0 0 1-.49.18H2.75a.75.75 0 0 0-.75.75v6.03c0 .41.34.75.75.75h2.09c.22 0 .42.09.56.25l2.34 2.66a1.75 1.75 0 0 0 2.3.32l.68-.47.73.25a1.75 1.75 0 0 0 2.15-.8l.47-.64.32.04a1.75 1.75 0 0 0 1.9-.84l.29-.54a1.75 1.75 0 0 0-.29-2.14l.01.01z" />
    </svg>
  ),
  blog: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M5 3h12a2 2 0 0 1 2 2v16l-4-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 5h10v2H7V8zm0 4h10v2H7v-2zm0 4h6v2H7v-2z" />
    </svg>
  ),
};

const LABEL_COLORS: Record<ActivityType, string> = {
  "github-push": "text-emerald-400",
  "github-pr": "text-sky-400",
  "github-pr-merged": "text-violet-400",
  "github-repo": "text-amber-400",
  "github-release": "text-lime-400",
  "github-fork": "text-cyan-400",
  "github-star": "text-yellow-400",
  "github-issue": "text-rose-400",
  leetcode: "text-orange-400",
  blog: "text-pink-400",
};

const ORB_COLORS: Record<ActivityType, string> = {
  "github-push": "#34d399",
  "github-pr": "#38bdf8",
  "github-pr-merged": "#a78bfa",
  "github-repo": "#fbbf24",
  "github-release": "#a3e635",
  "github-fork": "#22d3ee",
  "github-star": "#facc15",
  "github-issue": "#fb7185",
  leetcode: "#fb923c",
  blog: "#f472b6",
};

const relativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.round(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  const yr = Math.round(mo / 12);
  return `${yr}y ago`;
};

interface TickerRowProps {
  item: ActivityItem;
}

const TickerRow: React.FC<TickerRowProps> = ({ item }) => {
  const body = (
    <>
      <span
        className={`flex-shrink-0 ${LABEL_COLORS[item.type]}`}
        aria-hidden="true"
      >
        {ICONS[item.type]}
      </span>
      <span className="flex-1 min-w-0 truncate">{item.text}</span>
      <span className="flex-shrink-0 text-[10px] text-gray-500 tabular-nums">
        {relativeTime(item.timestamp)}
      </span>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 min-w-0 w-full hover:underline"
      >
        {body}
      </a>
    );
  }
  return <div className="flex items-center gap-3 min-w-0 w-full">{body}</div>;
};

const ActivityTicker: React.FC = () => {
  const { items, loading, error } = useActivity();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [items.length, paused]);

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [items.length, index]);

  if (error && items.length === 0) return null;

  const current = items[index];
  const orbColor = current ? ORB_COLORS[current.type] : "#34d399";

  return (
    <div
      className="w-full rounded-full colors px-4 py-2 text-xs font-medium shadow-sm overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span
          className="relative flex h-2.5 w-2.5 flex-shrink-0 transition-colors duration-500"
          aria-hidden="true"
        >
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 transition-colors duration-500"
            style={{ backgroundColor: orbColor }}
          />
          <span
            className="relative inline-flex rounded-full h-2.5 w-2.5 transition-colors duration-500"
            style={{
              backgroundColor: orbColor,
              boxShadow: `0 0 8px ${orbColor}`,
            }}
          />
        </span>
        <div className="flex-1 min-w-0 h-5 relative">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 flex items-center"
              >
                <TickerRow item={current} />
              </motion.div>
            ) : loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center text-gray-400"
              >
                Loading recent activity…
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ActivityTicker;
