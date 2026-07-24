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
  { id: "contact",    label: "Contact",     n: "10" },
  { id: "beyond-me",  label: "Beyond",      n: "11" },
];

export function PremiumNav() {
  const { navigationItems } = usePortfolio();
  const navItems: Item[] = navigationItems?.length > 0
    ? navigationItems
        .filter((ni: any) => ni.visible !== false)
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
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 80;
  display: none;
  align-items: center;
  gap: 22px;
  padding: 8px 20px 8px 22px;
  min-height: 42px;
  border-radius: 44px;
  color: var(--ink);
  background: color-mix(in oklab, var(--bone) 58%, transparent);
  border: 1px solid color-mix(in oklab, currentColor 14%, transparent);
  backdrop-filter: blur(24px) saturate(170%);
  -webkit-backdrop-filter: blur(24px) saturate(170%);
  box-shadow:
    0 1px 0 color-mix(in oklab, #ffffff 12%, transparent) inset,
    0 32px 80px -28px color-mix(in oklab, #000 65%, transparent),
    0 6px 20px -10px color-mix(in oklab, #000 40%, transparent);
  transition:
    background .5s ease,
    border-color .5s ease,
    box-shadow .5s ease,
    opacity .65s cubic-bezier(.2,.7,.2,1),
    transform .8s cubic-bezier(.2,.7,.2,1);
  font-family: var(--font-sans, system-ui, sans-serif);
  will-change: transform, opacity;
  contain: layout style;
  -webkit-font-smoothing: antialiased;
}
.mr-nav.is-scrolled {
  background: color-mix(in oklab, var(--bone) 82%, transparent);
  border-color: color-mix(in oklab, currentColor 22%, transparent);
}
.mr-nav.is-hidden, .mr-nav-mobile.is-hidden {
  opacity: 0; pointer-events: none;
  transform: translate(-50%, -12px) scale(.985);
}
.mr-nav.is-visible, .mr-nav-mobile.is-visible {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}
.mr-nav-mobile.is-hidden { transform: translate(-50%, 14px) scale(.985); }
@media (min-width: 900px) {
  .mr-nav { display: inline-flex; }
}

.mr-nav__brand {
  display: inline-flex; align-items: center; gap: 12px;
  padding: 4px 22px 4px 4px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12.5px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: color-mix(in oklab, currentColor 75%, transparent);
  border-right: 1px solid color-mix(in oklab, currentColor 18%, transparent);
}

.mr-nav__chapter-num {
  display: inline-block;
  min-width: 1.6em;
  text-align: right;
  color: var(--vermilion);
  font-weight: 600;
}
.mr-nav__chapter-sep {
  display: inline-block; width: 16px; height: 1px;
  background: color-mix(in oklab, currentColor 35%, transparent);
}
.mr-nav__chapter-name { color: currentColor; }

.mr-nav__list {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0; padding: 0;
  list-style: none;
}
.mr-nav__pill {
  position: absolute;
  top: 50%;
  left: 0;
  height: 38px;
  margin-top: -19px;

  border-radius: 999px;
  background: color-mix(in oklab, var(--ink) 10%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, currentColor 14%, transparent),
    0 8px 20px -10px color-mix(in oklab, var(--vermilion) 60%, transparent);
  transition: none;
  will-change: transform, width, opacity;
  pointer-events: none;
}
.mr-nav__pill.is-ready {
  transition:
    transform .6s cubic-bezier(.22,.9,.18,1),
    width .6s cubic-bezier(.22,.9,.18,1),
    opacity .35s ease,
    background .3s ease;
}
.dark .mr-nav__pill {
  background: color-mix(in oklab, var(--ink) 14%, transparent);
}

.mr-nav__link {
  position: relative;
  display: inline-flex; align-items: baseline; gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.015em;
  color: color-mix(in oklab, currentColor 72%, transparent);
  text-decoration: none;
  transition: color .35s ease, transform .35s ease;
  white-space: nowrap;
}
.mr-nav__link-n {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  color: color-mix(in oklab, var(--vermilion) 70%, currentColor 30%);
  opacity: .75;
}
.mr-nav__link:hover { color: currentColor; transform: translateY(-1px); }
.mr-nav__link.is-active { color: currentColor; font-weight: 700; }
.mr-nav__link.is-active .mr-nav__link-n { opacity: 1; }
.mr-nav__link:focus-visible,
.mr-nav-mobile__link:focus-visible {
  outline: 2px solid var(--vermilion);
  outline-offset: 3px;
  border-radius: 999px;
}

.mr-nav__link.is-active::after {
  content: "";
  position: absolute;
  left: 50%; bottom: 3px;
  width: 4px; height: 4px;
  margin-left: -2px;
  border-radius: 50%;
  background: var(--vermilion);
  box-shadow: 0 0 8px var(--vermilion);
  animation: mr-nav-pulse 2.2s ease-in-out infinite;
}
@keyframes mr-nav-pulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50%      { transform: scale(1.35); opacity: 0.55; }
}

.mr-nav__theme {
  display: inline-flex; align-items: center;
  padding-left: 14px;
  border-left: 1px solid color-mix(in oklab, currentColor 15%, transparent);
}
.mr-nav__theme .mr-theme-dial {
  position: static !important;
  padding: 7px 16px 7px 7px !important;
  background: transparent !important;
  border-color: color-mix(in oklab, currentColor 20%, transparent) !important;
  box-shadow: none !important;
  font-size: 11px !important;
  letter-spacing: 0.18em !important;
}
/* ───────────── MOBILE BOTTOM BAR ───────────── */
.mr-nav-mobile {
  position: fixed;
  bottom: max(14px, env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  z-index: 80;
  display: block;
  max-width: calc(100vw - 16px);
  padding: 6px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--bone) 70%, transparent);
  border: 1px solid color-mix(in oklab, var(--ink) 14%, transparent);
  backdrop-filter: blur(20px) saturate(160%);
  color: var(--ink);
  box-shadow:
    0 1px 0 color-mix(in oklab, #ffffff 14%, transparent) inset,
    0 18px 36px -18px color-mix(in oklab, var(--ink) 55%, transparent);
}
@media (min-width: 900px) { .mr-nav-mobile { display: none; } }

.mr-nav-mobile__list {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0;
  margin: 0; padding: 0 4px;
  list-style: none;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
}
.mr-nav-mobile__list::-webkit-scrollbar { display: none; }

.mr-nav-mobile__pill {
  position: absolute;
  top: 50%; left: 0;
  height: 30px;
  margin-top: -15px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--ink) 10%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ink) 16%, transparent);
  transition: none;
  will-change: transform, width, opacity;
  pointer-events: none;
}
.mr-nav-mobile__pill.is-ready {
  transition:
    transform .5s cubic-bezier(.22,.8,.22,1),
    width .5s cubic-bezier(.22,.8,.22,1),
    opacity .3s ease;
}

.mr-nav-mobile__link {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 9px 14px;
  border-radius: 999px;
  white-space: nowrap;
  font-size: 12.5px;
  letter-spacing: 0.03em;
  text-decoration: none;
  color: color-mix(in oklab, var(--ink) 65%, transparent);
  scroll-snap-align: center;
  transition: color .3s ease;
}

.mr-nav-mobile__link.is-active {
  color: var(--ink);
  font-weight: 500;
}
.mr-nav-mobile__link.is-active::before {
  content: "";
  display: inline-block;
  width: 5px; height: 5px;
  margin-right: 6px;
  border-radius: 50%;
  background: var(--vermilion);
  box-shadow: 0 0 8px var(--vermilion);
}

.mr-nav ~ * [data-legacy-rail],
[data-legacy-rail] { display: none !important; }

@media (prefers-reduced-motion: reduce) {
  .mr-nav__pill, .mr-nav-mobile__pill,
  .mr-nav__link, .mr-nav-mobile__link { transition: none; }
  .mr-nav__link.is-active::after { animation: none; }
}
`;