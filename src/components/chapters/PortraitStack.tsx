"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import portrait from "@/assets/portrait.jpg";

export function PortraitStack() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [10, -10]);
  const ry = useTransform(mx, [-0.5, 0.5], [-14, 14]);
  const srx = useSpring(rx, { stiffness: 120, damping: 14 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14 });

  // Floating card parallax offsets
  const cardA = useTransform(mx, [-0.5, 0.5], [-22, 22]);
  const cardB = useTransform(my, [-0.5, 0.5], [-18, 18]);
  const cardC = useTransform(mx, [-0.5, 0.5], [18, -18]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto aspect-[3/4] w-full max-w-[320px]"
      style={{ perspective: 1200 }}
    >
      {/* Photo card with 3D tilt */}
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-sm border border-bone/20 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
          style={{ transform: "translateZ(0px)" }}
        >
          <img
            src={portrait}
            alt="Portrait of Manikanta R"
            width={896}
            height={1216}
            className="h-full w-full object-cover"
            style={{ filter: "grayscale(15%) contrast(1.05)" }}
          />
          {/* Edge highlight */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-bone/10" />
          {/* Frame stamp */}
          <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-center justify-between text-mono text-eyebrow text-bone/80">
            <span>MR · 2026</span>
            <span className="text-vermilion">● live</span>
          </div>
        </div>

        {/* Floating card 1 — Role */}
        <motion.div
          style={{ x: cardA, translateZ: 60 }}
          className="absolute -left-10 top-6 hidden rounded-sm border border-bone/25 bg-ink/85 px-3 py-2 text-mono text-eyebrow leading-tight text-bone shadow-2xl backdrop-blur md:block"
        >
          <div className="text-bone/50">role</div>
          <div className="mt-0.5 text-bone">HR · Analytics</div>
        </motion.div>

        {/* Floating card 2 — Location */}
        <motion.div
          style={{ y: cardB, translateZ: 80 }}
          className="absolute -right-12 top-1/3 hidden rounded-sm border border-bone/25 bg-bone/95 px-3 py-2 text-mono text-eyebrow leading-tight text-ink shadow-2xl md:block"
        >
          <div className="text-ink/50">based in</div>
          <div className="mt-0.5">Bengaluru · IN</div>
        </motion.div>

        {/* Floating card 3 — Stat */}
        <motion.div
          style={{ x: cardC, translateZ: 50 }}
          className="absolute -bottom-6 -left-6 hidden rounded-sm border border-vermilion/40 bg-ink/85 px-3 py-2 text-mono text-eyebrow leading-tight text-bone shadow-2xl backdrop-blur md:block"
        >
          <div className="text-vermilion">04 papers</div>
          <div className="mt-0.5 text-bone/60">IJIRT · SSRN</div>
        </motion.div>

        {/* Floating card 4 — Available */}
        <motion.div
          style={{ y: cardA, translateZ: 70 }}
          className="absolute -right-6 bottom-4 hidden items-center gap-1.5 rounded-full border border-bone/25 bg-bone/95 px-3 py-1.5 text-mono text-eyebrow text-ink shadow-2xl md:inline-flex"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-vermilion pulse-dot" />
          Available
        </motion.div>
      </motion.div>

      {/* Shadow plate */}
      <div
        className="pointer-events-none absolute inset-x-6 -bottom-4 h-6 rounded-full bg-ink/40 blur-xl"
        aria-hidden
      />
    </div>
  );
}
