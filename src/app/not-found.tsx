"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Unbounded, JetBrains_Mono } from "next/font/google";
import Tetris from "./components/Tetris/Tetris";

const display = Unbounded({
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ANECDOTES = [
  "This page topped out. No garbage lines, just vibes.",
  "The link you followed is an O-piece in a 1-wide gap.",
  "404 in Tetris terms: you went for a Tetris, you got a double.",
  "The URL and the I-piece have something in common — you were waiting for both.",
  "This route has been cleared. Scored zero points. The crowd goes home.",
  "You broke the build. Luckily, nothing important was over here.",
  "The page you're looking for is hiding in the 21st row. There are only 20.",
];

/* ───────── Floating tetromino ───────── */

interface PieceDef {
  d: string;
  color: string;
}

const PIECES: PieceDef[] = [
  { d: "M0 0 H4 V1 H0 Z", color: "#06b6d4" },
  { d: "M0 0 H1 V2 H3 V3 H0 Z", color: "#f59e42" },
  { d: "M0 0 H3 V1 H2 V2 H1 V1 H0 Z", color: "#a21caf" },
  { d: "M1 0 H3 V1 H2 V2 H0 V1 H1 Z", color: "#22d3ee" },
];

interface FloatingPieceProps {
  pieceIdx: number;
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  rotateFrom: number;
  rotateTo: number;
  opacity?: number;
}

const FloatingPiece: React.FC<FloatingPieceProps> = ({
  pieceIdx,
  size,
  top,
  left,
  duration,
  delay,
  rotateFrom,
  rotateTo,
  opacity = 0.18,
}) => {
  const piece = PIECES[pieceIdx % PIECES.length];
  return (
    <motion.div
      aria-hidden="true"
      className="absolute pointer-events-none"
      style={{ top, left, width: size, height: size, opacity }}
      initial={{ rotate: rotateFrom, y: 0 }}
      animate={{ rotate: rotateTo, y: [0, -24, 0] }}
      transition={{
        rotate: { duration, repeat: Infinity, ease: "linear" },
        y: {
          duration: duration / 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
    >
      <svg
        viewBox="0 0 4 4"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <path d={piece.d} fill={piece.color} />
      </svg>
    </motion.div>
  );
};

/* ───────── Integrated theme switch ───────── */

const ThemeSwitch: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "myDarkTheme";

  const btnStyle = (active: boolean): React.CSSProperties => ({
    color: active ? "var(--theme-accent)" : "currentColor",
    opacity: active ? 1 : 0.45,
    fontWeight: active ? 600 : 400,
    transition: "color 150ms ease, opacity 150ms ease",
    cursor: active ? "default" : "pointer",
  });

  return (
    <div
      className="flex items-center gap-2 text-[10px] uppercase"
      style={{ letterSpacing: "0.3em" }}
      role="radiogroup"
      aria-label="Theme"
    >
      <span style={{ opacity: 0.45 }}>theme</span>
      <span style={{ opacity: 0.3 }}>[</span>
      <button
        type="button"
        onClick={() => setTheme("myLightTheme")}
        style={btnStyle(!isDark)}
        role="radio"
        aria-checked={!isDark}
      >
        light
      </button>
      <span style={{ opacity: 0.3 }}>/</span>
      <button
        type="button"
        onClick={() => setTheme("myDarkTheme")}
        style={btnStyle(isDark)}
        role="radio"
        aria-checked={isDark}
      >
        dark
      </button>
      <span style={{ opacity: 0.3 }}>]</span>
    </div>
  );
};

/* ───────── Page ───────── */

export default function NotFound() {
  const pathname = usePathname();

  // Pick the anecdote only on the client so SSR and hydration match.
  const [anecdote, setAnecdote] = useState(ANECDOTES[0]);
  useEffect(() => {
    setAnecdote(
      ANECDOTES[Math.floor(Math.random() * ANECDOTES.length)]
    );
  }, []);

  const digits = "404".split("");

  return (
    <div
      className={`${mono.className} relative min-h-screen overflow-hidden flex flex-col`}
    >
      <style>{`
        @keyframes nf-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .nf-cursor { animation: nf-blink 1.1s steps(1) infinite; }
      `}</style>

      {/* Faint Tetris-grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0.055,
          maskImage:
            "radial-gradient(ellipse at 30% 50%, #000 40%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 30% 50%, #000 40%, transparent 85%)",
        }}
      />

      {/* Ambient floating tetrominoes */}
      <FloatingPiece pieceIdx={0} size={140} top="14%" left="62%" duration={24} delay={0} rotateFrom={0} rotateTo={360} opacity={0.12} />
      <FloatingPiece pieceIdx={2} size={110} top="68%" left="10%" duration={32} delay={1.2} rotateFrom={45} rotateTo={-315} opacity={0.15} />
      <FloatingPiece pieceIdx={3} size={80}  top="82%" left="48%" duration={28} delay={2.4} rotateFrom={0} rotateTo={360} opacity={0.1} />
      <FloatingPiece pieceIdx={1} size={70}  top="26%" left="38%" duration={36} delay={3.6} rotateFrom={0} rotateTo={-360} opacity={0.08} />

      {/* Top status bar — status · theme-switch · sys */}
      <header
        className="relative z-10 flex items-center justify-between gap-4 px-6 lg:px-10 py-4 text-[10px] sm:text-[11px] uppercase tracking-[0.3em]"
        style={{ opacity: 0.85 }}
      >
        <motion.span
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.75, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span
            className="relative flex h-1.5 w-1.5"
            style={{ color: "var(--theme-accent)" }}
          >
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ backgroundColor: "var(--theme-accent)" }}
            />
          </span>
          <span>status · 404 · not_found</span>
        </motion.span>

        <motion.div
          className="flex items-center gap-5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ThemeSwitch />
          <span className="hidden sm:inline" style={{ opacity: 0.5 }}>
            sys · ok
          </span>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_auto] gap-10 lg:gap-16 px-6 lg:px-16 py-6 lg:py-8 items-center">
        {/* LEFT — typographic hero */}
        <div className="flex flex-col gap-6 sm:gap-7 max-w-2xl">
          <motion.div
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.35em]"
            style={{ opacity: 0.55 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span
              className="block h-px w-8"
              style={{ backgroundColor: "currentColor" }}
            />
            <span>event_log — error 404</span>
          </motion.div>

          {/* Giant 404 */}
          <div
            className={`${display.className} relative`}
            style={{
              fontSize: "clamp(110px, 18vw, 220px)",
              lineHeight: 0.82,
              letterSpacing: "-0.045em",
              fontWeight: 900,
            }}
          >
            <div className="flex" aria-label="404">
              {digits.map((d, i) => (
                <motion.span
                  key={i}
                  className="relative inline-block"
                  style={{
                    marginRight: i < digits.length - 1 ? "0.02em" : 0,
                    overflow: "hidden",
                  }}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.15 + i * 0.08,
                  }}
                >
                  <span
                    style={{
                      color:
                        i === 1 ? "var(--theme-accent)" : "currentColor",
                      display: "inline-block",
                    }}
                  >
                    {d}
                  </span>
                </motion.span>
              ))}
            </div>
          </div>

          {/* Tagline with cursor */}
          <motion.div
            className="flex items-baseline gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <span style={{ opacity: 0.4 }}>&gt;</span>
            <h1
              className="text-base sm:text-lg font-semibold uppercase"
              style={{ letterSpacing: "0.14em" }}
            >
              page_not_found
            </h1>
            <span
              className="nf-cursor inline-block"
              style={{
                width: "0.55em",
                height: "1em",
                backgroundColor: "var(--theme-accent)",
                transform: "translateY(0.12em)",
              }}
              aria-hidden="true"
            />
          </motion.div>

          {/* Anecdote */}
          <motion.p
            className="max-w-md text-sm sm:text-base leading-relaxed"
            style={{ opacity: 0.7 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span style={{ opacity: 0.55 }}>{"// "}</span>
            {anecdote}
          </motion.p>

          {/* Actions */}
          <motion.div
            className="flex flex-wrap items-center gap-4 text-xs uppercase mt-1"
            style={{ letterSpacing: "0.14em" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2 px-5 py-3 font-semibold transition-transform hover:-translate-y-0.5"
              style={{
                border: "1px solid currentColor",
                borderRadius: 2,
              }}
            >
              <span
                aria-hidden="true"
                style={{ color: "var(--theme-accent)", fontWeight: 700 }}
              >
                ←
              </span>
              return_to_base
              <span
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "3px 3px 0 0 var(--theme-accent)",
                  borderRadius: 2,
                }}
              />
            </Link>
            <span className="hidden lg:inline" style={{ opacity: 0.55 }}>
              or stall and play{" "}
              <span style={{ color: "var(--theme-accent)" }} aria-hidden="true">
                →
              </span>
            </span>
          </motion.div>

          {/* Meta strip */}
          <motion.dl
            className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-[10px] uppercase mt-6 pt-4"
            style={{
              letterSpacing: "0.2em",
              borderTop: "1px solid currentColor",
              borderTopWidth: "1px",
              opacity: 0.5,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div>
              <dt style={{ opacity: 0.6 }}>attempted_path</dt>
              <dd
                className="truncate"
                style={{ color: "var(--theme-accent)", opacity: 0.95 }}
                title={pathname || "/"}
              >
                {pathname || "/"}
              </dd>
            </div>
            <div>
              <dt style={{ opacity: 0.6 }}>status</dt>
              <dd>not_found</dd>
            </div>
            <div>
              <dt style={{ opacity: 0.6 }}>uptime</dt>
              <dd>nominal</dd>
            </div>
          </motion.dl>
        </div>

        {/* RIGHT — Tetris as a compact terminal window (desktop only) */}
        <motion.div
          className="relative justify-self-center lg:justify-self-end hidden lg:block"
          style={{
            width: "min(42vh, 400px)",
          }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Corner brackets */}
          {([
            ["-top-3 -left-3", "border-t-2 border-l-2"],
            ["-top-3 -right-3", "border-t-2 border-r-2"],
            ["-bottom-3 -left-3", "border-b-2 border-l-2"],
            ["-bottom-3 -right-3", "border-b-2 border-r-2"],
          ] as const).map(([pos, borders], i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`absolute ${pos} w-4 h-4 ${borders}`}
              style={{ borderColor: "var(--theme-accent)" }}
            />
          ))}

          {/* Terminal window */}
          <div
            className="relative rounded-sm p-2.5"
            style={{
              border: "1px solid var(--theme-accent)",
              background:
                "color-mix(in srgb, var(--theme-accent) 4%, transparent)",
              boxShadow: "5px 5px 0 0 var(--theme-accent)",
            }}
          >
            {/* Window chrome */}
            <div
              className="flex items-center justify-between mb-2 text-[9px] uppercase"
              style={{ letterSpacing: "0.25em", opacity: 0.7 }}
            >
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#ff5f56", opacity: 0.85 }}
                />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#ffbd2e", opacity: 0.85 }}
                />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#27c93f", opacity: 0.85 }}
                />
              </div>
              <span>tetris.exe</span>
            </div>

            <Tetris />

            {/* Caption inside frame */}
            <div
              className="mt-2 flex items-center justify-between text-[9px] uppercase"
              style={{ letterSpacing: "0.2em", opacity: 0.55 }}
            >
              <span>side_quest</span>
              <span>← → ↓ · f · d</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom bar */}
      <motion.footer
        className="relative z-10 flex items-center justify-between px-6 lg:px-10 py-4 text-[10px] sm:text-[11px] uppercase tracking-[0.3em]"
        style={{ opacity: 0.45 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <span>shaquille_pearson · portfolio</span>
        <span className="hidden sm:inline">press · esc · to wake up</span>
      </motion.footer>
    </div>
  );
}
