import type { Project } from "../../components/Insights/ProjectModal/ProjectModal";

/**
 * Commissioned client projects, live in production. Shown as "Client Work" in the Projects section and
 * featured on the shareable digital business card (/card).
 */
export const featuredProjects: Project[] = [
  {
    id: "go2fete",
    title: "Go2Fete",
    image: "/images/go2fete.webp",
    alt: "Screenshot of the Go2Fete event ticketing homepage",
    description:
      "A live event ticketing platform for the Caribbean: event creation, Stripe checkout, seating charts, box office sales and QR check-ins.",
    longDescription:
      "Go2Fete is a production event ticketing platform used by promoters and attendees across the Caribbean. Organisers create events, design seating charts and sell tickets online through Stripe, while box office staff sell at the door and reconcile settlements. On event night, tickets are scanned with QR check-in. Built on CakePHP 5 with MFA, account lockout and audit logging, and currently being migrated from a single server to a highly available AWS setup (ECS Fargate, RDS Multi-AZ, CloudFront) to support expansion to other islands.",
    language: "PHP",
    year: "2025",
    status: "Live",
    features: [
      "Stripe ticket checkout with webhooks, refunds and payouts",
      "Interactive seating chart builder and box office sales",
      "QR code ticket check-in for event night",
      "Ticket resale, bulk tickets and post-event surveys",
      "AWS migration: ECS Fargate, RDS Multi-AZ, CloudFront + WAF",
    ],
    tags: [
      { name: "CakePHP 5", color: "bg-red-50 text-red-700" },
      { name: "PHP", color: "bg-indigo-50 text-indigo-700" },
      { name: "MySQL", color: "bg-blue-50 text-blue-700" },
      { name: "Stripe", color: "bg-purple-50 text-purple-700" },
      { name: "AWS", color: "bg-yellow-50 text-yellow-700" },
    ],
    live: "https://go2fete.com/",
  },
  {
    id: "cruizegnd",
    title: "CruizeGND",
    image: "/images/cruizegnd.webp",
    alt: "Screenshot of the CruizeGND vehicle rental homepage",
    description:
      "A peer-to-peer vehicle rental marketplace for Grenada, with a web platform and an iOS/Android app.",
    longDescription:
      "CruizeGND lets people in Grenada rent vehicles from local hosts. Customers search by parish and date, view vehicles on a map, and book with or without an account. Vendors list and manage their own fleet, and admins run the platform. The CakePHP 5 backend serves both the website and a JWT-secured REST API used by the Ionic/Angular mobile app, which ships to iOS and Android with Capacitor. Payments run through Go2Pay (Stripe).",
    language: "PHP",
    year: "2026",
    status: "Live",
    features: [
      "Customer, vendor (host) and admin roles with policy-based authorization",
      "Vehicle search with filters, Leaflet maps and date booking",
      "JWT REST API powering an Ionic/Angular iOS + Android app",
      "Guest checkout and email code login",
      "Stripe-powered payments via Go2Pay",
    ],
    tags: [
      { name: "CakePHP 5", color: "bg-red-50 text-red-700" },
      { name: "Angular", color: "bg-pink-50 text-pink-700" },
      { name: "Ionic", color: "bg-blue-50 text-blue-700" },
      { name: "Capacitor", color: "bg-green-50 text-green-700" },
      { name: "REST API", color: "bg-yellow-50 text-yellow-700" },
    ],
    live: "https://www.cruizegnd.com/",
  },
];

/** sessionStorage key the card page sets so the portfolio highlights these projects on arrival. */
export const HIGHLIGHT_KEY = "highlight-featured-projects";

/**
 * sessionStorage key set by any visit to /card. The homepage only shows Client Work in a session
 * that came through the card, so it stays off the public front page (people searching your name
 * see the portfolio without it) while anyone you hand the card to still sees it.
 */
export const VIA_CARD_KEY = "arrived-via-card";
