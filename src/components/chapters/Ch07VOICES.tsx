"use client";

import { useState, useMemo, useObserver } from "react";
import { motion, AnimatePresence } from "motion/react";

type Testimonial = {
  id: string;
  category: string;
  name: string;
  designation: string;
  organization: string;
  quote: string;
  linkedin?: string;
  image?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "deeksha-shetty",
    category: "RESEARCH & ACADEMIC",
    name: "Prof. Deeksha Shetty",
    designation: "Professor",
    organization: "",
    quote:
      "Reading Manikanta's paper gave me a deep insight into his behavioural patterns and way of thinking. At times I felt emotionally overwhelmed, yet proud of the human ability to rise against circumstances. His work reflects human hope and the remarkable strength that can emerge from adversity. The story of his mother, in particular, is deeply moving — a reminder that strength is not always defined by formal education, but by the courage to protect a family and continue moving forward against all odds.",
    linkedin: "",
    image: "",
  },
];

/* ─── Visual constants ──────────────────────────────────────────── */
const BG = "#F8F5EF";
const TEXT = "#111111";
const ACCENT = "#D97732";

/* ─── Animated entry ─────────────────────────────────────────────── */
function FadeUp({ children, delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ delay, duration: 500, ease: [0.22, 1, 0.36, 1] }}
      className="whitespace-break-all"
    >
      {children}
    </motion.div>
  );
}

/* ─── TestimonialCard ──────────────────────────────────────────── */
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group rounded-xl border-t border-b border-b/[0.1] border-l border-b/[0.1] border-t border-t/[0.1] bg-white/[0.02] hover:border-white/[0.06] transition-colors duration-300"
      style={{ background: "color-mix(in oklab, var(--background) 5%, transparent)" }}
    >
      <div className="p-6 pt-2">
        {/* Category label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D97732]/60">{testimonial.category}</span>
        </div>

        {/* Quote */}
        <p className="text-[20px] leading-relaxed text-[#111111] break-normal">
          "{testimonial.quote}"
        </p>

        {/* Person details */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-[14px] font-medium text-[#111111]">{testimonial.name}</span>
          {testimonial.designation && (
            <span className="text-[12px] text-[#666] ml-1">• {testimonial.designation}</span>
          )}
          {testimonial.organization && (
            <span className="text-[11px] text-[#777] ml-1">• {testimonial.organization}</span>
          )}
        </div>

        {/* LinkedIn link */}
        {testimonial.linkedin && (
          <div className="mt-3">
            <a
              href={testimonial.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#D97732] hover:underline"
            >
              View LinkedIn →
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Section ──────────────────────────────────────────────────── */
export function Ch07VOICES() {
  const { profile } = usePortfolio();

  return (
    <section
      id="voices"
      className="relative bg-[color-mix(in oklab, var(--background) 95%, var(--bg))] text-[color-mix(in oklab, var(--text) 30%, var(--bg))]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* LEFT SIDE: Heading */}
          <div>
            <h2 className="font-display text-[clamp(2.8rem,6vw,3.4rem)] leading-[1.1] text-[#111111] md:text-[3.4rem]">
              WHAT PEOPLE WHO'VE WORKED WITH ME HAVE NOTICED.
            </h2>
            <p className="mt-4 text-[15px] text-[#444] leading-relaxed">
              A collection of reflections from professors, mentors and professionals
              who have experienced my work, leadership, research and contribution
              first-hand.
            </p>
          </div>

          {/* RIGHT SIDE: Testimonials */}
          <div className="space-y-6">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard testimonial={t} key={t.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}