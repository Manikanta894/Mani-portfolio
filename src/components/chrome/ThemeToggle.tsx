"use client";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "mr-theme";

function apply(t: Theme) {
  const r = document.documentElement;
  r.classList.toggle("dark", t === "dark");
  r.dataset.theme = t;
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = (localStorage.getItem(KEY) as Theme | null) ?? "light";
    setTheme(stored);
    apply(stored);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dark = theme === "dark";
  const toggle = () => {
    const next: Theme = dark ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(KEY, next);
    apply(next);
  };

  return (
    <>
      <button
        onClick={toggle}
        aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
        aria-pressed={dark}
        className={`mr-theme-dial ${dark ? "is-dark" : "is-light"}`}
      >
        <span className="mr-theme-dial__track" aria-hidden>
          <span className="mr-theme-dial__sun" />
          <span className="mr-theme-dial__moon" />
          <span className="mr-theme-dial__knob" />
        </span>
        <span className="mr-theme-dial__label">{dark ? "Nocturne" : "Daylight"}</span>
      </button>
      <style>{css}</style>
    </>
  );
}

const css = `
.mr-theme-dial {
  position: fixed; right: 18px; top: 18px; z-index: 70;
  display: inline-flex; align-items: center; gap: 12px;
  padding: 8px 14px 8px 8px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, currentColor 18%, transparent);
  background: color-mix(in oklab, currentColor 4%, transparent);
  backdrop-filter: blur(10px) saturate(140%);
  color: var(--hero-ink, #14110f);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .35s ease, border-color .35s ease, color .35s ease, transform .35s ease;
  box-shadow:
    0 1px 0 color-mix(in oklab, currentColor 6%, transparent) inset,
    0 14px 30px -18px rgba(0,0,0,0.35);
}
.mr-theme-dial:hover { transform: translateY(-1px); border-color: color-mix(in oklab, currentColor 38%, transparent); }
.mr-theme-dial__track {
  position: relative;
  width: 46px; height: 24px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f4e3b8, #efe2c4 38%, #1a1816 62%, #0c0a09);
  box-shadow: inset 0 0 0 1px color-mix(in oklab, currentColor 20%, transparent);
  overflow: hidden;
  display: inline-block;
}
.mr-theme-dial__sun, .mr-theme-dial__moon {
  position: absolute; top: 50%; width: 6px; height: 6px; border-radius: 50%;
  transform: translateY(-50%);
  transition: opacity .4s ease;
}
.mr-theme-dial__sun  { left: 7px;  background: #d9a637; box-shadow: 0 0 6px #f4cf73; }
.mr-theme-dial__moon { right: 7px; background: #cfd7e6; box-shadow: 0 0 6px #93a1bf; }
.mr-theme-dial.is-dark  .mr-theme-dial__sun  { opacity: 0.25; }
.mr-theme-dial.is-light .mr-theme-dial__moon { opacity: 0.25; }
.mr-theme-dial__knob {
  position: absolute; top: 2px; left: 2px;
  width: 20px; height: 20px; border-radius: 50%;
  background:
    radial-gradient(circle at 32% 32%, #fff, #e9e1d2 55%, #c8bba0 100%);
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.08),
    0 4px 10px -2px rgba(0,0,0,0.35),
    0 0 0 2px rgba(255,255,255,0.04);
  transition: transform .45s cubic-bezier(.2,.7,.2,1), background .45s ease;
}
.mr-theme-dial.is-dark .mr-theme-dial__knob {
  transform: translateX(22px);
  background:
    radial-gradient(circle at 32% 32%, #4a4640, #1d1a17 55%, #0b0908 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.06),
    0 4px 10px -2px rgba(0,0,0,0.6),
    0 0 0 2px rgba(216,184,120,0.10);
}
.mr-theme-dial__label { display: inline-block; min-width: 64px; text-align: left; }

.dark .mr-theme-dial { color: var(--hero-ink, #f1ebe1); }
`;
