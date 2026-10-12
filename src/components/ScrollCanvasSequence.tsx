"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useImageSequence } from "@/hooks/useImageSequence";
import { SEQUENCE_FRAME_COUNT } from "@/lib/content";
import { cn } from "@/lib/utils";

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  const scale = Math.max(canvasW / iw, canvasH / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (canvasW - dw) / 2;
  const dy = (canvasH - dh) / 2;

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(img, dx, dy, dw, dh);
}

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function ScrollCanvasSequence({ className, children }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const { images, progress, ready, error } = useImageSequence(
    SEQUENCE_FRAME_COUNT,
    "/sequence",
  );

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.18, 0.42], [1, 0.55, 0]);
  const overlayY = useTransform(scrollYProgress, [0, 0.4], [0, -48]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const img = images[frameRef.current];
        if (img) drawCover(ctx, img, w, h);
      }
    };

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };

    resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [images, ready]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (!ready || images.length === 0) return;
      const idx = Math.min(
        SEQUENCE_FRAME_COUNT - 1,
        Math.max(0, Math.round(v * (SEQUENCE_FRAME_COUNT - 1))),
      );
      if (idx === frameRef.current) return;
      frameRef.current = idx;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = images[idx];
        if (!canvas || !ctx || !img) return;
        const { w, h } = sizeRef.current;
        drawCover(ctx, img, w, h);
      });
    });

    return () => {
      unsub();
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, images, ready]);

  return (
    <section
      ref={trackRef}
      className={cn("relative h-[420vh]", className)}
      aria-label="Scroll-driven visual sequence"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden
        />

        {!ready && !error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/80">
            <div className="h-px w-40 overflow-hidden rounded bg-white/10">
              <div
                className="h-full bg-[#c3fa08] transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
              Loading sequence {progress}%
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
            <p className="text-sm text-zinc-400">Visual sequence unavailable</p>
          </div>
        )}

        <motion.div
          style={{ opacity: overlayOpacity, y: overlayY }}
          className="pointer-events-none absolute inset-0 z-10 flex items-end"
        >
          <div className="pointer-events-auto w-full px-6 pb-16 md:px-12 md:pb-24">
            {children}
          </div>
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] to-transparent"
        />
      </div>
    </section>
  );
}
