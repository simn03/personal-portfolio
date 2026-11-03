import { ItemType } from "../../app/lib/Definitions";

/**
 * Work history, newest first. `description[0]` is the role line; the rest are
 * the bullets. `project` points a role at its card in the Projects section.
 */
export const workItems: ItemType[] = [
  {
    // Ongoing, with no start date: the card reads simply "Present".
    images: ["/work/wyndo/logo.png"],
    title: "Wyndo",
    badge: "Startup",
    project: "wyndo",
    metadata: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    description: [
      "Co-founder & Software Engineer",
      "Building a CRM for businesses that sell made-to-order products, starting with window manufacturers.",
      "Covers the whole sales process, from customers and quotes to orders, documents and email.",
      "Own the technical side end to end: product design, architecture, and getting it running in production.",
    ],
  },
  {
    startDate: "2026-01-09",
    endDate: "2026-08-24",
    images: ["/work/broadcom/logo.svg"],
    title: "Broadcom",
    url: "https://www.broadcom.com/info/api-management/api-management-unlock",
    metadata: ["Java", "Spring", "React", "TypeScript", "Go", "Kubernetes", "Playwright"],
    description: [
      "Software Engineer Co-op — Layer7 API Management",
      "Worked across the full stack of a multi-tenant API platform: Java and Spring services, a React front end, and Kubernetes deployments.",
      "Hardened authentication and input parsing across the platform.",
      "Built API revision history with filtering and side-by-side comparison.",
      "Helped grow and restructure the end-to-end test suite.",
    ],
  },
  {
    startDate: "2024-10-01",
    endDate: "2025-11-01",
    title: "LeaserFlow",
    badge: "Freelance",
    project: "leaserflow",
    url: "https://leaserflow.com",
    metadata: ["TypeScript", "React", "MySQL", "AWS"],
    description: [
      "Full-Stack Developer",
      "Designed and built a web app that an equipment-leasing brokerage uses to manage applications and send them to lenders.",
      "Handled the whole build, from the database and API to hosting on AWS.",
    ],
  },
  {
    startDate: "2024-04-28",
    endDate: "2024-12-31",
    images: ["/work/ontraccr/logo.png"],
    title: "Ontraccr",
    metadata: ["MySQL", "JavaScript", "React", "React Native", "hapi.js", "knex.js", "AWS Lambda"],
    url: "https://www.ontraccr.com/",
    description: [
      "Full-Stack Web Developer Co-op",
      "Exponentially improved page loading times through file downloading optimizations on both web and mobile platforms.",
      "Used AWS lambda to create image thumbnails to reduce file size and improve loading times.",
      "Improved user workflow by implementing inline editing of all table data types on both web and mobile platforms.",
      "Implemented data exports by refactoring and transitioning the existing data export system to the backend",
    ],
  },
];
