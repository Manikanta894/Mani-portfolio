"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import portraitImg from "@/assets/portrait.jpg";

const STORAGE_KEY = "mr_intro_seen";
const GREETINGS = ["HELLO", "ನಮಸ್ಕಾರ", "नमस्ते", "ഹലೋ", "வணக்கம்"];

type Scene = "monogram" | "portrait" | "identity" | "transform";

export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [scene, setScene] = useState<Scene>("monogram");
  const [greetingIdx, setGreetingIdx] = useState(-1);
  const [mEntered, setMEntered] = useState(false);
  const [rEntered, setREntered] = useState(false);
  const [bloomVisible, setBloomVisible] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const finish = useCallback(() => {
    tlRef.current?.kill();
    localStorage.setItem(STORAGE_KEY, "1");
    setScene("transform");
    setTimeout(onDone, 800);
  }, [onDone]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { finish(); return; }

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    // M enters at 0s
    tl.call(() => setMEntered(true), null, 0);
    // R enters 120ms after M
    tl.call(() => setREntered(true), null, 0.12);
    // Bloom pulse when they meet
    tl.call(() => setBloomVisible(true), null, 0.5);
    tl.call(() => setBloomVisible(false), null, 0.9);

    // Greetings stagger — starts after letters settle
    tl.call(() => setGreetingIdx(0), null, 1.0);
    for (let i = 1; i < GREETINGS.length; i++) {
      tl.call(() => setGreetingIdx(i), null, `+=0.14`);
    }
    tl.call(() => setGreetingIdx(-1), null, "+=0.35");

    // Scene transitions
    tl.call(() => setScene("portrait"), null, "+=0.2");
    tl.call(() => setScene("identity"), null, "+=2.2");
    tl.call(() => setScene("transform"), null, "+=2.0");

    // Skip button
    tl.call(() => setShowSkip(true), null, 1.0);

    // Final handoff
    tl.call(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      onDone();
    }, null, "+=1.5");

    tl.play();
    return () => { tl.kill(); };
  }, [finish, onDone]);

  const exiting = scene === "transform";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: "#F7F4EC" }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={finish}
    >
      {/* ─── Scene 1: MR Monogram + Greetings ─── */}
      <AnimatePresence>
        {(scene === "monogram" || scene === "portrait") && (
          <motion.div className="absolute flex flex-col items-center gap-8" exit={{ opacity: 0.15, scale: 0.45, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }}>
            {/* M + R letters */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* M from left */}
              <motion.span
                className="font-display text-[clamp(6rem,14vw,12rem)] leading-none text-[#1E1E1E]"
                style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
                initial={{ opacity: 0, x: -28, filter: "blur(6px)" }}
                animate={mEntered ? { opacity: 1, x: 0, filter: "blur(0px)", scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >M</motion.span>

              {/* R from right */}
              <motion.span
                className="font-display text-[clamp(6rem,14vw,12rem)] leading-none text-[#1E1E1E]"
                style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
                initial={{ opacity: 0, x: 28, filter: "blur(6px)" }}
                animate={rEntered ? { opacity: 1, x: 0, filter: "blur(0px)", scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >R</motion.span>
            </div>

            {/* Light-bloom pulse */}
            <AnimatePresence>
              {bloomVisible && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ width: "clamp(300px, 40vw, 500px)", height: "clamp(300px, 40vw, 500px)", background: "radial-gradient(circle, rgba(217,120,46,0.15) 0%, transparent 60%)", borderRadius: "50%" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </AnimatePresence>

            {/* Greetings — large, flowing */}
            <motion.div className="flex flex-col items-center gap-2 mt-4">
              {GREETINGS.map((g, i) => {
                const isCurrent = greetingIdx === i;
                const isPast = greetingIdx > i;
                return (
                  <motion.span
                    key={g}
                    className="font-mono uppercase tracking-[0.2em] select-none"
                    style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: greetingIdx === -1 ? 0 : isCurrent ? 1 : isPast ? 0.35 : 0,
                      y: greetingIdx === -1 ? 12 : isPast ? 0 : 0,
                      color: isCurrent ? "#1E1E1E" : "#8A8578",
                    }}
                    transition={{ duration: 0.3 }}
                  >{g}</motion.span>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Scene 2: Portrait ─── */}
      <AnimatePresence>
        {scene === "portrait" && (
          <motion.div className="absolute flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <motion.div className="relative" initial={{ scale: 0.94 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              <div className="absolute -inset-[10px] rounded-full border-[10px] border-[#F7F4EC] shadow-[0_0_0_1px_rgba(30,30,30,0.06),0_12px_32px_-12px_rgba(0,0,0,0.15)]" />
              <motion.div className="absolute inset-0 rounded-full pointer-events-none z-10 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <motion.div className="absolute w-[200%] h-1/3 bg-gradient-to-b from-white/25 to-transparent"
                  initial={{ top: "-33%", left: "-50%", rotate: 22 }}
                  animate={{ top: "133%" }}
                  transition={{ duration: 0.9, ease: [0.4, 0, 0.6, 1], delay: 0.4 }}
                />
              </motion.div>
              <div className="relative w-[clamp(190px,24vw,260px)] h-[clamp(190px,24vw,260px)] rounded-full overflow-hidden">
                <img src={portraitImg} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.08)]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Scene 3: Identity — clip-path reveal ─── */}
      <AnimatePresence>
        {scene === "identity" && (
          <motion.div className="absolute flex flex-col items-center text-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {/* Name — clip-path reveal left→right */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] text-[#1E1E1E] whitespace-nowrap"
                style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Manikanta<span className="text-[#D9782E]">.</span>R
              </motion.h1>
            </div>

            {/* Accent dot bloom */}
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#D9782E] my-4"
              initial={{ opacity: 0, scale: 0, boxShadow: "0 0 0 0 rgba(217,120,46,0)" }}
              animate={{ opacity: 1, scale: 1, boxShadow: ["0 0 0 0 rgba(217,120,46,0)", "0 0 0 12px rgba(217,120,46,0.15)", "0 0 0 0 rgba(217,120,46,0)"] }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1], boxShadow: { delay: 0.3, duration: 0.8 } }}
            />

            {/* Tagline */}
            <motion.p
              className="mt-2 max-w-[52ch] text-[clamp(1rem,1.4vw,1.2rem)] text-[#8A8578]"
              style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Building intelligent solutions where AI, Business Analytics and Human Insight come together.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Skip button ─── */}
      <AnimatePresence>
        {showSkip && !exiting && (
          <motion.button
            className="absolute bottom-8 right-8 px-4 py-2 rounded-full border border-[#1E1E1E]/12 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8A8578] hover:text-[#1E1E1E] hover:border-[#1E1E1E]/25 transition-colors"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { e.stopPropagation(); finish(); }}
          >Skip Intro</motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
