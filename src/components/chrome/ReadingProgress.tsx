"use client";
import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div className="pointer-events-none fixed left-0 top-0 bottom-0 z-[60] w-[3px] bg-transparent hidden md:block">
      <div
        className="w-full bg-gradient-to-b from-vermilion to-vermilion/20 transition-[height] duration-200"
        style={{ height: `${p * 100}%`, boxShadow: p > 0.01 ? "0 0 8px var(--vermilion)" : "none" }}
      />
    </div>
  );
}
