export const site = {
  name: "Naveen Reddy Chirla",
  shortName: "Naveen",
  title: "Business Analyst & Builder",
  location: "London, UK",
  timezone: "GMT / BST",
  email: "9chirla@gmail.com",
  status: "Available for new projects",
  headline: "I turn operational data into decisions — and ship products when a spreadsheet isn’t enough.",
  github: "https://github.com/9chirla",
  linkedin: "https://www.linkedin.com/in/chirla",
  twitter: "https://x.com/9chirla",
};

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
] as const;

export const expertise = [
  {
    title: "Analytics",
    body: "Python, SQL, Power BI / Tableau, forecasting, segmentation, stakeholder reporting.",
  },
  {
    title: "Product engineering",
    body: "TypeScript, React, Next.js, Streamlit, offline-first / PWA patterns, REST APIs.",
  },
  {
    title: "Delivery",
    body: "GitHub Actions, Vercel, Render, Supabase, clear docs, CI, $0-stack pragmatism.",
  },
  {
    title: "Soft skills",
    body: "Stakeholder clarity, metric design, ruthless prioritization, writing that ships.",
  },
  {
    title: "Location",
    body: `${site.location} · ${site.timezone}`,
  },
  {
    title: "Focus",
    body: "BA / data roles where product sense and analytics meet.",
  },
] as const;

export type Project = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  github: string;
  live?: string;
};

export const projects: Project[] = [
  {
    id: "01",
    name: "Jacked",
    description:
      "Offline-first fitness PWA for rotating shifts. Sunday week planner, keypad logging, IndexedDB outbox sync, Supabase + Next.js.",
    tags: ["Next.js", "React", "Supabase", "PWA", "TypeScript"],
    github: "https://github.com/9chirla/jacked",
    live: "https://jacked-gold.vercel.app",
  },
  {
    id: "02",
    name: "Voyager AI",
    description:
      "Trip planner with a 10-step intake wizard and one streaming itinerary — day plan, packing checklist, downloadable notes.",
    tags: ["React", "Vite", "DeepSeek", "Express"],
    github: "https://github.com/9chirla/voyager-ai",
    live: "https://9chirla.github.io/voyager-ai/",
  },
  {
    id: "03",
    name: "Applylytics",
    description:
      "ATS scoring and AI coaching for CVs. Match score, missing keywords, hiring-manager feedback, downloadable Word CV.",
    tags: ["Python", "Streamlit", "Groq", "Render"],
    github: "https://github.com/9chirla/Applylytics",
  },
  {
    id: "04",
    name: "Bots Over Bosses",
    description:
      "Daily UK job search agent: Adzuna search, DeepSeek fit scoring, Telegram digest, tailored CV + cover letters to Drive.",
    tags: ["Python", "Telegram", "DeepSeek", "GitHub Actions"],
    github: "https://github.com/9chirla/bots-over-bosses",
  },
];

export const experience = [
  {
    role: "Graduate Success Analyst",
    org: "University context · London",
    period: "2024 — Present",
    detail:
      "Managing data and reporting for 1,600+ international graduates — clear metrics, honest tooling, phone-friendly workflows.",
  },
  {
    role: "MBA Candidate",
    org: "University of East London",
    period: "Jan 2024 — Aug 2025",
    detail:
      "Business strategy, analytics, and product thinking — shipping side projects that prove the stack under real constraints.",
  },
  {
    role: "BBA",
    org: "Aditya Global Business School",
    period: "Aug 2020 — Apr 2023",
    detail: "Foundations in business operations, finance, and quantitative analysis.",
  },
] as const;

/** Scroll sequence frame count — keep in sync with public/sequence */
export const SEQUENCE_FRAME_COUNT = 90;
