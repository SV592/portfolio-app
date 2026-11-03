import React from "react";
import { contact } from "../lib/card/contact";

/* All card art is sized in container units (cqw) so the same markup scales with the card's width. */

// ---------- Pixel "SP" monogram (8 × 5 block grid, 0.15 gap) ----------
const MONOGRAM_ROWS = ["11100111", "10000101", "11100111", "00100100", "11100100"];
const MONOGRAM_PATH = MONOGRAM_ROWS.flatMap((row, y) =>
  [...row].map((bit, x) => (bit === "1" ? `M${+(x * 1.15).toFixed(2)} ${+(y * 1.15).toFixed(2)}h1v1h-1z` : ""))
).join("");

export const Monogram: React.FC<{ width: string; color?: string }> = ({ width, color = "#8EC5FC" }) => (
  <svg viewBox="-0.15 -0.15 9.35 5.9" aria-hidden="true" style={{ width, height: "auto", display: "block" }}>
    <path d={MONOGRAM_PATH} fill={color} />
  </svg>
);

// ---------- "Live" S-piece: four blocks pulsing in sequence ----------
const PIECE_CELLS: [number, number][] = [[0, 0], [1, 0], [1, 1], [2, 1]];

export const LivePiece: React.FC<{ unit: string; color?: string; animate: boolean }> = ({
  unit,
  color = "#22C55E",
  animate,
}) => (
  <span
    aria-hidden="true"
    style={{ position: "relative", display: "inline-block", width: `calc(${unit} * 3.2)`, height: `calc(${unit} * 2.1)`, flex: "none" }}
  >
    {PIECE_CELLS.map(([x, y], i) => (
      <span
        key={i}
        className="card-anim"
        style={{
          position: "absolute",
          left: `calc(${unit} * ${x * 1.1})`,
          top: `calc(${unit} * ${y * 1.1})`,
          width: unit,
          height: unit,
          borderRadius: "18%",
          background: color,
          animation: animate ? `card-pulse 1.6s ease-in-out ${i * 120}ms infinite` : "none",
        }}
      />
    ))}
  </span>
);

// ---------- Terminal intro ----------
export type ScriptLine = { cmd: string } | { out: string } | { live: true };

export const buildScript = (to: string | null): ScriptLine[] => [
  { cmd: "whoami" },
  { out: "shaquille-pearson" },
  { cmd: "cat role.txt" },
  { out: `${contact.title} · ${contact.city}, ${contact.region}` },
  { cmd: "ps --live" },
  { live: true },
  { cmd: to ? `./open-card --for "${to}"` : "./open-card" },
];

const Cursor: React.FC<{ animate: boolean }> = ({ animate }) => (
  <span
    aria-hidden="true"
    className="card-anim"
    style={{
      display: "inline-block",
      width: "0.6em",
      height: "1.15em",
      background: "#8EC5FC",
      verticalAlign: "text-bottom",
      marginLeft: 2,
      animation: animate ? "card-blink 1s steps(1) infinite" : "none",
    }}
  />
);

export const Terminal: React.FC<{ script: ScriptLine[]; step: number; animate: boolean }> = ({
  script,
  step,
  animate,
}) => {
  // Work out what has been "typed" so far; the cursor always sits on a trailing prompt line.
  const typed: ScriptLine[] = [];
  let remaining = step;
  for (const line of script) {
    if (remaining <= 0) break;
    if ("cmd" in line) {
      const n = Math.min(remaining, line.cmd.length);
      typed.push({ cmd: line.cmd.slice(0, n) });
      remaining -= n;
    } else {
      typed.push(line);
      remaining -= 1;
    }
  }
  const last = typed[typed.length - 1];
  if (!last || !("cmd" in last)) typed.push({ cmd: "" });

  const lines = typed.map((line, i) => {
    if ("cmd" in line) {
      return <CmdLine key={i} text={line.cmd} cursor={i === typed.length - 1 ? <Cursor animate={animate} /> : null} />;
    }
    return (
      <div key={i} style={{ whiteSpace: "nowrap", minHeight: "1.6em" }}>
        {"out" in line ? (
          <span style={{ color: "#FEFBC7" }}>{line.out}</span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
            <LivePiece unit="0.42em" animate={animate} />
            <span style={{ color: "#FEFBC7", whiteSpace: "pre" }}>go2fete.com   </span>
            <LivePiece unit="0.42em" animate={animate} />
            <span style={{ color: "#FEFBC7" }}>cruizegnd.com</span>
          </span>
        )}
      </div>
    );
  });

  return (
    <div
      role="img"
      aria-label={`Terminal: whoami, shaquille-pearson. ${contact.title}, ${contact.city}. Live apps: go2fete.com and cruizegnd.com.`}
      className="font-term"
      style={{ background: "#1A202C", borderRadius: "4.4cqw", overflow: "hidden", boxShadow: "0 24px 48px -12px rgba(0,0,0,0.5)" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.6cqw", padding: "2.4cqw 3.4cqw", background: "#2E2B2C" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: "2.6cqw", height: "2.6cqw", borderRadius: "50%", background: c }} />
        ))}
        <span
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "1.4cqw", marginRight: "9cqw", fontSize: "2.8cqw", color: "#99A1AF" }}
        >
          <Monogram width="4.2cqw" />~/card — zsh
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", padding: "3.4cqw 4.4cqw 4cqw", fontSize: "3.5cqw", lineHeight: 1.6, minHeight: "44cqw" }}>
        {lines}
      </div>
    </div>
  );
};

const CmdLine: React.FC<{ text: string; cursor?: React.ReactNode }> = ({ text, cursor }) => (
  <div style={{ whiteSpace: "nowrap", minHeight: "1.6em", overflow: "hidden" }}>
    <span style={{ color: "#8EC5FC" }}>$ </span>
    <span style={{ color: "#FFFFFF", whiteSpace: "pre" }}>{text}</span>
    {cursor}
  </div>
);

// ---------- Card faces ----------
const faceBase: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  borderRadius: "4.6cqw",
  overflow: "hidden",
  boxShadow: "0 24px 48px -12px rgba(0,0,0,0.45)",
  padding: "5.6cqw 6.4cqw 7.4cqw",
  boxSizing: "border-box",
  textAlign: "left",
  fontFamily: "var(--font-funnel-sans), sans-serif",
};

type FaceProps = { style?: React.CSSProperties; hiddenFace?: boolean };
/** The face turned away is removed from the tab order and accessibility tree so its text isn't read twice. */
const faceAttrs = (hidden?: boolean) => (hidden ? { "aria-hidden": true, inert: true } : {});

export const CardFront: React.FC<FaceProps & { animate: boolean }> = ({ animate, style, hiddenFace }) => (
  <div
    {...faceAttrs(hiddenFace)}
    style={{ ...faceBase, background: "#183B4E", color: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "space-between", ...style }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Monogram width="7.2cqw" />
      <span style={{ display: "flex", alignItems: "center", gap: "1.6cqw", fontSize: "2.9cqw", fontWeight: 600, color: "#BBF7D0" }}>
        <LivePiece unit="1.7cqw" animate={animate} />2 live apps
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "5cqw" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- sized in cqw, which next/image can't express */}
      <img
        src={contact.photo}
        alt=""
        style={{ width: "22cqw", height: "22cqw", flex: "none", borderRadius: "50%", objectFit: "cover" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.4cqw", minWidth: 0 }}>
        <span className="font-display" style={{ fontSize: "8cqw", fontWeight: 700, lineHeight: 0.98, letterSpacing: "-0.01em" }}>
          {contact.firstName}
          <br />
          {contact.lastName}
        </span>
        <span style={{ fontSize: "3.6cqw", fontWeight: 600, lineHeight: 1.2, color: "#8EC5FC" }}>
          {contact.title} · {contact.city}, {contact.region}
        </span>
        <span style={{ fontSize: "3.1cqw", fontWeight: 500, lineHeight: 1.3, color: "#CFE3F5" }}>
          Full-stack apps, cloud infrastructure, data &amp; AI/ML
        </span>
      </div>
    </div>
    <div
      className="font-term"
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "2.9cqw", fontWeight: 500, color: "#8EC5FC" }}
    >
      <span>shaquillepearson.com</span>
      <span>github.com/SV592</span>
    </div>
    {/* faint grid in the top-right corner */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        right: "-6cqw",
        top: "-6cqw",
        width: "46cqw",
        height: "46cqw",
        backgroundImage:
          "linear-gradient(rgba(142,197,252,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(142,197,252,0.10) 1px, transparent 1px)",
        backgroundSize: "5cqw 5cqw",
        WebkitMaskImage: "radial-gradient(circle at 70% 30%, #000 0%, transparent 70%)",
        maskImage: "radial-gradient(circle at 70% 30%, #000 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />
  </div>
);

/** QR face, used in present mode (/card?qr) when someone scans the screen. */
export const CardBackQr: React.FC<FaceProps & { qr: { size: number; path: string } }> = ({ qr, style, hiddenFace }) => (
  <div {...faceAttrs(hiddenFace)} style={{ ...faceBase, background: "#FEFBC7", color: "#183B4E", display: "flex", alignItems: "center", gap: "6cqw", ...style }}>
    <div
      style={{ position: "relative", flex: "none", width: "38cqw", height: "38cqw", background: "#FFFFFF", borderRadius: "2.6cqw", padding: "2.8cqw", boxSizing: "border-box" }}
    >
      <svg
        viewBox={`0 0 ${qr.size} ${qr.size}`}
        shapeRendering="crispEdges"
        role="img"
        aria-label="QR code for shaquillepearson.com/card"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <path d={qr.path} fill="#183B4E" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: "9.6cqw",
          height: "9.6cqw",
          background: "#183B4E",
          border: "0.9cqw solid #FFFFFF",
          borderRadius: "1.6cqw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <Monogram width="6cqw" />
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "4cqw", minWidth: 0 }}>
      <span className="font-display" style={{ fontSize: "6.4cqw", fontWeight: 700, lineHeight: 1.05 }}>
        Scan to see
        <br />
        my live work
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.4cqw", fontSize: "3cqw", fontWeight: 500 }}>
        <span>{contact.email}</span>
        <span>shaquillepearson.com</span>
      </div>
    </div>
  </div>
);

// ---------- Default back: what Shaquille is open to ----------
/** Default back for visitors: availability, stated plainly. */
export const CardBackAbout: React.FC<FaceProps & { animate: boolean }> = ({ animate, style, hiddenFace }) => (
  <div
    {...faceAttrs(hiddenFace)}
    style={{ ...faceBase, background: "#FEFBC7", color: "#183B4E", display: "flex", flexDirection: "column", justifyContent: "space-between", ...style }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ display: "inline-flex", padding: "1.3cqw 1.6cqw", borderRadius: "1.6cqw", background: "#183B4E" }}>
        <Monogram width="5.6cqw" />
      </span>
      <span
        style={{ display: "inline-flex", alignItems: "center", gap: "1.6cqw", padding: "1.1cqw 2.6cqw", borderRadius: 999, background: "#183B4E", color: "#BBF7D0", fontSize: "2.9cqw", fontWeight: 600 }}
      >
        <LivePiece unit="1.5cqw" animate={animate} />
        Available
      </span>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "2.4cqw" }}>
      <span className="font-term" style={{ fontSize: "3cqw", fontWeight: 500, color: "#4A6B7C" }}>
        $ status
      </span>
      <span className="font-display" style={{ fontSize: "8.4cqw", fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.01em" }}>
        Open to commissions
        <br />
        &amp; collaborations
      </span>
    </div>

    <div
      className="font-term"
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2cqw", fontSize: "2.9cqw", fontWeight: 500, color: "#183B4E" }}
    >
      <span>{contact.email}</span>
      <span>shaquillepearson.com</span>
    </div>

    {/* faint navy grid, mirroring the front's corner detail */}
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        right: "-6cqw",
        top: "-6cqw",
        width: "46cqw",
        height: "46cqw",
        backgroundImage:
          "linear-gradient(rgba(24,59,78,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(24,59,78,0.08) 1px, transparent 1px)",
        backgroundSize: "5cqw 5cqw",
        WebkitMaskImage: "radial-gradient(circle at 70% 30%, #000 0%, transparent 70%)",
        maskImage: "radial-gradient(circle at 70% 30%, #000 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />
  </div>
);
