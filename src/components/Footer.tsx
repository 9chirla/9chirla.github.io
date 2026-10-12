"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Github, Linkedin, Twitter } from "lucide-react";
import { site } from "@/lib/content";

export function Footer() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  }

  return (
    <footer id="contact" className="relative scroll-mt-24 px-6 pt-28 pb-10 md:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent px-8 py-14 text-center backdrop-blur-md md:px-16"
        >
          <p className="font-mono text-xs tracking-[0.22em] text-[#c3fa08] uppercase">
            Contact
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#fafafa] sm:text-5xl">
            Let&apos;s build something extraordinary together
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            Open to Business Analyst / Data Analyst roles where product sense and analytics meet.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => void copyEmail()}
              className="inline-flex items-center gap-2 rounded-full bg-[#c3fa08] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d4ff3a]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : site.email}
            </button>
            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-[#fafafa] transition hover:border-white/30"
            >
              Resume PDF
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 p-2.5 text-zinc-400 transition hover:border-white/25 hover:text-[#fafafa]"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 p-2.5 text-zinc-400 transition hover:border-white/25 hover:text-[#fafafa]"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={site.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 p-2.5 text-zinc-400 transition hover:border-white/25 hover:text-[#fafafa]"
              aria-label="X / Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <a href={site.github} className="transition hover:text-zinc-400">
            github.com/9chirla
          </a>
        </div>
      </div>
    </footer>
  );
}
