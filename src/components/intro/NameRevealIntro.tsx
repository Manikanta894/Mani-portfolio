"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import portraitImg from "@/assets/portrait.jpg";

type Stage = "name" | "pull" | "reveal" | "welcome" | "exit";

const spring = { type: "spring" as const, stiffness: 260, damping: 22 };

export function NameRevealIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<Stage>("name");

  const finish = useCallback(() => {
    setStage("exit");
  }, []);

  useEffect(() => {
    if (stage === "exit") {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
  }, [stage, onComplete]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("pull"), 500);
    const t2 = setTimeout(() => setStage("reveal"), 900);
    const t3 = setTimeout(() => setStage("welcome"), 1400);
    const t4 = setTimeout(() => finish(), 2500);

    const skip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", skip);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      window.removeEventListener("keydown", skip);
    };
  }, [finish]);

  const exited = stage === "exit";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-8 bg-[#0a0a0c] select-none cursor-pointer"
      onClick={() => finish()}
      animate={exited ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 0.8, 0.22, 1] }}
    >
      {/* Skip hint */}
      <motion.span
        className="absolute top-6 right-6 text-bone/20 text-xs tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={exited ? { opacity: 0 } : { opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        Press Esc to skip
      </motion.span>

      <div className="relative flex items-baseline">
        {/* MANIKANTA */}
        <motion.span
          className="font-light tracking-[-0.03em] text-bone"
          style={{ fontSize: "clamp(2.2rem, 4.2vw, 3rem)" }}
          initial={{ opacity: 0, x: 20 }}
          animate={exited ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          MANIKANTA
        </motion.span>

        {/* Gap where R was / photo appears */}
        <span className="relative inline-flex items-center justify-center" style={{ width: "clamp(80px, 10vw, 110px)", height: "clamp(80px, 10vw, 110px)", marginLeft: "clamp(4px, 0.6vw, 10px)" }}>
          {/* Invisible spacer to maintain layout */}
          <span className="invisible font-light" style={{ fontSize: "clamp(2.2rem, 4.2vw, 3rem)" }}>R</span>

          {/* The R letter — fades out during pull */}
          <AnimatePresence>
            {["name", "pull"].includes(stage) && !exited && (
              <motion.span
                className="absolute inset-0 flex items-center justify-center font-light text-bone"
                style={{ fontSize: "clamp(2.2rem, 4.2vw, 3rem)", letterSpacing: "-0.03em" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  stage === "pull"
                    ? { opacity: 1, scale: 1.25, zIndex: 10 }
                    : { opacity: 1, scale: 1 }
                }
                exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.3 } }}
                transition={{ duration: 0.4 }}
              >
                R
              </motion.span>
            )}
          </AnimatePresence>

          {/* Circular frame — appears in place of R */}
          <AnimatePresence>
            {["reveal", "welcome"].includes(stage) && !exited && (
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden border-2 z-20"
                style={{ borderColor: "var(--vermilion)", boxShadow: "0 0 32px rgba(212,106,46,0.2), 0 0 0 4px rgba(212,106,46,0.08)" }}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1.15, opacity: 1 }}
                exit={{ scale: 1.3, opacity: 0, transition: { duration: 0.35 } }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.img
                  src={portraitImg}
                  alt=""
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2, filter: "brightness(1.4)" }}
                  animate={{ scale: 1, filter: "brightness(1)" }}
                  transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </span>
      </div>

      {/* Welcome text */}
      <AnimatePresence>
        {stage === "welcome" && !exited && (
          <motion.p
            className="text-bone/50 text-sm tracking-[0.3em] uppercase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, ease: [0.22, 0.8, 0.22, 1] }}
          >
            Welcome to my portfolio
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
