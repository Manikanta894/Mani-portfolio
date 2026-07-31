"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

type Item = { id: string; label: string; n: string };

const FALLBACK_ITEMS: Item[] = [
  { id: "cover", label: "Home", n: "00" },
  { id: "about", label: "About", n: "01" },
  { id: "education", label: "Edu", n: "02" },
  { id: "experience", label: "Exp", n: "03" },
  { id: "work", label: "Work", n: "04" },
  { id: "ecosystem", label: "Skills", n: "05" },
  { id: "research", label: "Rsch", n: "06" },
  { id: "credentials", label: "Certs", n: "07" },
  { id: "philosophy", label: "MFST", n: "08" },
  { id: "linkedin", label: "Connect", n: "09" },
  { id: "beyond-me", label: "Beyond", n: "10" },
];

export function PremiumNav({ onRecruiterToggle }: { onRecruiterToggle?: () => void }) {
  const { navigationItems } = usePortfolio();
  const navItems: Item[] = navigationItems?.length > 0
    ? navigationItems.filter((ni: any) => ni.section_id !== "contact").map((ni: any) => ({ id: ni.section_id, label: ni.label, n: ni.n || "00" }))
    : FALLBACK_ITEMS;

  const [active, setActive] = useState("cover");
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const reveal = () => setVisible(true);
    window.addEventListener("mr-hero-entered", reveal as EventListener);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; if (window.scrollY > 120) reveal(); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("mr-hero-entered", reveal as EventListener); window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; setScrolled(window.scrollY > 80); }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const sections = navItems.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const e of entries) { if (e.isIntersecting && (!best || e.intersectionRatio > best.ratio)) best = { id: e.target.id, ratio: e.intersectionRatio }; }
        if (best) setActive((prev) => (prev === best!.id ? prev : best!.id));
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [navItems]);

  const onJump = useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const navEl = document.querySelector(".mr-nav") as HTMLElement | null;
    const offset = navEl ? navEl.getBoundingClientRect().bottom + 12 : 24;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    if (history.replaceState) history.replaceState(null, "", `#${id}`);
    setActive(id);
  }, []);

  return (
    <>
      <motion.nav
        aria-label="Primary"
        className={`mr-nav ${scrolled ? "is-scrolled" : ""} ${visible ? "is-visible" : "is-hidden"}`}
      >
        <div className="mr-nav__inner">
          <ul ref={listRef} className="mr-nav__list">
            {navItems.map((it) => (
              <li key={it.id}>
                <motion.a
                  href={`#${it.id}`}
                  onClick={onJump(it.id)}
                  className={`mr-nav__link ${active === it.id ? "is-active" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="mr-nav__n">{it.n}</span>
                  <span className="mr-nav__label">{it.label}</span>
                  {active === it.id && (
                    <motion.span className="mr-nav__dot" layoutId="nav-dot" transition={{ type: "spring", stiffness: 400, damping: 28 }} />
                  )}
                </motion.a>
              </li>
            ))}
          </ul>

          <div className="mr-nav__actions">
            <motion.a
              href="https://manikantar.in/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-nav__resume"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M7 1v9m0 0L3 6m4 4l4-4M1 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="round"/></svg>
              <span>Resume</span>
            </motion.a>
            {onRecruiterToggle && (
              <motion.button onClick={onRecruiterToggle} className="mr-nav__recruiter" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} title="Recruiter View (Ctrl+K)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      <style>{css}</style>
    </>
  );
}

const css = `
.mr-nav {
  position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 80;
  opacity: 0; pointer-events: none;
  transition: opacity 0.5s ease, transform 0.5s ease, top 0.4s ease;
}
.mr-nav.is-visible { opacity: 1; pointer-events: auto; }
.mr-nav.is-scrolled { top: 10px; }
.mr-nav.is-scrolled .mr-nav__inner { padding: 4px 6px; gap: 10px; }
.mr-nav.is-scrolled .mr-nav__n { font-size: 10px; }
.mr-nav.is-scrolled .mr-nav__label { font-size: 10px; }
.mr-nav.is-scrolled .mr-nav__link { padding: 4px 10px; gap: 5px; }
.mr-nav.is-scrolled .mr-nav__resume { font-size: 9px; padding: 4px 10px; }
.mr-nav__inner {
  display: flex; align-items: center; gap: 14px;
  padding: 5px 8px;
  border-radius: 16px;
  background: color-mix(in oklab, var(--bone) 55%, transparent);
  border: 1px solid color-mix(in oklab, var(--ink) 8%, transparent);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 4px 16px -6px rgba(0,0,0,0.08);
  transition: all 0.4s ease;
}
.mr-nav__list {
  display: flex; align-items: center; gap: 2px;
  list-style: none; margin: 0; padding: 0;
}
.mr-nav__link {
  position: relative;
  display: flex; align-items: center; gap: 6px;
  padding: 5px 11px; border-radius: 12px;
  text-decoration: none; color: color-mix(in oklab, var(--ink) 55%, transparent);
  font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.04em;
  transition: color 0.25s ease;
}
.mr-nav__link:hover { color: var(--ink); }
.mr-nav__link.is-active { color: var(--ink); }
.mr-nav__n { font-size: 10.5px; font-weight: 600; color: var(--vermilion); opacity: 0.6; transition: opacity 0.25s ease, font-size 0.4s ease; }
.mr-nav__link.is-active .mr-nav__n { opacity: 1; }
.mr-nav__label { font-size: 10.5px; transition: font-size 0.4s ease; }
.mr-nav__dot {
  position: absolute; bottom: 2px; left: 50%; margin-left: -2px;
  width: 4px; height: 4px; border-radius: 50%; background: var(--vermilion);
}
.mr-nav__actions { display: flex; align-items: center; gap: 6px; }
.mr-nav__resume {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 12px;
  background: var(--vermilion); color: #fff;
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em;
  text-transform: uppercase; text-decoration: none;
  transition: all 0.25s ease;
}
.mr-nav__recruiter {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 10px; border: none;
  background: color-mix(in oklab, var(--ink) 8%, transparent);
  color: color-mix(in oklab, var(--ink) 50%, transparent);
  cursor: pointer; transition: all 0.25s ease;
}
.mr-nav__recruiter:hover { background: color-mix(in oklab, var(--ink) 14%, transparent); color: var(--ink); }

@media (max-width: 768px) {
  .mr-nav__label { display: none; }
  .mr-nav__inner { padding: 4px 6px; gap: 4px; border-radius: 14px; }
  .mr-nav__link { padding: 6px 8px; }
  .mr-nav__resume span { display: none; }
}
`;
