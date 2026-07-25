"use client";
import { useEffect, useState } from "react";
import usePortfolio from "@/hooks/usePortfolio";

const FALLBACK_SECTIONS = [
  { id: "cover", n: "00", label: "Home" },
  { id: "about", n: "01", label: "About" },
  { id: "education", n: "02", label: "Education" },
  { id: "experience", n: "03", label: "Experience" },
];

export function ChapterRail() {
  const { navigationItems } = usePortfolio();
  const sections = navigationItems?.length > 0
    ? navigationItems.map((ni: any) => ({ id: ni.section_id, n: ni.n || "00", label: ni.label }))
    : FALLBACK_SECTIONS;

  const [active, setActive] = useState("cover");
  useEffect(() => {
    const elements = sections
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    elements.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Chapters"
      className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 md:block"
    >
      <ul className="flex flex-col gap-2.5">
        {sections.map((c) => {
          const on = active === c.id;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-label={`Chapter ${c.n} ${c.label}`}
                className="group flex items-center gap-2 text-mono text-eyebrow mix-blend-difference text-bone"
              >
                <span
                  className={`block h-px transition-all duration-500 ${
                    on ? "w-8 bg-current" : "w-3 bg-current/40 group-hover:w-5"
                  }`}
                />
                <span
                  className={`tabular-nums transition-opacity duration-500 ${
                    on ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                  }`}
                >
                  {c.n} · {c.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const fmt = new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });
      setTime(fmt.format(d));
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="fixed bottom-4 left-4 z-40 text-mono text-eyebrow text-bone mix-blend-difference tabular-nums">
      IST · {time || "—"}
    </div>
  );
}

export function CornerStamp() {
  return (
    <div className="fixed bottom-4 right-4 z-40 text-mono text-eyebrow text-bone mix-blend-difference">
      Portfolio
    </div>
  );
}
