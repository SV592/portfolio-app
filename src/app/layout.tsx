import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Funnel_Sans, Funnel_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";

// Ship FontAwesome's CSS with the server-rendered page instead of letting react-fontawesome inject
// it at runtime. Without this, icons render unstyled (300×150 px) until hydration, which makes
// sections jump in height and shifts the layout on load.
fontAwesomeConfig.autoAddCss = false;

const geistSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

const geistMono = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shaquille Pearson",
  description:
    "Shaquille Pearson's personal portfolio showcasing full-stack development, data and AI/ML projects, skills, and experience.",
  keywords: [
    "Shaquille Pearson",
    "portfolio",
    "full-stack developer",
    "machine learning",
    "data",
    "AI/ML",
    "software engineer",
    "developer",
  ],
  authors: [{ name: "Shaquille Pearson" }],
  creator: "Shaquille Pearson",
  publisher: "Shaquille Pearson",
  openGraph: {
    title: "Shaquille Pearson's Portfolio",
    description:
      "Shaquille Pearson's personal portfolio showcasing full-stack development, mobile apps, AI/ML, and data projects, skills, and experience.",
    url: "https://shaquillepearson.com",
    siteName: "Shaquille Pearson's Portfolio",
    images: [
      {
        url: "https://shaquillepearson.com/public/images/Profile.jpg",
        width: 1200,
        height: 630,
        alt: "Shaquille Pearson's Portfolio Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} transition-colors duration-300 ease-in-out min-w-[350px]`}
      >
        <ThemeProvider
          attribute={"data-theme"}
          defaultTheme="myLightTheme"
          enableSystem={false}
          themes={["myLightTheme", "myDarkTheme"]}
        >
          {children}
          <ThemeToggle />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
