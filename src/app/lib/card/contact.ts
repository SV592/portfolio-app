/**
 * Contact details for the digital business card (/card) and its vCard download.
 * Edit here to update the card, the "Save Contact" file and the share text at once.
 */
export const SITE_URL = "https://shaquillepearson.com";
export const CARD_URL = `${SITE_URL}/card`;

export const contact = {
  firstName: "Shaquille",
  lastName: "Pearson",
  fullName: "Shaquille Pearson",
  title: "Software Engineer",
  tagline: "I build and ship production software, from apps to cloud infrastructure, data and AI/ML.",
  email: "shaquillepearson9@gmail.com",
  city: "Waterloo",
  region: "ON",
  country: "Canada",
  photo: "/images/Profile.jpg",
  note: "Portfolio: https://shaquillepearson.com · Live work: Go2Fete (go2fete.com), CruizeGND (cruizegnd.com)",
  links: [
    { label: "Portfolio", url: SITE_URL },
    { label: "GitHub", url: "https://github.com/SV592" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/shaquille-pearson-mmath-47bb5a208/" },
    { label: "Blog", url: "https://theprogrammersgazette.vercel.app/" },
  ],
  blogUrl: "https://theprogrammersgazette.vercel.app/",
} as const;
