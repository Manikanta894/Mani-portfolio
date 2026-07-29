"use client";
import { useEffect, useState, useRef } from "react";
import { Reveal, MaskReveal } from "@/components/motion/primitives";
import usePortfolio from "@/hooks/usePortfolio";
import portrait from "@/assets/portrait.jpg";

const API_BASE = typeof window !== "undefined"
  ? import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  : "";

const LINKEDIN_URL = "https://www.linkedin.com/in/manikanta894/";

const PLACEHOLDER_CYCLES: Record<string, string[]> = {
  name: ["Your full name", "e.g. Jane Doe", "type here..."],
  email: ["you@company.com", "your@email.com", "hello@domain.in"],
  subject: ["Role · Project · Research", "collaboration query", "consulting inquiry"],
  message: ["What's the context?", "the question, the outcome...", "describe your idea"],
};

function TypewriterPlaceholder({ name, period = 2500 }: { name: string; period?: number }) {
  const phrases = PLACEHOLDER_CYCLES[name] || ["..."];
  const [index, setIndex] = useState(0);
  const [char, setChar] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    const full = phrases[index];
    const timer = setInterval(() => {
      setChar((c) => {
        const next = c + dir;
        if (next >= full.length + 1) { setDir(-1); return full.length; }
        if (next <= 0) { setDir(1); setIndex((i) => (i + 1) % phrases.length); return 0; }
        return next;
      });
    }, 60);
    return () => clearInterval(timer);
  }, [index, dir, phrases]);

  return <>{phrases[index].slice(0, char)}{char < phrases[index].length && <span className="mr-cursor" />}</>;
}

export default function Ch09LinkedIn() {
  const { profile } = usePortfolio();

  const contactInfo = profile?.contact_info || {
    fields: [
      { name: "name", label: "Name", placeholder: "Your full name" },
      { name: "email", label: "Email", placeholder: "you@company.com" },
      { name: "subject", label: "Subject", placeholder: "Role · Project · Research collaboration" },
      { name: "message", label: "Message", placeholder: "What's the context, the question, the outcome?" },
    ],
    channels: [
      { label: "LinkedIn", value: "/in/manikanta894", href: "https://linkedin.com/in/manikanta894" },
      { label: "Email", value: "hello@manikantar.in", href: "mailto:hello@manikantar.in" },
      { label: "X / Twitter", value: "@ishaan___04", href: "https://x.com/ishaan___04" },
      { label: "Instagram", value: "@mani___894", href: "https://instagram.com/mani___894" },
    ],
  };

  const channels = contactInfo.channels || [];

  const p = {
    name: profile?.name || "Manikanta R",
    headline: profile?.tagline_plain || profile?.headline || "MBA Candidate · HR & Business Analytics · Researcher in Algorithmic HRM",
    company: profile?.current_program || "Nagarjuna Degree College — MBA Program",
    location: profile?.location || "Bengaluru, India",
    verified: true,
  };

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitStatus("success");
      setToastVisible(true);
      setFormData({});
      setTimeout(() => setToastVisible(false), 4000);
    } catch (err: any) {
      setSubmitStatus("error");
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const [latency, setLatency] = useState(38);
  useEffect(() => {
    const i = setInterval(() => setLatency(30 + Math.floor(Math.random() * 30)), 1800);
    return () => clearInterval(i);
  }, []);

  const bootRef = useRef<HTMLDivElement>(null);
  const [typedLine, setTypedLine] = useState("");
  const bootLines = ["SYSTEM: connect.sh initializing...", "PORT: 443 open", "SESSION: established"];

  useEffect(() => {
    let acc = "";
    let i = 0;
    const full = bootLines.join("\n");
    const t = setInterval(() => {
      if (i < full.length) { acc += full[i]; setTypedLine(acc); i++; }
      else clearInterval(t);
    }, 12);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="linkedin" data-mood="ink" className="relative chapter-pad overflow-hidden">
      <div aria-hidden className="li-grid-bg" />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="li-eyebrow">
          <span className="li-eyebrow__num">09</span>
          <span className="li-eyebrow__sep" />
          <span>Connect</span>
        </div>
        <h2 className="li-title">Let's connect.</h2>
        <p className="li-subtitle">LinkedIn profile, social channels, and a direct line to reach me.</p>

        {/* Profile card */}
        <Reveal className="li-profile-card-wrap">
          <article className="li-profile-card">
            <div className="li-profile-card__photo">
              <img src={portrait} alt={p.name} loading="lazy" />
              <span className="li-profile-card__ring" aria-hidden />
            </div>
            <div className="li-profile-card__body">
              <div className="li-profile-card__nameRow">
                <h3 className="li-profile-card__name">{p.name}</h3>
                {p.verified && (
                  <span className="li-verified" title="LinkedIn verified profile">
                    <VerifiedTick /> Verified
                  </span>
                )}
              </div>
              <p className="li-profile-card__headline">{p.headline}</p>
              <div className="li-profile-card__meta">
                <span>{p.company}</span>
                <span className="li-profile-card__meta-sep" aria-hidden />
                <span>{p.location}</span>
              </div>
              <div className="li-profile-card__social">
                {channels.filter((c: any) => c.label !== "LinkedIn").map((c: any) => (
                  <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                    className="li-profile-card__social-link">
                    {c.label === "Email" ? <MailIcon /> : c.label === "X / Twitter" ? <XIcon /> : c.label === "Instagram" ? <InstaIcon /> : null}
                    <span>{c.value}</span>
                  </a>
                ))}
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="li-profile-card__social-link li-profile-card__social-link--primary">
                  <LinkedInIcon />
                  <span>{channels.find((c: any) => c.label === "LinkedIn")?.value || "/in/manikanta894"}</span>
                </a>
              </div>
            </div>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="li-profile-card__cta">
              Full LinkedIn profile <Arrow />
            </a>
          </article>
        </Reveal>

        {/* Contact form */}
        <div className="li-form-wrap">
          <Reveal>
            <div className="li-terminal">
              <div aria-hidden className="li-scanline" />
              <form onSubmit={handleSubmit}>
                <div className="li-terminal__header">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-bone/25" />
                    <span className="h-2 w-2 rounded-full bg-bone/25" />
                    <span className="h-2 w-2 rounded-full bg-vermilion" />
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="text-vermilion">➜</span>
                    ~/manikantar.in/contact
                    <span className="text-bone/30 mx-1">⌁</span>
                    ping {latency}ms
                  </span>
                </div>
                <div className="li-terminal__body">
                  {contactInfo.fields.map((f: any) => {
                    const isMessage = f.name === "message";
                    const required = f.name === "name" || f.name === "email";
                    return (
                      <label key={f.name} className="block group">
                        <span className="li-terminal__label">
                          <span className="text-bone/35">$</span> {f.name}:
                        </span>
                        {isMessage ? (
                          <textarea required={required} rows={4} value={formData[f.name] || ""}
                            onChange={(e) => handleChange(f.name, e.target.value)}
                            className="li-terminal__input li-terminal__input--area" />
                        ) : (
                          <input type={f.name === "email" ? "email" : "text"} required={required}
                            value={formData[f.name] || ""}
                            onChange={(e) => handleChange(f.name, e.target.value)}
                            className="li-terminal__input" />
                        )}
                        {!formData[f.name] && (
                          <span className="li-terminal__ghost">
                            <TypewriterPlaceholder name={f.name} />
                          </span>
                        )}
                      </label>
                    );
                  })}
                  <div className="flex items-center justify-between pt-2">
                    <button type="submit" disabled={submitting} className="li-terminal__btn">
                      <span className="li-terminal__btn-ring" aria-hidden />
                      <span>{">"} {submitting ? "sending..." : "transmit"}</span>
                      <span className="caret">▍</span>
                    </button>
                    <span className="li-terminal__status">
                      {submitStatus === "success"
                        ? <span className="text-vermilion">// message sent ✓</span>
                        : submitStatus === "error"
                        ? <span className="text-red-400">// {errorMessage}</span>
                        : "// awaiting input"}
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>

      <div className={`li-toast ${toastVisible ? "is-visible" : ""}`}>
        <span className="li-toast__icon">✓</span>
        <span>Message transmitted successfully</span>
      </div>
      <style>{css}</style>
    </section>
  );
}

function VerifiedTick() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <path fill="currentColor" d="M12 1.6 14.2 4l3.3-.2.2 3.3L20 9l-1.6 2.2.2 3.3-3.3.2-2.2 2.3-2.2-2.3-3.3-.2.2-3.3L4 9l1.7-1.9-.2-3.3 3.3.2L12 1.6Zm-1.3 12 5-5-1.4-1.4-3.6 3.6-1.6-1.6-1.4 1.4 3 3Z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden className="li-arrow">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.6c0-1.28-.6-2.05-1.7-2.05a1.86 1.86 0 00-1.75 1.3A2.3 2.3 0 0012.5 14v5H9.5V9h3v1.5a3.11 3.11 0 012.6-1.4c1.85 0 3.4 1.1 3.4 3.7z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 6l10 7 10-7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" />
    </svg>
  );
}

const css = `
.li-grid-bg {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(60% 40% at 12% 8%, color-mix(in oklab, var(--vermilion) 14%, transparent), transparent 60%),
    radial-gradient(50% 35% at 88% 80%, color-mix(in oklab, var(--ink) 30%, transparent), transparent 60%);
  opacity: 0.5;
}
.li-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: color-mix(in oklab, currentColor 65%, transparent); margin-bottom: 18px; }
.li-eyebrow__num { color: var(--vermilion); font-weight: 600; }
.li-eyebrow__sep { width: 22px; height: 1px; background: color-mix(in oklab, currentColor 35%, transparent); }
.li-title { font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.02; letter-spacing: -0.02em; max-width: 22ch; }
.li-subtitle { margin-top: 14px; max-width: 60ch; font-size: clamp(1rem, 1.15vw, 1.125rem); color: color-mix(in oklab, currentColor 72%, transparent); }

/* Profile card */
.li-profile-card {
  margin-top: 48px;
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 28px 32px;
  border-radius: 22px;
  background: color-mix(in oklab, var(--bone) 6%, transparent);
  border: 1px solid color-mix(in oklab, currentColor 14%, transparent);
  backdrop-filter: blur(14px) saturate(140%);
  box-shadow: 0 24px 60px -32px color-mix(in oklab, #000 70%, transparent), 0 1px 0 color-mix(in oklab, #fff 8%, transparent) inset;
  transition: border-color .3s ease;
}
.li-profile-card:hover { border-color: color-mix(in oklab, currentColor 24%, transparent); }
.li-profile-card__photo { position: relative; width: 80px; height: 80px; border-radius: 50%; overflow: hidden; flex-shrink: 0; isolation: isolate; }
.li-profile-card__photo img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.05) contrast(1.02); }
.li-profile-card__ring { position: absolute; inset: -3px; border-radius: 50%; background: conic-gradient(from 220deg, color-mix(in oklab, var(--vermilion) 80%, transparent), color-mix(in oklab, currentColor 30%, transparent), color-mix(in oklab, var(--vermilion) 80%, transparent)); z-index: -1; filter: blur(2px); opacity: .8; }
.li-profile-card__body { flex: 1; min-width: 0; }
.li-profile-card__nameRow { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.li-profile-card__name { font-family: var(--font-display); font-size: clamp(1.5rem, 2.2vw, 1.9rem); line-height: 1; letter-spacing: -0.01em; }
.li-verified { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: color-mix(in oklab, var(--vermilion) 14%, transparent); border: 1px solid color-mix(in oklab, var(--vermilion) 42%, transparent); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; }
.dark .li-verified { color: var(--bone); }
.li-profile-card__headline { margin-top: 8px; font-size: clamp(0.92rem, 1.05vw, 1rem); color: color-mix(in oklab, currentColor 78%, transparent); }
.li-profile-card__meta { display: flex; align-items: center; gap: 10px; margin-top: 10px; font-size: 13px; color: color-mix(in oklab, currentColor 60%, transparent); }
.li-profile-card__meta-sep { width: 1px; height: 12px; background: color-mix(in oklab, currentColor 18%, transparent); }
.li-profile-card__social { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.li-profile-card__social-link {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-decoration: none;
  color: color-mix(in oklab, currentColor 70%, transparent);
  border: 1px solid color-mix(in oklab, currentColor 12%, transparent);
  transition: border-color .25s ease, color .25s ease, background .25s ease, transform .25s ease;
}
.li-profile-card__social-link:hover {
  color: var(--vermilion);
  border-color: color-mix(in oklab, var(--vermilion) 40%, transparent);
  background: color-mix(in oklab, var(--vermilion) 6%, transparent);
  transform: translateY(-1px);
}
.li-profile-card__social-link--primary {
  border-color: color-mix(in oklab, var(--vermilion) 30%, transparent);
  color: var(--vermilion);
}
.li-profile-card__social-link--primary:hover {
  background: color-mix(in oklab, var(--vermilion) 10%, transparent);
}
.li-profile-card__cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  background: color-mix(in oklab, var(--ink) 70%, transparent);
  color: var(--bone);
  font-size: 13px;
  letter-spacing: 0.02em;
  text-decoration: none;
  border: 1px solid color-mix(in oklab, currentColor 18%, transparent);
  flex-shrink: 0;
  transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
}
.dark .li-profile-card__cta { background: var(--bone); color: var(--ink); }
.li-profile-card__cta:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -12px rgba(212,106,46,0.15); }

@media (max-width: 860px) {
  .li-profile-card { flex-direction: column; align-items: flex-start; }
  .li-profile-card__cta { align-self: stretch; justify-content: center; }
}

/* Terminal form */
.li-form-wrap { margin-top: 48px; }
.li-terminal {
  position: relative;
  border-radius: 4px;
  background: #0a0a0c;
  border: 1px solid color-mix(in oklab, var(--vermilion) 18%, transparent);
  box-shadow: 0 0 20px rgba(212,106,46,0.06), 0 0 60px rgba(212,106,46,0.04), inset 0 0 40px rgba(0,0,0,0.5);
  overflow: hidden;
  transition: border-color .4s ease, box-shadow .4s ease;
}
.li-terminal:hover {
  border-color: color-mix(in oklab, var(--vermilion) 30%, transparent);
  box-shadow: 0 0 30px rgba(212,106,46,0.1), 0 0 80px rgba(212,106,46,0.06), inset 0 0 40px rgba(0,0,0,0.5);
}
.li-scanline {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background: repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
}
.li-terminal__header {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid color-mix(in oklab, var(--bone) 12%, transparent);
  font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.02em;
  color: color-mix(in oklab, var(--bone) 45%, transparent);
}
.li-terminal__body { padding: 24px; position: relative; z-index: 1; }
.li-terminal__label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--vermilion);
  display: block;
}
.li-terminal__input {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  display: block; width: 100%;
  margin-top: 4px; padding: 8px 0;
  border: 0; border-bottom: 1px solid color-mix(in oklab, var(--bone) 15%, transparent);
  background: transparent; color: var(--bone);
  outline: none; transition: border-color .3s ease;
  position: relative; z-index: 1;
}
.li-terminal__input:focus { border-bottom-color: var(--vermilion); }
.li-terminal__input--area {
  resize: none;
  border: 1px solid color-mix(in oklab, var(--bone) 15%, transparent);
  padding: 8px 10px; border-radius: 2px;
}
.li-terminal__input--area:focus { border-color: var(--vermilion); }
.li-terminal__ghost {
  position: absolute; left: 0; bottom: 9px;
  font-family: var(--font-mono); font-size: 0.85rem;
  color: color-mix(in oklab, var(--bone) 25%, transparent);
  pointer-events: none; z-index: 0;
}
label { position: relative; }

.mr-cursor {
  display: inline-block; width: 1px; height: 1em;
  background: var(--vermilion); vertical-align: text-bottom;
  margin-left: 1px;
  animation: mr-blink 0.8s steps(1) infinite;
}
@keyframes mr-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

.li-terminal__btn {
  position: relative;
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 10px 22px; border-radius: 999px;
  border: 1px solid var(--vermilion);
  background: var(--vermilion); color: var(--bone);
  cursor: pointer; overflow: hidden; isolation: isolate;
  transition: background .3s ease, color .3s ease, transform .3s ease;
}
.li-terminal__btn:hover { background: transparent; color: var(--vermilion); transform: translateY(-2px); }
.li-terminal__btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.li-terminal__btn-ring {
  position: absolute; inset: -4px; border-radius: inherit;
  border: 1px solid var(--vermilion);
  opacity: 0; transition: opacity .3s ease, transform .3s ease;
}
.li-terminal__btn:hover .li-terminal__btn-ring { opacity: 0.4; transform: scale(1.04); }
.li-terminal__status {
  font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.04em;
  color: color-mix(in oklab, var(--bone) 45%, transparent);
}
.li-arrow { transition: transform .3s ease; }
.li-profile-card__cta:hover .li-arrow { transform: translateX(4px); }

/* Toast */
.li-toast {
  position: fixed; bottom: 32px; right: 32px; z-index: 999;
  display: inline-flex; align-items: center; gap: 10px;
  padding: 12px 22px; border-radius: 999px;
  background: #0a0a0c;
  border: 1px solid color-mix(in oklab, var(--vermilion) 30%, transparent);
  box-shadow: 0 8px 32px -12px rgba(0,0,0,0.4), 0 0 20px rgba(212,106,46,0.08);
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em;
  color: var(--bone);
  opacity: 0; transform: translateY(12px) scale(0.96);
  transition: opacity .4s ease, transform .5s cubic-bezier(.22,1,.36,1);
  pointer-events: none;
}
.li-toast.is-visible { opacity: 1; transform: translateY(0) scale(1); }
.li-toast__icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--vermilion); color: var(--bone);
  font-size: 10px; font-weight: 700;
}

@media (max-width: 640px) {
  .li-toast { left: 16px; right: 16px; bottom: 16px; }
}
`;
