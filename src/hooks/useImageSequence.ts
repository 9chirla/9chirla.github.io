"use client";

import { useEffect, useState } from "react";

type SequenceState = {
  images: HTMLImageElement[];
  progress: number;
  ready: boolean;
  error: string | null;
};

function framePath(folderPath: string, index: number) {
  const n = String(index + 1).padStart(3, "0");
  const base = folderPath.endsWith("/") ? folderPath.slice(0, -1) : folderPath;
  return `${base}/frame_${n}.webp`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export function useImageSequence(frameCount: number, folderPath = "/sequence") {
  const [state, setState] = useState<SequenceState>({
    images: [],
    progress: 0,
    ready: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(frameCount);

    async function run() {
      let loaded = 0;
      try {
        // Load in parallel batches to avoid saturating the network
        const batchSize = 12;
        for (let start = 0; start < frameCount; start += batchSize) {
          if (cancelled) return;
          const slice = Array.from(
            { length: Math.min(batchSize, frameCount - start) },
            (_, i) => start + i,
          );
          const batch = await Promise.all(
            slice.map(async (index) => {
              const img = await loadImage(framePath(folderPath, index));
              images[index] = img;
              loaded += 1;
              if (!cancelled) {
                setState((prev) => ({
                  ...prev,
                  progress: Math.round((loaded / frameCount) * 100),
                }));
              }
              return img;
            }),
          );
          void batch;
        }

        if (!cancelled) {
          setState({
            images: images.slice(),
            progress: 100,
            ready: true,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            error: err instanceof Error ? err.message : "Sequence load failed",
          }));
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [frameCount, folderPath]);

  return state;
}
