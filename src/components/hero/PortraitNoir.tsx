"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import portraitMeta from "@/assets/manikanta-portrait.asset.json";

const PORTRAIT_URL = portraitMeta.url;

export function PortraitNoir({ visible }: { visible: boolean }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [8, -8]);
  const ry = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const srx = useSpring(rx, { stiffness: 90, damping: 16 });
  const sry = useSpring(ry, { stiffness: 90, damping: 16 });
  const glowX = useTransform(mx, [-0.5, 0.5], ["35%", "65%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["35%", "65%"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full"
      style={{
        perspective: 1400,
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : 40}px)`,
        transition: "opacity 1.1s cubic-bezier(.2,1,.3,1) .4s, transform 1.1s cubic-bezier(.2,1,.3,1) .4s",
      }}
      ref={useRef<HTMLDivElement>(null)}
    >
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="relative mx-auto aspect-[3/4] w-full max-w-[380px]"
      >
        {/* Ember rim glow behind portrait */}
        <div
          className="absolute -inset-12 -z-10 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(143,164,190,0.45) 0%, rgba(143,164,190,0.15) 35%, transparent 70%)",
          }}
        />

        {/* Portrait cutout */}
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            borderRadius: "2px",
            boxShadow:
              "0 40px 100px -20px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,210,180,0.08)",
            transform: "translateZ(20px)",
          }}
        >
          <img
            src={PORTRAIT_URL}
            alt="Manikanta R"
            className="h-full w-full object-cover"
            style={{
              filter: "contrast(1.08) saturate(0.85) brightness(0.95)",
            }}
          />
          {/* Mouse-tracked ember spotlight */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background: useTransform(
                [glowX, glowY] as never,
                ([x, y]: string[]) =>
                  `radial-gradient(circle at ${x} ${y}, rgba(255,180,130,0.25) 0%, transparent 45%)`
              ),
              mixBlendMode: "screen",
            }}
          />
          {/* Top duotone wash for editorial mood */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(143,164,190,0.18) 0%, rgba(10,12,16,0) 35%, rgba(10,12,16,0.55) 100%)",
              mixBlendMode: "multiply",
            }}
          />
          {/* Edge vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow:
                "inset 0 0 80px 10px rgba(10,12,16,0.65), inset 0 0 2px rgba(255,210,180,0.25)",
            }}
          />
          {/* Frame stamp */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between text-eyebrow uppercase" style={{ fontFamily: '"JetBrains Mono", monospace', letterSpacing: "0.3em", color: "rgba(220,225,232,0.7)" }}>
            <span>MR</span>
            <span style={{ color: "rgba(143,164,190,1)" }}>● 35°N · 77°E</span>
          </div>
        </div>

        {/* Floating identity tag — top right */}
        <motion.div
          style={{ x: useTransform(mx, [-0.5, 0.5], [-14, 14]), translateZ: 80 }}
          className="absolute -right-6 top-8 hidden md:block"
        >
          <div
            className="px-3 py-2 text-eyebrow uppercase backdrop-blur"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: "0.3em",
              background: "rgba(20,12,15,0.85)",
              border: "1px solid rgba(255,210,180,0.18)",
              color: "rgba(220,225,232,0.85)",
              boxShadow: "0 20px 50px -10px rgba(0,0,0,0.7)",
            }}
          >
            <div style={{ color: "rgba(143,164,190,1)" }}>04 / papers</div>
            <div className="mt-1 opacity-60">IJIRT · SSRN</div>
          </div>
        </motion.div>

        {/* Floating chip — bottom left */}
        <motion.div
          style={{ y: useTransform(my, [-0.5, 0.5], [-12, 12]), translateZ: 60 }}
          className="absolute -left-8 bottom-12 hidden md:block"
        >
          <div
            className="px-3 py-2 text-eyebrow uppercase"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: "0.3em",
              background: "rgba(245,243,238,0.95)",
              color: "rgba(10,12,16,0.9)",
              boxShadow: "0 20px 50px -10px rgba(143,164,190,0.4)",
            }}
          >
            <div className="opacity-50">mba '27</div>
            <div className="mt-1 font-medium">HR · Analytics</div>
          </div>
        </motion.div>

        {/* Available pill — bottom right */}
        <motion.div
          style={{ x: useTransform(mx, [-0.5, 0.5], [12, -12]), translateZ: 70 }}
          className="absolute -right-4 -bottom-4 hidden md:inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-eyebrow uppercase"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: "0.35em",
              background: "rgba(20,12,15,0.92)",
              border: "1px solid rgba(143,164,190,0.5)",
              color: "rgba(220,225,232,0.95)",
              boxShadow: "0 0 30px rgba(143,164,190,0.5)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full pulse-dot"
              style={{ background: "rgba(143,164,190,1)", boxShadow: "0 0 10px rgba(143,164,190,1)" }}
            />
            available
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
