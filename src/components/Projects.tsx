"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/lib/content";

export function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-[0.22em] text-[#c3fa08] uppercase"
        >
          Projects
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-3 text-3xl font-semibold tracking-tight text-[#fafafa] sm:text-5xl"
        >
          Selected work
        </motion.h2>
        <p className="mt-4 max-w-xl text-zinc-400">
          Public repos I’m actively shipping — product apps and automation, not demo notebooks.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
              style={{ transformPerspective: 800 }}
              className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-md transition hover:border-[#c3fa08]/30"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs text-zinc-500">{project.id}</span>
                <div className="flex items-center gap-2">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 p-2 text-zinc-400 transition hover:border-white/25 hover:text-[#fafafa]"
                    aria-label={`${project.name} on GitHub`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  {project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/10 p-2 text-zinc-400 transition hover:border-[#c3fa08]/40 hover:text-[#c3fa08]"
                      aria-label={`${project.name} live site`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#fafafa]">
                {project.name}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] tracking-wide text-zinc-500 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
