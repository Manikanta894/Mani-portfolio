"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const SECTIONS = [
  { id: "cover", label: "Cover", n: "00" },
  { id: "about", label: "Journey", n: "01" },
  { id: "about", label: "About", n: "01" },
  { id: "education", label: "Education", n: "02" },
  { id: "experience", label: "Experience", n: "03" },
  { id: "work", label: "Projects", n: "04" },
  { id: "ecosystem", label: "Skills", n: "05" },
  { id: "research", label: "Research", n: "06" },
  { id: "credentials", label: "Credentials", n: "07" },
  { id: "philosophy", label: "Manifesto", n: "08" },
  { id: "linkedin", label: "Connect", n: "09" },
  { id: "beyond-notes", label: "Beyond", n: "10" },
];

// Deduplicate: Journey and About both point to #about but we show only one label
const ITEMS = [
  { id: "about", label: "Journey", n: "01" },
  { id: "education", label: "Education", n: "02" },
  { id: "experience", label: "Experience", n: "03" },
  { id: "work", label: "Projects", n: "04" },
  { id: "ecosystem", label: "Skills", n: "05" },
  { id: "research", label: "Research", n: "06" },
  { id: "credentials", label: "Credentials", n: "07" },
  { id: "philosophy", label: "Manifesto", n: "08" },
  { id: "linkedin", label: "Connect", n: "09" },
  { id: "beyond-notes", label: "Beyond", n: "10" },
];

export function PremiumNav({ onRecruiterToggle }: { onRecruiterToggle?: () => void }) {
  const { profile } = usePortfolio();
  const name = profile?.name || "Manikanta R";

  const [active, setActive] = useState("cover");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  /* Scroll state */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; setScrolled(window.scrollY > 60); }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  /* Scrollspy */
  useEffect(() => {
    const ids = [...ITEMS.map((i) => i.id), "cover"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const e of entries) { if (e.isIntersecting && (!best || e.intersectionRatio > best.ratio)) best = { id: e.target.id, ratio: e.intersectionRatio }; }
        if (best) setActive(best.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ⌘K */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOverlayOpen((v) => !v); }
      if (e.key === "Escape") { setOverlayOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: "smooth" });
    history.replaceState?.(null, "", `#${id}`);
    setActive(id);
    setMobileOpen(false);
    setOverlayOpen(false);
  };

  return (
    <>
      {/* Top Header — minimal */}
      <header className={`mr-head ${scrolled ? "is-scrolled" : ""}`}>
        <div className="mr-head__inner">
          <button onClick={() => jump("cover")} className="mr-head__brand">
            <span className="mr-head__mono">MR</span>
            <span className="mr-head__name">{name}</span>
          </button>
          <div className="mr-head__right">
            <a href="https://manikantar.in/resume.pdf" target="_blank" rel="noopener noreferrer" className="mr-head__resume">
              Resume
            </a>
            <button onClick={() => setOverlayOpen(true)} className="mr-head__cmd" title="⌘K">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
            </button>
            {onRecruiterToggle && (
              <button onClick={onRecruiterToggle} className="mr-head__recruiter" title="Recruiter View">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
              </button>
            )}
            <button onClick={() => setMobileOpen(true)} className="mr-head__burger md:hidden" aria-label="Menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Left Rail — Desktop Table of Contents */}
      <nav className="mr-rail hidden md:flex" aria-label="Table of Contents">
        <div className="mr-rail__inner">
          <div className="mr-rail__label">Contents</div>
          {ITEMS.map((it) => {
            const on = active === it.id;
            return (
              <motion.a
                key={it.id}
                href={`#${it.id}`}
                onClick={(e) => { e.preventDefault(); jump(it.id); }}
                className={`mr-rail__item ${on ? "is-active" : ""}`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <span className="mr-rail__n">{it.n}</span>
                <span className="mr-rail__label">{it.label}</span>
                {on && <motion.span className="mr-rail__bar" layoutId="rail-bar" transition={{ type: "spring", stiffness: 400, damping: 28 }} />}
              </motion.a>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[200] flex bg-ink/90 backdrop-blur-xl md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}>
            <motion.div className="w-full max-w-sm mx-auto my-auto px-8 py-12" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }} onClick={(e) => e.stopPropagation()}>
              <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-bone/40 mb-8">Table of Contents</div>
              {ITEMS.map((it, i) => {
                const on = active === it.id;
                return (
                  <motion.button
                    key={it.id}
                    onClick={() => jump(it.id)}
                    className={`w-full flex items-center gap-4 py-4 text-left border-b border-bone/8 ${on ? "text-vermilion" : "text-bone/70"}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <span className="text-[14px] font-mono tabular-nums text-bone/50 w-8">{it.n}</span>
                    <span className="text-lg">{it.label}</span>
                    {on && <span className="ml-auto w-2 h-2 rounded-full bg-vermilion" />}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⌘K Overlay */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/80 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOverlayOpen(false)}>
            <motion.div className="w-full max-w-md mx-4 rounded-3xl bg-bone p-6 shadow-2xl" initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-ink/5 border border-ink/10 mb-4">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink/30"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
                <span className="text-sm text-ink/40 font-mono">Navigate to...</span>
                <span className="ml-auto text-[10px] font-mono text-ink/25">esc</span>
              </div>
              {ITEMS.map((it) => (
                <button key={it.id} onClick={() => jump(it.id)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-ink/5 transition-colors text-left">
                  <span className="w-8 h-8 rounded-xl bg-vermilion/10 flex items-center justify-center text-vermilion font-mono text-[10px] font-bold">{it.n}</span>
                  <span className="text-base font-medium text-ink">{it.label}</span>
                  <span className="ml-auto text-xs font-mono text-ink/25">→</span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{css}</style>
    </>
  );
}

const css = `
/* ── Header ── */
.mr-head { position: fixed; top: 0; left: 0; right: 0; z-index: 80; padding: 12px 20px; transition: all 0.4s ease; mix-blend-mode: difference; color: #fff; }
.mr-head.is-scrolled { background: color-mix(in oklab, var(--bone) 60%, transparent); backdrop-filter: blur(12px); border-bottom: 1px solid color-mix(in oklab, var(--ink) 6%, transparent); padding: 8px 20px; mix-blend-mode: normal; color: var(--ink); }
.mr-head__inner { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; }
.mr-head__brand { display: flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; font-family: var(--font-sans); color: inherit; }
.mr-head__mono { font-family: var(--font-display); font-size: 20px; line-height: 1; color: inherit; }
.mr-head__name { font-size: 13px; font-weight: 500; opacity: 0.7; color: inherit; }
.mr-head__right { display: flex; align-items: center; gap: 10px; }
.mr-head__resume { padding: 6px 14px; border-radius: 10px; background: var(--vermilion); color: #fff; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; transition: all 0.2s ease; }
.mr-head__resume:hover { background: color-mix(in oklab, var(--vermilion) 90%, #000); }
.mr-head__cmd, .mr-head__recruiter, .mr-head__burger { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #fff; cursor: pointer; transition: all 0.2s ease; }
.mr-head__cmd:hover, .mr-head__recruiter:hover, .mr-head__burger:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.15); }

/* ── Left Rail ── */
.mr-rail { position: fixed; left: 20px; top: 50%; transform: translateY(-50%); z-index: 70; flex-direction: column; mix-blend-mode: difference; }
.mr-rail__inner { display: flex; flex-direction: column; gap: 2px; }
.mr-rail__label { font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); margin-bottom: 8px; padding-left: 2px; }
.mr-rail__item { position: relative; display: flex; align-items: center; gap: 10px; padding: 5px 10px; border-radius: 8px; text-decoration: none; color: rgba(255,255,255,0.5); font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.04em; transition: color 0.25s ease; white-space: nowrap; }
.mr-rail__item:hover { color: rgba(255,255,255,0.9); }
.mr-rail__item.is-active { color: rgba(255,255,255,0.95); font-weight: 600; }
.mr-rail__n { font-size: 9.5px; font-weight: 600; color: var(--vermilion); opacity: 0.5; min-width: 16px; text-align: right; }
.mr-rail__item.is-active .mr-rail__n { opacity: 1; }
.mr-rail__label { font-size: 10.5px; }
.mr-rail__bar { position: absolute; left: 0; top: 4px; bottom: 4px; width: 2px; border-radius: 2px; background: var(--vermilion); }
`;
