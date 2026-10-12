"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { site } from "@/lib/content";

export function HeroOverlay() {
  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c3fa08] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c3fa08]" />
        </span>
        {site.status}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mt-6 font-mono text-xs tracking-[0.22em] text-zinc-500 uppercase"
      >
        {site.title} · {site.location}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-[#fafafa] sm:text-6xl md:text-7xl"
      >
        {site.name.split(" ").slice(0, -1).join(" ")}{" "}
        <em className="not-italic text-[#c3fa08]">
          {site.name.split(" ").slice(-1)}
        </em>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg"
      >
        {site.headline}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="mt-8 flex flex-wrap items-center gap-3"
      >
        <a
          href="#projects"
          className="inline-flex items-center gap-2 rounded-full bg-[#c3fa08] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d4ff3a]"
        >
          View work
        </a>
        <a
          href="/resume.pdf"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-[#fafafa] transition hover:border-white/30"
        >
          Resume
        </a>
        <span className="ml-1 inline-flex items-center gap-1.5 text-xs text-zinc-500">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          Scroll to play
        </span>
      </motion.div>
    </div>
  );
}
