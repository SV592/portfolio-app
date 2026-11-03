import { contact } from "../../lib/card/contact";
import { VCARD_PHOTO_JPEG_BASE64 } from "./photo";

/**
 * Folds a vCard content line to 75 octets per RFC 2426 (continuation lines start with a space).
 */
const fold = (line: string): string => {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(" " + line.slice(i, i + 74));
  return parts.join("\r\n");
};

/** Escapes characters that are special in vCard text values. */
const esc = (value: string): string =>
  value.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

/**
 * GET /api/vcard
 * Returns Shaquille's contact as a downloadable vCard (.vcf) so phones offer "Add to Contacts".
 */
export async function GET() {

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(contact.lastName)};${esc(contact.firstName)};;;`,
    `FN:${esc(contact.fullName)}`,
    `TITLE:${esc(contact.title)}`,
    `EMAIL;TYPE=INTERNET,PREF:${contact.email}`,
    `ADR;TYPE=HOME:;;;${esc(contact.city)};${esc(contact.region)};;${esc(contact.country)}`,
    // item-grouped URLs give each link a readable label on iOS
    ...contact.links.flatMap((link, i) => [
      `item${i + 1}.URL:${link.url}`,
      `item${i + 1}.X-ABLabel:${esc(link.label)}`,
    ]),
    `NOTE:${esc(contact.note)}`,
    `PHOTO;ENCODING=b;TYPE=JPEG:${VCARD_PHOTO_JPEG_BASE64}`,
    "END:VCARD",
  ];

  return new Response(lines.map(fold).join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Shaquille-Pearson.vcf"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
