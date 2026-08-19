"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

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
  { id: "voices", label: "Voices", n: "11" },
];

export function PremiumNav({ onRecruiterToggle }: { onRecruiterToggle?: () => void }) {
  const { profile } = usePortfolio();
  const name = profile?.name || "Manikanta R";

  const [active, setActive] = useState("cover");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; setScrolled(window.scrollY > 60); }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

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

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const activeIdx = ITEMS.findIndex((i) => i.id === active);

  return (
    <>
      {/* Top Header */}
      <header className={`toc-head ${scrolled ? "is-scrolled" : ""}`}>
        <div className="toc-head__inner">
          <button onClick={() => jump("cover")} className="toc-head__brand">
            <span className="toc-head__mono">MR</span>
            <span className="toc-head__name">{name}</span>
          </button>
          <div className="toc-head__right">
            <a href="https://manikantar.in/resume.pdf" target="_blank" rel="noopener noreferrer" className="toc-head__resume">Resume</a>
            <button onClick={() => setOverlayOpen(true)} className="toc-head__btn" title="⌘K">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
            </button>
            {onRecruiterToggle && (
              <button onClick={onRecruiterToggle} className="toc-head__btn" title="Recruiter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
              </button>
            )}
            <button onClick={() => setMobileOpen(true)} className="toc-head__btn md:hidden" aria-label="Menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* LEFT RAIL — Premium Sidebar */}
      <aside className="toc-rail hidden lg:flex" aria-label="Table of Contents">
        <div className="toc-rail__panel">
          {/* Header */}
          <div className="toc-rail__header">
            <span className="toc-rail__title">CONTENTS</span>
            <span className="toc-rail__count">{ITEMS.length} chapters</span>
          </div>

          {/* Reading progress bar */}
          <div className="toc-rail__progress-track">
            <motion.div className="toc-rail__progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>

          {/* Nav items */}
          <nav className="toc-rail__nav">
            {ITEMS.map((it, i) => {
              const on = active === it.id;
              const past = activeIdx > i;
              return (
                <motion.a
                  key={it.id}
                  href={`#${it.id}`}
                  onClick={(e) => { e.preventDefault(); jump(it.id); }}
                  className={`toc-rail__item ${on ? "is-active" : ""} ${past ? "is-past" : ""}`}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Accent bar — slides with active */}
                  {on && (
                    <motion.span
                      className="toc-rail__accent"
                      layoutId="toc-accent"
                      transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    />
                  )}
                  <span className="toc-rail__n">{it.n}</span>
                  <span className="toc-rail__label">{it.label}</span>
                </motion.a>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="toc-rail__footer">
            <span className="toc-rail__updated">Updated 2026</span>
            <span className="toc-rail__edition">Edition 01</span>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-[200] flex bg-[#111]/95 backdrop-blur-2xl lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)}>
            <motion.div className="w-full max-w-sm mx-auto my-auto px-10 py-12" initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }} onClick={(e) => e.stopPropagation()}>
              <div className="text-[0.7rem] uppercase tracking-[0.22em] font-mono text-[#8A8578] mb-2">CONTENTS</div>
              <div className="text-[0.65rem] font-mono text-[#8A8578]/40 mb-8">{ITEMS.length} chapters</div>
              {ITEMS.map((it, i) => {
                const on = active === it.id;
                return (
                  <motion.button
                    key={it.id}
                    onClick={() => jump(it.id)}
                    className={`w-full flex items-center gap-4 py-4 text-left border-b border-white/8 ${on ? "text-[#D9782E]" : "text-white/60"}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <span className="text-sm font-mono tabular-nums text-white/35 w-8">{it.n}</span>
                    <span className="text-lg">{it.label}</span>
                    {on && <span className="ml-auto w-2 h-2 rounded-full bg-[#D9782E]" />}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⌘K */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#111]/85 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOverlayOpen(false)}>
            <motion.div className="w-full max-w-md mx-4 rounded-3xl bg-[#F7F4EC] p-6 shadow-2xl" initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/4 border border-black/8 mb-4">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black/25"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
                <span className="text-sm text-black/35 font-mono">Navigate to...</span>
                <span className="ml-auto text-[10px] font-mono text-black/20">esc</span>
              </div>
              {ITEMS.map((it) => (
                <button key={it.id} onClick={() => jump(it.id)} className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-black/4 transition-colors text-left">
                  <span className="w-8 h-8 rounded-xl bg-[#D9782E]/10 flex items-center justify-center text-[#D9782E] font-mono text-[10px] font-bold">{it.n}</span>
                  <span className="text-base font-medium text-[#111]">{it.label}</span>
                  <span className="ml-auto text-xs font-mono text-black/20">→</span>
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
.toc-head { position: fixed; top: 0; left: 0; right: 0; z-index: 80; padding: 12px 20px; transition: all 0.4s ease; mix-blend-mode: difference; }
.toc-head__inner { display: flex; align-items: center; justify-content: space-between; max-width: 1400px; margin: 0 auto; }
.toc-head__brand { display: flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; color: #fff; }
.toc-head__mono { font-family: var(--font-display); font-size: 22px; line-height: 1; }
.toc-head__name { font-size: 13px; font-weight: 500; opacity: 0.7; }
.toc-head__right { display: flex; align-items: center; gap: 8px; }
.toc-head__resume { padding: 6px 14px; border-radius: 10px; background: var(--vermilion); color: #fff; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; }
.toc-head__btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #fff; cursor: pointer; transition: all 0.2s; }
.toc-head__btn:hover { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.12); }
.toc-head.is-scrolled { background: color-mix(in oklab, var(--bone) 65%, transparent); backdrop-filter: blur(14px); border-bottom: 1px solid color-mix(in oklab, var(--ink) 5%, transparent); padding: 8px 20px; mix-blend-mode: normal; color: var(--ink); }

/* ── Sidebar Panel ── */
.toc-rail { position: fixed; left: 16px; top: 50%; transform: translateY(-50%); z-index: 70; }
.toc-rail__panel {
  width: 180px;
  padding: 20px 16px;
  border-radius: 20px;
  background: color-mix(in oklab, var(--bone) 45%, transparent);
  border: 1px solid color-mix(in oklab, var(--ink) 6%, transparent);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 1px 0 rgba(255,255,255,0.3) inset, 0 4px 20px -8px rgba(0,0,0,0.05);
}
.toc-rail__header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; padding: 0 4px; }
.toc-rail__title { font-family: var(--font-mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.22em; color: color-mix(in oklab, var(--ink) 30%, transparent); font-weight: 600; }
.toc-rail__count { font-family: var(--font-mono); font-size: 9px; color: color-mix(in oklab, var(--ink) 20%, transparent); }
.toc-rail__progress-track { height: 1.5px; background: color-mix(in oklab, var(--ink) 6%, transparent); border-radius: 2px; margin-bottom: 16px; overflow: hidden; }
.toc-rail__progress-fill { height: 100%; background: linear-gradient(to right, var(--vermilion), color-mix(in oklab, var(--vermilion) 60%, transparent)); border-radius: 2px; transition: width 0.15s linear; }
.toc-rail__nav { display: flex; flex-direction: column; gap: 1px; }
.toc-rail__item {
  position: relative; display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 10px; text-decoration: none;
  color: color-mix(in oklab, var(--ink) 35%, transparent);
  font-family: var(--font-sans); font-size: 13px; font-weight: 400; letter-spacing: 0.01em;
  transition: color 0.25s ease, background 0.25s ease;
}
.toc-rail__item:hover { color: var(--ink); background: color-mix(in oklab, var(--ink) 3%, transparent); }
.toc-rail__item.is-active { color: var(--ink); font-weight: 600; font-size: 14px; }
.toc-rail__item.is-past { color: color-mix(in oklab, var(--ink) 50%, transparent); }
.toc-rail__n { font-family: var(--font-mono); font-size: 10px; font-weight: 600; color: var(--vermilion); opacity: 0.45; min-width: 18px; text-align: right; transition: opacity 0.25s; }
.toc-rail__item:hover .toc-rail__n { opacity: 0.65; }
.toc-rail__item.is-active .toc-rail__n { opacity: 1; font-size: 11px; }
.toc-rail__accent { position: absolute; left: 0; top: 6px; bottom: 6px; width: 2.5px; border-radius: 3px; background: var(--vermilion); box-shadow: 0 0 8px color-mix(in oklab, var(--vermilion) 40%, transparent); }
.toc-rail__footer { margin-top: 14px; padding-top: 10px; border-top: 1px solid color-mix(in oklab, var(--ink) 6%, transparent); display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 8px; color: color-mix(in oklab, var(--ink) 18%, transparent); }
`;
