"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const ITEMS = [
  { id: "about", label: "Journey" },
  { id: "experience", label: "Experience" },
  { id: "research", label: "Research" },
  { id: "work", label: "Projects" },
  { id: "linkedin", label: "Contact" },
] as const;

export function PremiumNav({ onRecruiterToggle }: { onRecruiterToggle?: () => void }) {
  const [active, setActive] = useState("cover");
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    const reveal = () => setVisible(true);
    window.addEventListener("mr-hero-entered", reveal as EventListener);
    let raf = 0;
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; if (window.scrollY > 120) reveal(); }); };
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
    const ids = ITEMS.map((c) => c.id);
    ids.push("cover");
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const e of entries) { if (e.isIntersecting && (!best || e.intersectionRatio > best.ratio)) best = { id: e.target.id, ratio: e.intersectionRatio }; }
        if (best) setActive(best.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOverlayOpen((v) => !v); }
      if (e.key === "Escape") setOverlayOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    history.replaceState?.(null, "", `#${id}`);
    setActive(id);
    setOverlayOpen(false);
  };

  const overlayItems = [
    ...ITEMS.map((i) => ({ id: i.id, label: i.label })),
    { id: "ecosystem", label: "Skills" },
    { id: "credentials", label: "Credentials" },
  ];

  return (
    <>
      <motion.nav className={`mr-dock ${scrolled ? "is-scrolled" : ""} ${visible ? "is-visible" : ""}`}>
        <div className="mr-dock__inner">
          {ITEMS.map((it) => {
            const on = active === it.id;
            return (
              <motion.a key={it.id} href={`#${it.id}`} onClick={jump(it.id)} className={`mr-dock__item ${on ? "is-active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                {on && <motion.span className="mr-dock__pill" layoutId="nav-pill" transition={{ type: "spring", stiffness: 380, damping: 26 }} />}
                <span className="mr-dock__label">{it.label}</span>
                {on && <motion.span className="mr-dock__dot" layoutId="nav-dot" />}
              </motion.a>
            );
          })}
          <span className="mr-dock__sep" />
          <motion.a href="https://manikantar.in/resume.pdf" target="_blank" rel="noopener noreferrer" className="mr-dock__resume" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1v9m0 0L3 6m4 4l4-4M1 13h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="round"/></svg>
            <span className="mr-dock__resume-label">Resume</span>
          </motion.a>
          {onRecruiterToggle && (
            <motion.button onClick={onRecruiterToggle} className="mr-dock__recruiter" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
            </motion.button>
          )}
        </div>
      </motion.nav>

      <AnimatePresence>
        {overlayOpen && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/80 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOverlayOpen(false)}>
            <motion.div className="w-full max-w-md mx-4 rounded-3xl bg-bone p-6 shadow-2xl" initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-ink/5 border border-ink/10 mb-4">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink/30"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
                <span className="text-sm text-ink/40 font-mono">Navigate to...</span>
                <span className="ml-auto text-[10px] font-mono text-ink/25">esc</span>
              </div>
              {overlayItems.map((it) => (
                <button key={it.id} onClick={jump(it.id)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-ink/5 transition-colors text-left">
                  <span className="w-8 h-8 rounded-xl bg-vermilion/10 flex items-center justify-center text-vermilion font-mono text-[10px] font-bold">{it.label.charAt(0)}</span>
                  <span className="text-base font-medium text-ink">{it.label}</span>
                  <span className="ml-auto text-xs font-mono text-ink/25">→</span>
                </button>
              ))}
              <div className="mt-3 pt-3 border-t border-ink/8 text-center text-[10px] font-mono text-ink/25">
                <kbd className="px-1.5 py-0.5 rounded bg-ink/5 border border-ink/10">⌘K</kbd> to toggle
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{dockCSS}</style>
    </>
  );
}

const dockCSS = `
.mr-dock { position: fixed; top: 22px; left: 50%; transform: translateX(-50%); z-index: 90; opacity: 0; pointer-events: none; transition: opacity 0.5s ease, top 0.4s ease; }
.mr-dock.is-visible { opacity: 1; pointer-events: auto; }
.mr-dock.is-scrolled { top: 10px; }
.mr-dock.is-scrolled .mr-dock__inner { gap: 4px; padding: 4px 8px; }
.mr-dock.is-scrolled .mr-dock__item { padding: 6px 14px; font-size: 12px; }
.mr-dock.is-scrolled .mr-dock__resume { padding: 6px 12px; font-size: 11px; }
.mr-dock.is-scrolled .mr-dock__sep { height: 18px; margin: 0 1px; }
.mr-dock__inner { display: flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 20px; background: color-mix(in oklab, var(--bone) 52%, transparent); border: 1px solid color-mix(in oklab, var(--ink) 7%, transparent); backdrop-filter: blur(24px) saturate(150%); -webkit-backdrop-filter: blur(24px) saturate(150%); box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 4px 20px -8px rgba(0,0,0,0.06); transition: all 0.4s ease; }
.mr-dock__item { position: relative; display: flex; align-items: center; justify-content: center; padding: 7px 16px; border-radius: 14px; text-decoration: none; color: color-mix(in oklab, var(--ink) 48%, transparent); font-family: var(--font-sans); font-size: 13px; font-weight: 500; letter-spacing: 0.01em; transition: color 0.25s ease; white-space: nowrap; }
.mr-dock__item:hover { color: var(--ink); }
.mr-dock__item.is-active { color: var(--ink); }
.mr-dock__label { position: relative; z-index: 1; }
.mr-dock__pill { position: absolute; inset: 0; border-radius: inherit; background: color-mix(in oklab, var(--ink) 5%, transparent); border: 1px solid color-mix(in oklab, var(--ink) 8%, transparent); box-shadow: 0 1px 0 rgba(255,255,255,0.3) inset; }
.mr-dock__dot { position: absolute; bottom: 3px; left: 50%; margin-left: -2px; width: 4px; height: 4px; border-radius: 50%; background: var(--vermilion); }
.mr-dock__sep { width: 1px; height: 22px; margin: 0 4px; background: color-mix(in oklab, var(--ink) 12%, transparent); border-radius: 1px; transition: all 0.4s ease; }
.mr-dock__resume { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 14px; background: var(--vermilion); color: #fff; font-family: var(--font-sans); font-size: 12px; font-weight: 500; letter-spacing: 0.02em; text-decoration: none; transition: all 0.25s ease; }
.mr-dock__resume-label { white-space: nowrap; }
.mr-dock__recruiter { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 12px; border: none; background: color-mix(in oklab, var(--ink) 6%, transparent); color: color-mix(in oklab, var(--ink) 40%, transparent); cursor: pointer; transition: all 0.25s ease; }
.mr-dock__recruiter:hover { background: color-mix(in oklab, var(--ink) 12%, transparent); color: var(--ink); }
@media (max-width: 640px) { .mr-dock__resume-label { display: none; } .mr-dock__item { padding: 6px 10px; font-size: 12px; } .mr-dock__inner { gap: 2px; padding: 4px 6px; border-radius: 16px; } }
`;
