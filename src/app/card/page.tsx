import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import QRCode from "qrcode";
import CardExperience from "./CardExperience";
import { CARD_URL, SITE_URL, contact } from "../lib/card/contact";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  // Shared by hand, not meant to be found: keep it out of search results.
  robots: { index: false, follow: false },
  title: `${contact.fullName} · Digital Card`,
  description: `${contact.title}. ${contact.tagline} See my live work, save my contact, and explore my portfolio.`,
  openGraph: {
    title: `${contact.fullName} · Digital Card`,
    description: `${contact.title}. ${contact.tagline}`,
    url: CARD_URL,
    siteName: "Shaquille Pearson",
    images: [{ url: `${SITE_URL}${contact.photo}`, alt: contact.fullName }],
    type: "profile",
  },
};

/**
 * Turns a ?to= / ?from= tag into safe display text: "devfest-2026" → "devfest 2026".
 * Only letters, numbers, spaces and a few punctuation marks survive; capped at 32 chars.
 */
const cleanTag = (value: string | string[] | undefined): string | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const cleaned = raw
    .replace(/[-_]+/g, " ")
    .replace(/[^\p{L}\p{N} '&.]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 32);
  return cleaned || null;
};

/** Builds the QR as one SVG path (1 unit per module) so the card can overlay the monogram in its centre. */
const buildQr = (url: string): { size: number; path: string } => {
  const { modules } = QRCode.create(url, { errorCorrectionLevel: "H" });
  let path = "";
  for (let y = 0; y < modules.size; y++) {
    for (let x = 0; x < modules.size; x++) {
      if (modules.get(y, x)) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { size: modules.size, path };
};

type CardPageProps = {
  searchParams: Promise<{ to?: string | string[]; from?: string | string[]; qr?: string | string[] }>;
};

/**
 * /card — the shareable digital business card.
 * Personalise links with ?to=Sarah ("Hey Sarah") or ?from=devfest ("Great meeting you at devfest").
 * /card?qr is "present mode" for showing your own screen: no intro, opens on the QR side.
 */
export default async function CardPage({ searchParams }: CardPageProps) {
  const params = await searchParams;

  return (
    <div className={jetbrainsMono.variable}>
      <CardExperience
        qr={buildQr(CARD_URL)}
        to={cleanTag(params.to)}
        from={cleanTag(params.from)}
        present={params.qr !== undefined}
      />
    </div>
  );
}
