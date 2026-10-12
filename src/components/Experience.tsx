"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/content";

export function Experience() {
  return (
    <section id="experience" className="relative scroll-mt-24 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-[0.22em] text-[#c3fa08] uppercase"
        >
          Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-3 text-3xl font-semibold tracking-tight text-[#fafafa] sm:text-5xl"
        >
          Path so far
        </motion.h2>

        <ol className="relative mt-14 space-y-0 border-l border-white/10 pl-8">
          {experience.map((item, i) => (
            <motion.li
              key={item.role}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative pb-12 last:pb-0"
            >
              <span className="absolute top-1.5 -left-[2.15rem] flex h-3 w-3 items-center justify-center">
                <span className="absolute h-3 w-3 rounded-full bg-[#c3fa08]/30" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#c3fa08]" />
              </span>
              <p className="font-mono text-xs tracking-wide text-zinc-500">{item.period}</p>
              <h3 className="mt-1 text-lg font-semibold text-[#fafafa]">{item.role}</h3>
              <p className="text-sm text-[#c3fa08]/90">{item.org}</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
                {item.detail}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
