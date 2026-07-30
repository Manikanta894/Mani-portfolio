"use client";
import { motion } from "motion/react";

export function SectionDivider() {
  return (
    <div className="relative h-24 sm:h-32 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vermilion/30 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 0.8, 0.22, 1] }}
        style={{ transformOrigin: "center" }}
      />
      <motion.div
        className="absolute left-1/2 top-2 -translate-x-1/2 text-[9px] font-mono uppercase tracking-[0.3em] text-vermilion/40"
        initial={{ opacity: 0, y: 4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        •
      </motion.div>
    </div>
  );
}
