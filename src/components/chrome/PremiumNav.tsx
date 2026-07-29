"use client";
import { useEffect, useRef, useState } from "react";
import usePortfolio from "@/hooks/usePortfolio";

/**
 * PremiumNav — floating glass pill (desktop) + bottom floating bar (mobile).
 * Tracks the active chapter via IntersectionObserver and animates a soft
 * highlight pill behind the active item. Items come from Supabase via usePortfolio.
 */

type Item = { id: string; label: string; n: string };

const FALLBACK_ITEMS: Item[] = [
  { id: "cover",      label: "Home",        n: "00" },
  { id: "about",      label: "About",       n: "01" },
  { id: "education",  label: "Education",   n: "02" },
  { id: "experience", label: "Experience",  n: "03" },
  { id: "work",       label: "Projects",    n: "04" },
  { id: "ecosystem",  label: "Skills",      n: "05" },
  { id: "research",   label: "Research",    n: "06" },
  { id: "credentials",label: "Credentials", n: "07" },
  { id: "philosophy", label: "Manifesto",   n: "08" },
  { id: "linkedin",   label: "Connect",     n: "09" },
  { id: "beyond-me",  label: "Beyond",      n: "10" },
];

export function PremiumNav() {
  const { navigationItems } = usePortfolio();
  const navItems: Item[] = navigationItems?.length > 0
    ? navigationItems
        .filter((ni: any) => ni.section_id !== "contact")
        .map((ni: any) => ({
        id: ni.section_id,
        label: ni.label,
        n: ni.n || "00",
      }))
    : FALLBACK_ITEMS;

  const [active, setActive] = useState<string>("cover");
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const mobileListRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0, width: 0, ready: false,
  });
  const [mPill, setMPill] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0, width: 0, ready: false,
  });

  // Mount only after the hero intro completes (or user scrolls past the cover).
  useEffect(() => {
    const reveal = () => setVisible(true);
    window.addEventListener("mr-hero-entered", reveal as EventListener);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (window.scrollY > 120) reveal();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mr-hero-entered", reveal as EventListener);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll state for stronger glass once the user leaves the cover (rAF throttled)
  useEffect(() => {
    let raf = 0;
    let last = false;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = window.scrollY > 80;
        if (next !== last) {
          last = next;
          setScrolled(next);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Chapter tracking — coalesce updates to avoid mid-scroll flicker.
  useEffect(() => {
    const sections = navItems
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const ratio = e.intersectionRatio;
          if (!best || ratio > best.ratio) best = { id: e.target.id, ratio };
        }
        if (best) {
          const id = best.id;
          setActive((prev) => (prev === id ? prev : id));
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [navItems]);

  // Move the highlight pill under the active item
  const recalcPill = () => {
    const idx = navItems.findIndex((i) => i.id === active);
    const ul = listRef.current;
    if (ul) {
      const li = ul.querySelectorAll("li")[idx] as HTMLElement | undefined;
      if (li) {
        const ulRect = ul.getBoundingClientRect();
        const r = li.getBoundingClientRect();
        const next = { left: r.left - ulRect.left, width: r.width, ready: true };
        setPill((prev) =>
          prev.ready && Math.abs(prev.left - next.left) < 0.5 && Math.abs(prev.width - next.width) < 0.5
            ? prev
            : next
        );
      }
    }
    const mul = mobileListRef.current;
    if (mul) {
      const li = mul.querySelectorAll("li")[idx] as HTMLElement | undefined;
      if (li) {
        const ulRect = mul.getBoundingClientRect();
        const r = li.getBoundingClientRect();
        const next = { left: r.left - ulRect.left, width: r.width, ready: true };
        setMPill((prev) =>
          prev.ready && Math.abs(prev.left - next.left) < 0.5 && Math.abs(prev.width - next.width) < 0.5
            ? prev
            : next
        );
      }
    }
  };
  useEffect(() => {
    recalcPill();
    const r1 = requestAnimationFrame(recalcPill);
    const t = window.setTimeout(recalcPill, 240);

    const onR = () => recalcPill();
    window.addEventListener("resize", onR);

    const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts;
    fonts?.ready?.then(recalcPill).catch(() => {});

    return () => {
      window.removeEventListener("resize", onR);
      cancelAnimationFrame(r1);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, visible, navItems]);

  const onJump = (id: string) => (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const navEl = document.querySelector(".mr-nav") as HTMLElement | null;
    const navOffset = navEl ? navEl.getBoundingClientRect().bottom + 12 : 24;
    const top =
      target.getBoundingClientRect().top + window.scrollY - navOffset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReduced ? "auto" : "smooth",
    });

    if (history.replaceState) {
      history.replaceState(null, "", `#${id}`);
    }

    const prevTabIndex = target.getAttribute("tabindex");
    if (prevTabIndex === null) target.setAttribute("tabindex", "-1");
    window.setTimeout(() => {
      target.focus({ preventScroll: true });
      window.dispatchEvent(
        new CustomEvent("mr-nav-jump", { detail: { id } })
      );
    }, prefersReduced ? 0 : 60);

    setActive(id);
  };

  const activeIdx = Math.max(0, navItems.findIndex((i) => i.id === active));
  const activeItem = navItems[activeIdx];

  return (
    <>
      <nav
        aria-label="Primary"
        aria-hidden={!visible}
        className={`mr-nav ${scrolled ? "is-scrolled" : ""} ${visible ? "is-visible" : "is-hidden"}`}
      >
        <div className="mr-nav__brand" aria-hidden>
          <span className="mr-nav__logo" aria-hidden>
            <svg viewBox="0 0 28 28" fill="none" className="h-full w-full">
              <rect x="1" y="1" width="26" height="26" rx="6" stroke="currentColor" strokeWidth="1.4" opacity="0.3" />
              <path d="M8 20V8h3.5l5.5 8V8H20v12h-3.5L11 12v8H8z" fill="currentColor" opacity="0.85" />
            </svg>
          </span>
          <span className="mr-nav__chapter-num tabular-nums">{activeItem?.n}</span>
          <span className="mr-nav__chapter-sep" />
          <span className="mr-nav__chapter-name">{activeItem?.label}</span>
        </div>
        <ul ref={listRef} className="mr-nav__list">
          <span
            className={`mr-nav__pill ${pill.ready ? "is-ready" : ""}`}
            aria-hidden
            style={{
              transform: `translate3d(${pill.left}px, 0, 0)`,
              width: `${pill.width}px`,
              opacity: pill.ready ? 1 : 0,
            }}
          />
          {navItems.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={onJump(it.id)}
                aria-current={active === it.id ? "true" : undefined}
                className={`mr-nav__link ${active === it.id ? "is-active" : ""}`}
              >
                <span className="mr-nav__link-n tabular-nums" aria-hidden>{it.n}</span>
                <span className="mr-nav__link-label">{it.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="https://manikantar.in/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-nav__resume"
          aria-label="Download Resume"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 1v9m0 0L3 6m4 4l4-4M1 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="round" />
          </svg>
          <span>Resume</span>
        </a>
      </nav>

      <LiveAnnouncer navItems={navItems} />

      <nav aria-label="Primary mobile" aria-hidden={!visible} className={`mr-nav-mobile ${visible ? "is-visible" : "is-hidden"}`}>
        <ul ref={mobileListRef} className="mr-nav-mobile__list">
          <span
            className={`mr-nav-mobile__pill ${mPill.ready ? "is-ready" : ""}`}
            aria-hidden
            style={{
              transform: `translate3d(${mPill.left}px, 0, 0)`,
              width: `${mPill.width}px`,
              opacity: mPill.ready ? 1 : 0,
            }}
          />
          {navItems.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={onJump(it.id)}
                aria-current={active === it.id ? "true" : undefined}
                className={`mr-nav-mobile__link ${active === it.id ? "is-active" : ""}`}
                title={it.label}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="https://manikantar.in/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-nav-mobile__resume"
          aria-label="Download Resume"
          title="Resume"
        >
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 1v9m0 0L3 6m4 4l4-4M1 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="round" />
          </svg>
        </a>
      </nav>

      <style>{css}</style>
    </>
  );
}

function LiveAnnouncer({ navItems }: { navItems: Item[] }) {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const onJump = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      const label = navItems.find((i) => i.id === id)?.label;
      if (label) setMsg(`Navigated to ${label}`);
    };
    window.addEventListener("mr-nav-jump", onJump as EventListener);
    return () => window.removeEventListener("mr-nav-jump", onJump as EventListener);
  }, [navItems]);
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: 1, height: 1, padding: 0, margin: -1,
        overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
      }}
    >
      {msg}
    </div>
  );
}

const css = `
/* ───────────── DESKTOP TOP PILL ───────────── */
.mr-nav {
  position: fixed;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 80;
  display: none;
  align-items: center;
  gap: 18px;
  padding: 6px 14px 6px 14px;
  min-height: 42px;
  border-radius: 999px;
  color: var(--ink);
  background: color-mix(in oklab, var(--bone) 68%, transparent);
  border: 1px solid color-mix(in oklab, var(--ink) 6%, transparent);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  box-shadow:
    0 1px 0 color-mix(in oklab, #ffffff 20%, transparent) inset,
    0 4px 24px -8px color-mix(in oklab, var(--ink) 10%, transparent);
  transition:
    background .6s ease,
    border-color .6s ease,
    box-shadow .6s ease,
    opacity .5s cubic-bezier(.22,.8,.22,1),
    transform .6s cubic-bezier(.22,.8,.22,1);
  font-family: var(--font-sans, system-ui, sans-serif);
  will-change: transform, opacity;
  contain: layout style;
  -webkit-font-smoothing: antialiased;
}
.mr-nav.is-scrolled {
  background: color-mix(in oklab, var(--bone) 82%, transparent);
  border-color: color-mix(in oklab, var(--ink) 10%, transparent);
  box-shadow:
    0 1px 0 color-mix(in oklab, #ffffff 16%, transparent) inset,
    0 8px 32px -10px color-mix(in oklab, var(--ink) 14%, transparent);
}
.mr-nav.is-hidden, .mr-nav-mobile.is-hidden {
  opacity: 0; pointer-events: none;
  transform: translate(-50%, -8px) scale(.99);
}
.mr-nav.is-visible, .mr-nav-mobile.is-visible {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}
.mr-nav-mobile.is-hidden { transform: translate(-50%, 8px) scale(.99); }
@media (min-width: 900px) {
  .mr-nav { display: inline-flex; }
}

.mr-nav__brand {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 2px 16px 2px 2px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 58%, transparent);
  border-right: 1px solid color-mix(in oklab, currentColor 10%, transparent);
}
.mr-nav__logo {
  display: inline-flex;
  width: 26px; height: 26px;
  color: var(--vermilion);
  transition: filter .4s ease;
}
.mr-nav__logo svg { transition: transform .4s ease; }
.mr-nav:hover .mr-nav__logo svg { transform: scale(1.05); }

.mr-nav__chapter-num {
  display: inline-block;
  min-width: 1.4em;
  text-align: right;
  color: var(--vermilion);
  font-weight: 600;
  transition: all .4s cubic-bezier(.22,.8,.22,1);
}
.mr-nav__chapter-sep {
  display: inline-block; width: 10px; height: 1px;
  background: color-mix(in oklab, currentColor 22%, transparent);
}
.mr-nav__chapter-name {
  transition: all .4s cubic-bezier(.22,.8,.22,1);
}

.mr-nav__list {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0; padding: 0;
  list-style: none;
}
.mr-nav__pill {
  position: absolute;
  top: 50%;
  left: 0;
  height: 32px;
  margin-top: -16px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--ink) 6%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ink) 8%, transparent);
  transition: none;
  will-change: transform, width, opacity;
  pointer-events: none;
}
.mr-nav__pill.is-ready {
  transition:
    transform .5s cubic-bezier(.22,.8,.22,1),
    width .5s cubic-bezier(.22,.8,.22,1),
    opacity .25s ease;
}

.mr-nav__link {
  position: relative;
  display: inline-flex; align-items: baseline; gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: color-mix(in oklab, currentColor 55%, transparent);
  text-decoration: none;
  transition: color .35s ease, font-weight .35s ease;
  white-space: nowrap;
}
.mr-nav__link:hover { color: currentColor; }
.mr-nav__link.is-active { color: currentColor; font-weight: 600; }

.mr-nav__link-n {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: color-mix(in oklab, currentColor 40%, transparent);
  opacity: .55;
  transition: opacity .35s ease, color .35s ease;
}
.mr-nav__link:hover .mr-nav__link-n { opacity: .85; }
.mr-nav__link.is-active .mr-nav__link-n { opacity: 1; color: var(--vermilion); }
.mr-nav__link:focus-visible,
.mr-nav-mobile__link:focus-visible {
  outline: 2px solid var(--vermilion);
  outline-offset: 3px;
  border-radius: 999px;
}

.mr-nav__resume {
  display: inline-flex; align-items: center; gap: 7px;
  margin-left: 10px;
  padding: 6px 15px 6px 13px;
  border-radius: 999px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--bone);
  background: var(--vermilion);
  text-decoration: none;
  transition: transform .35s ease, box-shadow .35s ease, background .35s ease;
  white-space: nowrap;
}
.mr-nav__resume:hover {
  transform: translateY(-1px);
  background: color-mix(in oklab, var(--vermilion) 90%, #000 10%);
  box-shadow: 0 4px 18px -6px color-mix(in oklab, var(--vermilion) 45%, transparent);
}
.mr-nav__resume:active { transform: translateY(0); }
.mr-nav__resume:focus-visible {
  outline: 2px solid var(--vermilion);
  outline-offset: 3px;
  border-radius: 999px;
}

/* ───────────── MOBILE BOTTOM BAR ───────────── */
.mr-nav-mobile {
  position: fixed;
  bottom: max(14px, env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  z-index: 80;
  display: block;
  max-width: calc(100vw - 20px);
  padding: 4px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--bone) 72%, transparent);
  border: 1px solid color-mix(in oklab, var(--ink) 8%, transparent);
  backdrop-filter: blur(18px) saturate(140%);
  color: var(--ink);
  box-shadow:
    0 1px 0 color-mix(in oklab, #ffffff 16%, transparent) inset,
    0 4px 20px -8px color-mix(in oklab, var(--ink) 12%, transparent);
}
@media (min-width: 900px) { .mr-nav-mobile { display: none; } }

.mr-nav-mobile__list {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  margin: 0; padding: 0 3px;
  list-style: none;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
}
.mr-nav-mobile__list::-webkit-scrollbar { display: none; }

.mr-nav-mobile__pill {
  position: absolute;
  top: 50%; left: 0;
  height: 28px;
  margin-top: -14px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--ink) 6%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ink) 8%, transparent);
  transition: none;
  will-change: transform, width, opacity;
  pointer-events: none;
}
.mr-nav-mobile__pill.is-ready {
  transition:
    transform .4s cubic-bezier(.22,.8,.22,1),
    width .4s cubic-bezier(.22,.8,.22,1),
    opacity .22s ease;
}

.mr-nav-mobile__link {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 8px 14px;
  border-radius: 999px;
  white-space: nowrap;
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-decoration: none;
  color: color-mix(in oklab, var(--ink) 52%, transparent);
  scroll-snap-align: center;
  transition: color .3s ease;
}
.mr-nav-mobile__link:hover { color: var(--ink); }

.mr-nav-mobile__link.is-active {
  color: var(--ink);
  font-weight: 600;
}

.mr-nav-mobile__resume {
  display: inline-flex; align-items: center; justify-content: center;
  margin-left: 3px;
  width: 28px; height: 28px;
  border-radius: 50%;
  color: var(--bone);
  background: var(--vermilion);
  text-decoration: none;
  flex-shrink: 0;
  transition: transform .3s ease, box-shadow .3s ease;
}
.mr-nav-mobile__resume:hover {
  transform: scale(1.06);
  box-shadow: 0 3px 12px -4px color-mix(in oklab, var(--vermilion) 45%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .mr-nav__pill, .mr-nav-mobile__pill,
  .mr-nav__link, .mr-nav-mobile__link { transition: none; }
  .mr-nav__resume, .mr-nav-mobile__resume { transition: none; }
  .mr-nav__logo svg { transition: none; }
}
`;