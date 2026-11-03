"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faAddressCard,
  faArrowRight,
  faArrowUpFromBracket,
  faArrowUpRightFromSquare,
  faCheck,
  faChevronRight,
  faEnvelope,
  faFileArrowDown,
  faHand,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { CardBackAbout, CardBackQr, CardFront, LivePiece, Terminal, buildScript, type ScriptLine } from "./CardArt";
import { CARD_URL, contact } from "../lib/card/contact";
import { featuredProjects, HIGHLIGHT_KEY, VIA_CARD_KEY } from "../lib/projects/featured";
import { useLatestBlogPost } from "../Hooks/useLatestBlogPost";
import { safeHttpUrl } from "../lib/safeUrl";

type Qr = { size: number; path: string };
type Props = {
  qr: Qr;
  to: string | null;
  from: string | null;
  /** Present mode (/card?qr): you're holding up your screen, so skip the intro and open on the QR. */
  present: boolean;
};

/** Optional usage stats per featured project. The line is omitted when a project has none. */
const PROJECT_STATS: Record<string, { value: string; label: string } | undefined> = {
  // go2fete: { value: "12,000+", label: "tickets sold to date" },
  // cruizegnd: { value: "500+", label: "rentals booked" },
};

const RESUME_URL = "/assets/Shaquille_Pearson_Resume.pdf";

// ---------- Motion presets (from the Card Spec) ----------
const CARD_SPRINGS: Record<"spin" | "auto" | "tap", Transition> = {
  spin: { type: "spring", stiffness: 120, damping: 14, mass: 1 },
  auto: { type: "spring", stiffness: 140, damping: 18 },
  tap: { type: "spring", stiffness: 260, damping: 24 },
};
const PRESS = { type: "spring", stiffness: 500, damping: 28 } as const;
const HIDDEN_CARD = { rotateY: -200, rotateX: 18, y: 48, scale: 0.72, opacity: 0 };

const TYPE_START = 250; // ms before the first keystroke
const TYPE_CHAR = 26; // ms per command character
const TYPE_ENTER = 110; // pause after a command
const TYPE_OUTPUT = 210; // hold after each output line

const panel: React.CSSProperties = { background: "var(--panel)", boxShadow: "var(--shadow)" };

/**
 * Motion hands opacity animations to the browser's Web Animations API and, when one finishes,
 * cancels it a frame before it writes the final inline style. The stale `opacity: 0` from the
 * initial render shows for that frame: a visible blink at the end of every fade-in. Motion's
 * own escape hatch is an `onUpdate` prop, which forces the JS animation path (inline styles
 * written every frame). Spread this on any element that fades opacity.
 */
const JS_ANIM = { onUpdate: () => {} };

/** Resolves once web fonts are in (so no swap can show mid-animation), capped so it never stalls. */
const useFontsReady = (capMs = 700) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };
    const timer = setTimeout(go, capMs);
    if (typeof document !== "undefined" && document.fonts?.ready) document.fonts.ready.then(go, go);
    else go();
    return () => clearTimeout(timer);
  }, [capMs]);
  return ready;
};

export default function CardExperience({ qr, to, from, present }: Props) {
  // Read the motion preference only after mount so the server and first client render match.
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Mark this browser session as "came through the card" so the homepage shows Client Work.
  useEffect(() => {
    try {
      sessionStorage.setItem(VIA_CARD_KEY, "1");
    } catch {
      // storage blocked (private mode etc.): the homepage just won't show Client Work
    }
  }, []);
  const reduced = mounted && !!prefersReduced;
  const fontsReady = useFontsReady();
  const script = useMemo(() => buildScript(to), [to]);

  const [stage, setStage] = useState<"terminal" | "card">(present ? "card" : "terminal");
  const [landed, setLanded] = useState(present);
  const [flipped, setFlipped] = useState(present);
  const [flipKind, setFlipKind] = useState<keyof typeof CARD_SPRINGS>(present ? "tap" : "spin");
  const [reveal, setReveal] = useState(present);
  const [toast, setToast] = useState<string | null>(null);

  // Which face is actually facing the viewer right now. Driven by the card's live rotation in
  // onCardUpdate (not by the flip target), so the turned-away face can be hidden with
  // `visibility: hidden` the instant the card passes 90°. backface-visibility alone isn't enough:
  // iOS Safari lets animated descendants bleed through the hidden face during the flip.
  const [shownFace, setShownFace] = useState<"front" | "back">(present ? "back" : "front");
  const shownFaceRef = useRef(shownFace);
  const onCardUpdate = (latest: Record<string, string | number>) => {
    if (reduced) return;
    const deg = parseFloat(String(latest.rotateY ?? 0)) || 0;
    const n = ((deg % 360) + 360) % 360;
    const face = n > 90 && n < 270 ? "back" : "front";
    if (face !== shownFaceRef.current) {
      shownFaceRef.current = face;
      setShownFace(face);
    }
  };

  const stageRef = useRef(stage);
  stageRef.current = stage;
  const introTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const flipTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = (list: React.RefObject<ReturnType<typeof setTimeout>[]>) => {
    list.current.forEach(clearTimeout);
    list.current = [];
  };
  const at = (list: React.RefObject<ReturnType<typeof setTimeout>[]>, ms: number, fn: () => void) => {
    list.current.push(setTimeout(fn, ms));
  };

  /** End the intro (or skip it) and land the card. */
  const land = useCallback(() => {
    if (stageRef.current !== "terminal") return;
    clearTimers(introTimers);
    stageRef.current = "card";
    setStage("card");
    setFlipKind("spin");
    at(introTimers, 40, () => setLanded(true));
    at(introTimers, 160, () => setReveal(true));
    if (!reduced) {
      // Flip once to show the QR on the back, then return. Any tap on the card cancels this.
      at(flipTimers, 1800, () => {
        setFlipKind("auto");
        setFlipped(true);
      });
      at(flipTimers, 3500, () => setFlipped(false));
    }
  }, [reduced]);

  // Reduced motion: no intro, the card is simply there. (The typing itself lives in <TerminalIntro>.)
  useEffect(() => {
    if (present || !reduced) return;
    clearTimers(introTimers);
    clearTimers(flipTimers);
    stageRef.current = "card";
    setStage("card");
    setLanded(true);
    setReveal(true);
    setFlipped(false);
  }, [present, reduced]);

  useEffect(
    () => () => {
      clearTimers(introTimers);
      clearTimers(flipTimers);
    },
    []
  );

  // Any key press, wheel or touch scroll during the intro jumps straight to the card.
  useEffect(() => {
    if (stage !== "terminal") return;
    const skip = () => land();
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
    };
  }, [stage, land]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const flip = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (stage !== "card" || !landed) return;
    clearTimers(flipTimers);
    setFlipKind("tap");
    setFlipped((f) => !f);
  };

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const share = async () => {
    const payload = {
      title: contact.fullName,
      text: `${contact.title}, ${contact.city}. Live work and contact:`,
      url: CARD_URL,
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return; // user closed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(CARD_URL);
      showToast("Link copied");
    } catch {
      showToast("shaquillepearson.com/card");
    }
  };

  // ---------- Greeting ----------
  let greeting = "Hey, I'm Shaquille";
  let wave = true;
  if (to && from) {
    greeting = `Hey ${to}, great meeting you at ${from}`;
    wave = false;
  } else if (to) greeting = `Hey ${to}`;
  else if (from) {
    greeting = `Great meeting you at ${from}`;
    wave = false;
  }
  const greetingSub = to || from ? `I'm Shaquille. ${contact.tagline}` : contact.tagline;

  // ---------- Section reveal ----------
  const revealProps = (i: number) => ({
    ...JS_ANIM,
    initial: { opacity: 0, y: reduced ? 0 : 28 },
    animate: reveal ? { opacity: 1, y: 0 } : undefined,
    transition: (reduced
      ? { y: { duration: 0 }, opacity: { duration: 0.15 } }
      : {
          y: { type: "spring", stiffness: 100, damping: 14, delay: i * 0.09 },
          opacity: { duration: 0.4, ease: "easeOut", delay: i * 0.09 },
        }) as Transition,
  });

  const backStyle: React.CSSProperties = reduced
    ? { opacity: flipped ? 1 : 0, transition: "opacity 150ms" }
    : { transform: "rotateY(180deg)", visibility: shownFace === "back" ? "visible" : "hidden" };

  const cardTransition: Transition = reduced
    ? { duration: 0 }
    : { ...CARD_SPRINGS[flipKind], opacity: { duration: 0.28, ease: "easeOut" } };

  return (
    <div className="card-page" onClick={stage === "terminal" ? land : undefined}>
      <main className="mx-auto flex max-w-[440px] flex-col gap-7 px-4 pt-6 pb-[calc(112px+env(safe-area-inset-bottom))] lg:grid lg:max-w-[1200px] lg:grid-cols-[460px_minmax(0,1fr)] lg:items-start lg:gap-12 lg:px-10 lg:pt-14 lg:pb-[140px]">
        {/* ---------- Left: greeting + card ---------- */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-14 lg:gap-5">
          <motion.header
            {...JS_ANIM}
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: reduced ? 0 : -20 }}
            animate={fontsReady ? { opacity: 1, y: 0 } : undefined}
            transition={{
              y: { type: "spring", stiffness: 100, damping: 14, delay: 0.05 },
              opacity: { duration: 0.4, ease: "easeOut", delay: 0.05 },
            }}
          >
            <h1 className="font-display text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-balance lg:text-[40px]">
              {greeting}
              {wave && (
                <FontAwesomeIcon
                  icon={faHand}
                  aria-hidden="true"
                  className="card-wave ml-[0.3em] inline-block text-[0.85em] text-[#F2B33D]"
                />
              )}
            </h1>
            <p className="text-[15px] font-medium leading-normal text-pretty lg:text-[17px]">{greetingSub}</p>
          </motion.header>

          <div className="relative aspect-[3.5/2] w-full" style={{ perspective: 1400, containerType: "inline-size" }}>
            {/* The card is mounted from the start (hidden) so landing is an animation, not a heavy React commit. */}
            <motion.button
              onUpdate={onCardUpdate}
              type="button"
              onClick={flip}
              aria-pressed={flipped}
              aria-hidden={!landed}
              inert={!landed}
              tabIndex={landed ? 0 : -1}
              aria-label={
                flipped
                  ? "Business card, back. Activate to show the front."
                  : present
                    ? "Business card, front. Activate to show the QR code on the back."
                    : "Business card, front. Activate to flip it over."
              }
              className={`absolute inset-0 m-0 cursor-pointer rounded-[4.6cqw] border-0 bg-transparent p-0 ${landed ? "" : "pointer-events-none"}`}
              style={{ transformStyle: "preserve-3d", willChange: "transform" }}
              initial={reduced || present ? false : HIDDEN_CARD}
              animate={landed ? { rotateY: reduced ? 0 : flipped ? 180 : 0, rotateX: 0, y: 0, scale: 1, opacity: 1 } : HIDDEN_CARD}
              transition={cardTransition}
              whileTap={reduced || !landed ? undefined : { scale: 0.98 }}
            >
              <CardFront
                animate={!reduced}
                hiddenFace={flipped}
                style={
                  reduced
                    ? { opacity: flipped ? 0 : 1, transition: "opacity 150ms" }
                    : { visibility: shownFace === "front" ? "visible" : "hidden" }
                }
              />
              {present ? (
                <CardBackQr qr={qr} hiddenFace={!flipped} style={backStyle} />
              ) : (
                <CardBackAbout animate={!reduced} hiddenFace={!flipped} style={backStyle} />
              )}
            </motion.button>

            {stage === "terminal" && fontsReady && <TerminalIntro script={script} animate={!reduced} onDone={land} />}
          </div>

          <div className="flex min-h-11 items-center justify-center">
            {stage === "terminal" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  land();
                }}
                className="h-11 cursor-pointer rounded-full border-0 px-5 text-sm font-bold"
                style={{ ...panel, color: "var(--text)" }}
              >
                Skip <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" className="ml-1 text-[11px]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={flip}
                className="h-11 cursor-pointer whitespace-nowrap border-0 bg-transparent px-4 text-[13px] font-medium opacity-75"
                style={{ color: "var(--text)" }}
              >
                {flipped ? "Tap to flip back" : "Tap to flip"}
              </button>
            )}
          </div>
        </div>

        {/* ---------- Right: live work, blog, CTA ---------- */}
        <div className="flex flex-col gap-7">
          <motion.section aria-labelledby="live-work-h" className="flex flex-col gap-3" {...revealProps(0)}>
            <Eyebrow id="live-work-h">Live work</Eyebrow>
            <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
              {featuredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} reveal={reveal} reduced={reduced} />
              ))}
            </div>
          </motion.section>

          <motion.section aria-labelledby="blog-h" className="flex flex-col gap-3" {...revealProps(1)}>
            <Eyebrow id="blog-h">Blog · The Programmer&apos;s Gazette</Eyebrow>
            <BlogPanel />
          </motion.section>

          <motion.section aria-label="Portfolio" className="flex flex-col gap-3" {...revealProps(2)}>
            <motion.div whileTap={{ scale: 0.98 }} transition={PRESS}>
              <Link
                href="/"
                onClick={() => sessionStorage.setItem(HIGHLIGHT_KEY, "1")}
                className="flex items-center justify-between gap-4 rounded-3xl px-5 py-5 pl-[22px] lg:p-6 lg:pl-7"
                style={{ background: "var(--accent)", color: "var(--accent-ink)", boxShadow: "var(--shadow)" }}
              >
                <span className="font-display text-2xl font-bold leading-[1.1] tracking-[-0.01em] text-balance lg:text-[28px]">
                  Explore my full portfolio
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-xl"
                  style={{ background: "var(--accent-ink)", color: "var(--accent)" }}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </Link>
            </motion.div>
            <nav aria-label="Quick links" className="grid grid-cols-4 gap-2">
              <QuickLink href="https://github.com/SV592" icon={<FontAwesomeIcon icon={faGithub} />} label="GitHub" />
              <QuickLink
                href="https://www.linkedin.com/in/shaquille-pearson-mmath-47bb5a208/"
                icon={<FontAwesomeIcon icon={faLinkedin} />}
                label="LinkedIn"
              />
              <QuickLink href={contact.blogUrl} icon={<FontAwesomeIcon icon={faNewspaper} />} label="Blog" />
              <QuickLink href={RESUME_URL} icon={<FontAwesomeIcon icon={faFileArrowDown} />} label="Résumé" />
            </nav>
          </motion.section>
        </div>
      </main>

      {/* ---------- Share toast ---------- */}
      <div
        role="status"
        className="pointer-events-none fixed bottom-[calc(90px+env(safe-area-inset-bottom))] left-[calc(12px+(100vw-80px)/2)] z-50 -translate-x-1/2 lg:bottom-[100px] lg:left-1/2"
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              {...JS_ANIM}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.15, ease: "easeIn" } }}
              className="flex items-center gap-2 whitespace-nowrap rounded-full px-[18px] py-2.5 text-sm font-bold shadow-[0_12px_32px_-8px_rgba(0,0,0,0.4)]"
              style={{ background: "var(--toast-bg)", color: "var(--toast-ink)" }}
            >
              {toast} <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="text-[#22C55E]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- Contact action bar (live from the first frame) ---------- */}
      <div className="fixed bottom-[calc(12px+env(safe-area-inset-bottom))] left-3 right-[68px] z-50 lg:bottom-5 lg:left-1/2 lg:right-auto lg:w-[460px] lg:-translate-x-1/2">
        <motion.div
          {...JS_ANIM}
          role="toolbar"
          aria-label="Contact actions"
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ y: { type: "spring", stiffness: 400, damping: 32 }, opacity: { duration: 0.2, ease: "easeOut" } }}
          className="grid grid-cols-[1.3fr_1fr_1fr] gap-1.5 rounded-3xl p-1.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)]"
          style={{ background: "var(--panel)" }}
        >
          <BarAction href="/api/vcard" download icon={faAddressCard} label="Save contact" primary />
          <BarAction onClick={share} icon={faArrowUpFromBracket} label="Share" />
          <BarAction href={`mailto:${contact.email}`} icon={faEnvelope} label="Email" />
        </motion.div>
      </div>
    </div>
  );
}

// ---------- Pieces ----------

/**
 * Types the terminal script, then fades out and calls onDone. Kept in its own component so the
 * per-keystroke state updates only re-render the terminal, not the whole page.
 */
const TerminalIntro: React.FC<{ script: ScriptLine[]; animate: boolean; onDone: () => void }> = ({
  script,
  animate,
  onDone,
}) => {
  const [step, setStep] = useState(0);
  const [morph, setMorph] = useState(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = TYPE_START;
    let s = 0;
    for (const line of script) {
      if ("cmd" in line) {
        for (let i = 0; i < line.cmd.length; i++) {
          const v = ++s;
          timers.push(setTimeout(() => setStep(v), t));
          t += TYPE_CHAR;
        }
        t += TYPE_ENTER;
      } else {
        const v = ++s;
        timers.push(setTimeout(() => setStep(v), t));
        t += TYPE_OUTPUT;
      }
    }
    t += 200;
    timers.push(setTimeout(() => setMorph(true), t));
    timers.push(setTimeout(() => onDoneRef.current(), t + 220));
    return () => timers.forEach(clearTimeout);
  }, [script]);

  return (
    <motion.div
      {...JS_ANIM}
      className="absolute inset-x-0 top-1/2"
      initial={{ opacity: 0, scale: 0.96, y: "-50%" }}
      animate={{ opacity: morph ? 0 : 1, scale: morph ? 0.94 : 1, y: "-50%" }}
      transition={morph ? { duration: 0.22, ease: [0.4, 0, 1, 1] } : { duration: 0.18, ease: "easeOut" }}
    >
      <Terminal script={script} step={step} animate={animate} />
    </motion.div>
  );
};

const Eyebrow: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2 id={id} className="mx-1 text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--eyebrow)" }}>
    {children}
  </h2>
);

const ProjectCard: React.FC<{
  project: (typeof featuredProjects)[number];
  index: number;
  reveal: boolean;
  reduced: boolean;
}> = ({ project, index, reveal, reduced }) => {
  const stat = PROJECT_STATS[project.id];
  const [imgLoaded, setImgLoaded] = useState(false);
  const delay = 0.16 + index * 0.08;
  return (
    <motion.article
      {...JS_ANIM}
      className="flex flex-col overflow-hidden rounded-3xl"
      style={panel}
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      animate={reveal ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay }}
    >
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} screenshot, opens ${project.live?.replace(/^https?:\/\/(www\.)?|\/$/g, "")}`}
        className="relative block aspect-[16/10] overflow-hidden"
        style={{ background: "var(--soft)" }}
      >
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 360px"
            onLoad={() => setImgLoaded(true)}
            style={{ objectFit: "cover", objectPosition: "top", opacity: imgLoaded ? 1 : 0, transition: "opacity 300ms ease-out" }}
          />
        </div>
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[rgba(14,16,19,0.86)] px-2.5 py-[5px] text-[11px] font-bold uppercase tracking-[0.06em] text-[#86EFAC]">
          <LivePiece unit="5px" animate={!reduced} />
          Live
        </span>
      </a>
      <div className="flex flex-1 flex-col gap-3.5 p-5">
        <div className="flex flex-col gap-1.5">
          <h3 className="font-display text-[21px] font-bold leading-[1.1]">{project.title}</h3>
          <p className="text-[15px] font-medium leading-normal text-pretty" style={{ color: "var(--muted)" }}>
            {project.description}
          </p>
        </div>
        {stat && (
          <span className="text-sm font-semibold">
            <span className="font-term">{stat.value}</span> {stat.label}
          </span>
        )}
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span key={tag.name} className={`card-tag ${tag.color} whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium`}>
              {tag.name}
            </span>
          ))}
        </div>
        <motion.a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} (opens in new tab)`}
          whileTap={{ scale: 0.96 }}
          transition={PRESS}
          className="mt-auto flex h-[46px] items-center justify-center gap-2 rounded-[14px] text-[15px] font-bold"
          style={{ background: "var(--inv)", color: "var(--inv-ink)" }}
        >
          Open app <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" className="text-[13px]" />
        </motion.a>
      </div>
    </motion.article>
  );
};

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  // A date-only string ("2026-07-13") parses as UTC midnight, which is the previous evening in
  // North American time zones. Format those in UTC so the calendar day matches the post.
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(dateOnly ? { timeZone: "UTC" } : {}),
  });
};

const BlogPanel: React.FC = () => {
  const { data: raw, loading } = useLatestBlogPost();
  const postUrl = safeHttpUrl(raw?.url);
  const imageUrl = safeHttpUrl(raw?.imageUrl);
  // Treat a post without a safe link as "no post" and show the empty state.
  const data = raw && postUrl ? raw : null;

  if (loading) {
    return <div aria-hidden="true" className="h-[170px] animate-pulse rounded-3xl" style={panel} />;
  }

  if (!data) {
    return (
      <motion.a
        {...JS_ANIM}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        href={contact.blogUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-4 rounded-3xl p-5"
        style={panel}
      >
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="font-display text-xl font-bold leading-[1.2]">Fresh posts coming soon</h3>
          <p className="text-sm font-medium leading-normal text-pretty" style={{ color: "var(--muted)" }}>
            Notes on shipping production apps and cloud migrations.
          </p>
        </div>
        <span className="flex flex-none items-center gap-2 whitespace-nowrap text-[15px] font-bold">
          Visit <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" className="text-[13px]" />
        </span>
      </motion.a>
    );
  }

  return (
    <motion.a
      {...JS_ANIM}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      href={postUrl ?? contact.blogUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col overflow-hidden rounded-3xl"
      style={panel}
    >
      {/* Blog covers are wide 5:2 banners (1400×560), so show them full-width at that ratio rather than
          squeezing them into a side column where `cover` crops most of the image away. */}
      {imageUrl && (
        <div className="relative aspect-[5/2] w-full" style={{ background: "var(--soft)" }}>
          <Image
            src={imageUrl}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 640px"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      )}
      <div className="flex flex-col gap-2 p-5">
        <span className="text-[13px] font-medium" style={{ color: "var(--muted)" }}>
          {formatDate(data.date)}
        </span>
        <h3 className="font-display text-xl font-bold leading-[1.2] text-balance">{data.title}</h3>
        <p className="text-sm font-medium leading-normal text-pretty" style={{ color: "var(--muted)" }}>
          {data.description}
        </p>
        <span className="mt-auto flex items-center gap-2 pt-1.5 text-[15px] font-bold">
          Read post <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" className="text-[13px]" />
        </span>
      </div>
    </motion.a>
  );
};

const QuickLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileTap={{ scale: 0.96 }}
    transition={PRESS}
    className="flex min-h-16 flex-col items-center justify-center gap-1.5 whitespace-nowrap rounded-[18px] text-xs font-semibold [&_svg]:text-lg"
    style={{ ...panel, color: "var(--text)" }}
  >
    {icon}
    {label}
  </motion.a>
);

const BarAction: React.FC<{
  icon: typeof faEnvelope;
  label: string;
  href?: string;
  download?: boolean;
  onClick?: () => void;
  primary?: boolean;
}> = ({ icon, label, href, download, onClick, primary }) => {
  const className =
    "flex h-[52px] cursor-pointer flex-col items-center justify-center gap-1 whitespace-nowrap rounded-[18px] border-0 text-[13px] font-bold lg:flex-row lg:gap-2.5 lg:text-[15px]";
  const style: React.CSSProperties = primary
    ? { background: "var(--accent)", color: "var(--accent-ink)" }
    : { background: "var(--soft)", color: "var(--text)" };
  const content = (
    <>
      <FontAwesomeIcon icon={icon} aria-hidden="true" className="text-[17px]" />
      {label}
    </>
  );
  return href ? (
    <motion.a href={href} download={download || undefined} whileTap={{ scale: 0.96 }} transition={PRESS} className={className} style={style}>
      {content}
    </motion.a>
  ) : (
    <motion.button type="button" onClick={onClick} whileTap={{ scale: 0.96 }} transition={PRESS} className={className} style={style}>
      {content}
    </motion.button>
  );
};
