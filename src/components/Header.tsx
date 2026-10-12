"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navLinks, site } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <div
        className={cn(
          "flex w-full max-w-5xl items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur-md transition-colors duration-300",
          scrolled
            ? "border-white/10 bg-black/55"
            : "border-white/10 bg-black/40",
        )}
      >
        <a
          href="#top"
          className="text-sm font-medium tracking-tight text-[#fafafa] transition hover:text-white"
        >
          {site.shortName}
          <span className="text-[#c3fa08]">.</span>
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition hover:text-[#fafafa]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#fafafa] transition hover:border-[#c3fa08]/40 hover:bg-[#c3fa08]/10"
        >
          Contact
        </a>
      </div>
    </motion.header>
  );
}
