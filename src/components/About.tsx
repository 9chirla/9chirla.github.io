"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { expertise } from "@/lib/content";

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="font-mono text-xs tracking-[0.22em] text-[#c3fa08] uppercase"
        >
          About
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 0.05 }}
          className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-[#fafafa] sm:text-5xl"
        >
          Analyst who ships
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400"
        >
          Completing an MBA at the University of East London while working in graduate
          success analytics — managing data for 1,600+ international graduates. Clear
          metrics, honest tooling, products people can use on a phone with bad signal.
        </motion.p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition hover:border-white/15 hover:bg-white/[0.05]"
            >
              <h3 className="text-sm font-medium text-[#fafafa]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08]"
        >
          <Image
            src="/portrait.jpg"
            alt="Portrait of Naveen Reddy Chirla"
            width={1200}
            height={750}
            className="h-auto w-full object-cover object-top sm:max-h-[420px]"
            priority={false}
          />
          <figcaption className="border-t border-white/[0.08] bg-black/40 px-5 py-3 text-xs text-zinc-500">
            MBA candidate · Business Analyst · London
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
