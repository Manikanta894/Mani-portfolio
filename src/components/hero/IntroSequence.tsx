"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import portraitImg from "@/assets/portrait.jpg";

const STORAGE_KEY = "mr_intro_seen";
const GREETINGS = ["HELLO", "ನಮಸ್ಕಾರ", "नमस्ते", "ഹലോ", "வணக்கம்"];

type Phase = "monogram" | "portrait" | "identity" | "transform";

export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("monogram");
  const [showSkip, setShowSkip] = useState(false);
  const [greetingIdx, setGreetingIdx] = useState(-1);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const finish = () => {
    timelineRef.current?.kill();
    localStorage.setItem(STORAGE_KEY, "1");
    setPhase("transform");
    setTimeout(onDone, 800);
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { finish(); return; }

    const tl = gsap.timeline({ paused: true });
    timelineRef.current = tl;

    // Show skip button
    tl.call(() => setShowSkip(true), null, 1);

    // Greetings stagger
    tl.call(() => setGreetingIdx(0), null, 0.3);
    for (let i = 1; i < GREETINGS.length; i++) {
      tl.call(() => setGreetingIdx(i), null, `+=0.09`);
    }
    tl.call(() => {}, null, "+=0.3");
    tl.call(() => setGreetingIdx(-1), null, "+=0");

    // Scene transitions
    tl.call(() => setPhase("portrait"), null, "+=0.2");
    tl.call(() => setPhase("identity"), null, "+=2.2");
    tl.call(() => setPhase("transform"), null, "+=1.8");

    // Final handoff
    tl.call(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      onDone();
    }, null, "+=1.5");

    tl.play();

    return () => { tl.kill(); };
  }, [onDone]);

  const isTransform = phase === "transform";

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "#F7F4EC" }}
        initial={{ opacity: 1 }}
        animate={isTransform ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        onClick={finish}
      >
        {/* MR Monogram — Scene 1 */}
        <AnimatePresence>
          {(phase === "monogram" || phase === "portrait") && (
            <motion.div
              className="absolute flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.2, scale: 0.5 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="font-display text-[clamp(6rem,14vw,12rem)] leading-none text-[#1E1E1E]"
                style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
              >
                MR
              </span>

              {/* Greetings */}
              <div className="flex flex-col items-center gap-1 mt-2">
                {GREETINGS.map((g, i) => (
                  <motion.span
                    key={g}
                    className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8A8578]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={greetingIdx >= i ? { opacity: greetingIdx === i ? 1 : 0.35, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                  >
                    {g}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Portrait — Scene 2 */}
        <AnimatePresence>
          {phase === "portrait" && (
            <motion.div
              className="absolute flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="relative"
                initial={{ scale: 0.94 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Cream ring border */}
                <div className="absolute -inset-[10px] rounded-full border-[10px] border-[#F7F4EC] shadow-[0_0_0_1px_rgba(30,30,30,0.06),0_12px_32px_-12px_rgba(0,0,0,0.15)]" />
                {/* Light sweep highlight */}
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none z-10 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.1 }}
                >
                  <motion.div
                    className="absolute w-[200%] h-1/3 bg-gradient-to-b from-white/25 to-transparent"
                    initial={{ top: "-33%", left: "-50%", rotate: 20 }}
                    animate={{ top: "133%" }}
                    transition={{ duration: 0.9, ease: [0.4, 0, 0.6, 1], delay: 0.35 }}
                  />
                </motion.div>
                <div className="relative w-[clamp(180px,22vw,240px)] h-[clamp(180px,22vw,240px)] rounded-full overflow-hidden">
                  <img src={portraitImg} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Identity — Scene 3 */}
        <AnimatePresence>
          {phase === "identity" && (
            <motion.div
              className="absolute flex flex-col items-center text-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.92] text-[#1E1E1E]"
                style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                Manikanta<span className="text-[#D9782E]">.</span>R
              </motion.h1>
              <motion.p
                className="mt-4 max-w-[48ch] text-[clamp(0.95rem,1.3vw,1.15rem)] text-[#8A8578]"
                style={{ fontFamily: "var(--font-display, 'Instrument Serif', serif)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
              >
                Building intelligent solutions where AI, Business Analytics and Human Insight come together.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip button */}
        <AnimatePresence>
          {showSkip && !isTransform && (
            <motion.button
              className="absolute bottom-8 right-8 px-4 py-2 rounded-full border border-[#1E1E1E]/15 text-[10px] font-mono uppercase tracking-[0.15em] text-[#8A8578] hover:text-[#1E1E1E] hover:border-[#1E1E1E]/30 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { e.stopPropagation(); finish(); }}
            >
              Skip Intro
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
