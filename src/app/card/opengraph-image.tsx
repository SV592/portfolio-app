import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { contact } from "../lib/card/contact";
import { VCARD_PHOTO_JPEG_BASE64 } from "../api/vcard/photo";

/*
 * Link-preview image for /card (iMessage, WhatsApp, LinkedIn, Slack, X…): the front of the business
 * card on the portfolio's light gradient. Generated once at build time, so it costs nothing per request.
 * Rendered as PNG by ImageResponse, then re-encoded as JPEG: the PNG is ~370 KB, over the ~300 KB
 * limit above which WhatsApp drops link-preview images; the JPEG is ~65 KB.
 */

export const alt = `${contact.fullName}, ${contact.title} · ${contact.city}, ${contact.region}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

const NAVY = "#183B4E";
const SKY = "#8EC5FC";
const GREEN = "#22C55E";

// Pixel "SP" monogram, same 8×5 grid as the card.
const MONOGRAM_ROWS = ["11100111", "10000101", "11100111", "00100100", "11100100"];

const Monogram = ({ cell }: { cell: number }) => {
  const gap = Math.round(cell * 0.15);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {MONOGRAM_ROWS.map((row, y) => (
        <div key={y} style={{ display: "flex", gap }}>
          {[...row].map((bit, x) => (
            <div
              key={x}
              style={{ width: cell, height: cell, borderRadius: 2, background: bit === "1" ? SKY : "transparent" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Green S-piece used for the "live" indicator.
const LivePiece = ({ cell }: { cell: number }) => {
  const step = Math.round(cell * 1.15);
  const cells: [number, number][] = [[0, 0], [1, 0], [1, 1], [2, 1]];
  return (
    <div style={{ display: "flex", position: "relative", width: step * 2 + cell, height: step + cell }}>
      {cells.map(([x, y]) => (
        <div
          key={`${x}${y}`}
          style={{ position: "absolute", left: x * step, top: y * step, width: cell, height: cell, borderRadius: 3, background: GREEN }}
        />
      ))}
    </div>
  );
};

export default async function OpengraphImage(): Promise<Response> {
  const fontDir = join(process.cwd(), "src/app/card/og-fonts");
  const [display, sansMedium, sansSemi] = await Promise.all([
    readFile(join(fontDir, "FunnelDisplay-Bold.ttf")),
    readFile(join(fontDir, "FunnelSans-Medium.ttf")),
    readFile(join(fontDir, "FunnelSans-SemiBold.ttf")),
  ]);

  const png = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, #FEFBC7 0%, ${SKY} 55%, ${NAVY} 100%)`,
          fontFamily: "Funnel Sans",
        }}
      >
        {/* the card */}
        <div
          style={{
            width: 880,
            height: 503, // 3.5 : 2
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "46px 56px 52px",
            borderRadius: 40,
            background: `radial-gradient(circle at 85% 10%, #22526B 0%, ${NAVY} 55%)`,
            color: "#FFFFFF",
            boxShadow: "0 40px 80px -24px rgba(0,0,0,0.55)",
            transform: "rotate(-2deg)",
          }}
        >
          {/* top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Monogram cell={11} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 18px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.14)",
                color: "#BBF7D0",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              <LivePiece cell={11} />2 live apps
            </div>
          </div>

          {/* photo + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
            <img
              src={`data:image/jpeg;base64,${VCARD_PHOTO_JPEG_BASE64}`}
              alt=""
              width={180}
              height={180}
              style={{ borderRadius: 999, border: "5px solid rgba(254,251,199,0.9)" }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Funnel Display",
                  fontSize: 76,
                  fontWeight: 700,
                  lineHeight: 0.98,
                  letterSpacing: "-0.01em",
                }}
              >
                <span>{contact.firstName}</span>
                <span>{contact.lastName}</span>
              </div>
              <div style={{ display: "flex", fontSize: 32, fontWeight: 600, color: SKY }}>
                {contact.title} · {contact.city}, {contact.region}
              </div>
              <div style={{ display: "flex", fontSize: 25, fontWeight: 500, color: "#CFE3F5" }}>
                Full-stack apps, cloud infrastructure, data &amp; AI/ML
              </div>
            </div>
          </div>

          {/* bottom row */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 500, color: SKY }}>
            <span>shaquillepearson.com</span>
            <span>github.com/SV592</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Funnel Display", data: display, weight: 700, style: "normal" },
        { name: "Funnel Sans", data: sansMedium, weight: 500, style: "normal" },
        { name: "Funnel Sans", data: sansSemi, weight: 600, style: "normal" },
      ],
    }
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer()))
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": contentType } });
}
