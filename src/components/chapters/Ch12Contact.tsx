"use client";
import { useEffect, useState, useRef } from "react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

const API_BASE =
  typeof window !== "undefined"
    ? import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    : "";

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
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const full = phrases[index];
    timerRef.current = setInterval(() => {
      setChar((c) => {
        const next = c + dir;
        if (next >= full.length + 1) { setDir(-1); return full.length; }
        if (next <= 0) { setDir(1); setIndex((i) => (i + 1) % phrases.length); return 0; }
        return next;
      });
    }, 60);
    return () => clearInterval(timerRef.current);
  }, [index, dir, phrases]);

  return <>{phrases[index].slice(0, char)}{char < phrases[index].length && <span className="mr-contact__cursor" />}</>;
}

export function Ch12Contact() {
  const { profile } = usePortfolio();
  const contactInfo = profile?.contact_info || {
    number: "10",
    kicker: "Let's build",
    title: "Contact",
    prompt: "Tell me what you're building.",
    intro: "// start the conversation",
    fields: [
      { name: "name", label: "Name", placeholder: "Your full name" },
      { name: "email", label: "Email", placeholder: "you@company.com" },
      { name: "subject", label: "Subject", placeholder: "Role · Project · Research collaboration" },
      { name: "message", label: "Message", placeholder: "What's the context, the question, the outcome?" },
    ],
    cta: "Send Message",
    status: "Open to Opportunities",
    practice: "HR Analytics · People Analytics · Workforce Strategy · Consulting · Business Intelligence",
    availability: "Currently based in Bengaluru. Available for full-time roles, research collaborations and consulting engagements.",
    channels: [
      { label: "LinkedIn", value: "/in/manikanta894", href: "https://linkedin.com/in/manikanta894" },
      { label: "Email", value: "hello@manikantar.in", href: "mailto:hello@manikantar.in" },
      { label: "X / Twitter", value: "@ishaan___04", href: "https://x.com/ishaan___04" },
      { label: "Instagram", value: "@mani___894", href: "https://instagram.com/mani___894" },
    ],
    response: "average response time · < 48h",
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
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const [latency, setLatency] = useState(38);
  useEffect(() => {
    const i = setInterval(() => setLatency(30 + Math.floor(Math.random() * 30)), 1800);
    return () => clearInterval(i);
  }, []);

  const boatRef = useRef<HTMLDivElement>(null);
  const [typedLine, setTypedLine] = useState("");
  const bootLines = [
    "SYSTEM: contact.sh initializing...",
    "PORT: 443 open",
    "SESSION: established",
  ];

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
    <section id="contact" data-mood="ink" className="relative chapter-pad grain overflow-hidden">
      <div aria-hidden className="mr-contact__grid-bg" />
      <div className="mx-auto max-w-6xl relative z-10">
        <header className="mb-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <div className="text-mono text-meta text-bone/55">
              /{contactInfo.number} — {contactInfo.kicker}
            </div>
            <h2 className="text-display mt-4 text-[clamp(3rem,7vw,6rem)] text-bone">
              <MaskReveal>{contactInfo.title}</MaskReveal>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-6">
            <div className="text-mono text-eyebrow text-bone/55">{contactInfo.intro}</div>
            <p className="mt-2 text-display text-[clamp(1.2rem,2.4vw,2rem)] italic leading-tight text-bone">
              {contactInfo.prompt}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT — Terminal form */}
          <div className="col-span-12 md:col-span-7">
            <Reveal>
              <div className="mr-contact__terminal">
                <div aria-hidden className="mr-contact__scanline" />
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center gap-2 border-b border-bone/15 px-4 py-2.5 text-mono text-eyebrow text-bone/45">
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
                  <div className="space-y-4 p-6">
                    {contactInfo.fields.map((f: any) => {
                      const isMessage = f.name === "message";
                      const required = f.name === "name" || f.name === "email";
                      return (
                        <label key={f.name} className="block group">
                          <span className="text-mono block text-eyebrow text-vermilion">
                            <span className="mr-contact__prompt-dollar">$</span> {f.name}:
                          </span>
                          {isMessage ? (
                            <textarea required={required} rows={4}
                              placeholder=""
                              value={formData[f.name] || ""}
                              onChange={(e) => handleChange(f.name, e.target.value)}
                              className="mr-contact__input mr-contact__input--area"
                            />
                          ) : (
                            <input type={f.name === "email" ? "email" : "text"} required={required}
                              placeholder=""
                              value={formData[f.name] || ""}
                              onChange={(e) => handleChange(f.name, e.target.value)}
                              className="mr-contact__input"
                            />
                          )}
                          {!formData[f.name] && (
                            <span className="mr-contact__ghost">
                              <TypewriterPlaceholder name={f.name} />
                            </span>
                          )}
                        </label>
                      );
                    })}
                    <div className="flex items-center justify-between pt-2">
                      <button type="submit" disabled={submitting} className="mr-contact__btn">
                        <span className="mr-contact__btn-ring" aria-hidden />
                        <span>{">"} {submitting ? "sending..." : "transmit"}</span>
                        <span className="caret">▍</span>
                      </button>
                      <span className="text-mono text-eyebrow text-bone/45">
                        {submitStatus === "success" ? (
                          <span className="text-vermilion">// message sent ✓</span>
                        ) : submitStatus === "error" ? (
                          <span className="text-red-400">// {errorMessage}</span>
                        ) : "// awaiting input"}
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Terminal business card */}
          <div className="col-span-12 md:col-span-5">
            <Reveal>
              <div className="mr-contact__card">
                <div className="text-mono text-eyebrow text-vermilion mb-2">
                  <span className="text-bone/40">$</span> cat ~/business-card.txt
                </div>
                <div className="mr-contact__boot-text">
                  {typedLine}<span className="mr-contact__cursor" />
                </div>
                <div className="mt-4 border-t border-bone/10 pt-4">
                  <div className="text-mono text-meta text-bone/90">
                    <span className="text-vermilion">name:</span> Manikanta R
                  </div>
                  <div className="text-mono text-meta text-bone/70 mt-1">
                    <span className="text-vermilion">role:</span> {contactInfo.status}
                  </div>
                  <div className="text-mono text-meta text-bone/50 mt-1">
                    <span className="text-vermilion">stack:</span> {contactInfo.practice}
                  </div>
                  <p className="text-mono text-meta text-bone/60 mt-3 leading-relaxed">
                    {contactInfo.availability}
                  </p>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {contactInfo.channels.map((c: any) => (
                    <li key={c.label} className="mr-contact__channel group">
                      <span className="text-mono text-eyebrow text-bone/40 min-w-[80px]">{c.label}</span>
                      <a href={c.href} target="_blank" rel="noreferrer" className="mr-contact__glitch" data-text={c.value}>
                        <span className="mr-contact__glitch-main">{c.value}</span>
                        <span className="mr-contact__glitch-top" aria-hidden>{c.value}</span>
                        <span className="mr-contact__glitch-bot" aria-hidden>{c.value}</span>
                      </a>
                      <span className="text-mono text-eyebrow text-bone/30">↗</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between text-mono text-eyebrow text-bone/40">
                  <span>// response {contactInfo.response}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="mr-contact__pulse-dot" />
                    {latency}ms
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Success toast */}
      <div className={`mr-contact__toast ${toastVisible ? "is-visible" : ""}`}>
        <span className="mr-contact__toast-icon">✓</span>
        <span>Message transmitted successfully</span>
      </div>

      <style>{css}</style>
    </section>
  );
}

const css = `
.mr-contact__grid-bg {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(color-mix(in oklab, var(--bone) 3%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklab, var(--bone) 3%, transparent) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 70%);
}

/* ── LEFT: Terminal form ────────────────────────────────────────── */
.mr-contact__terminal {
  position: relative;
  border-radius: 4px;
  background: #0a0a0c;
  border: 1px solid color-mix(in oklab, var(--vermilion) 18%, transparent);
  box-shadow:
    0 0 20px rgba(212,106,46,0.06),
    0 0 60px rgba(212,106,46,0.04),
    inset 0 0 40px rgba(0,0,0,0.5);
  overflow: hidden;
  transition: border-color .4s ease, box-shadow .4s ease;
}
.mr-contact__terminal:hover {
  border-color: color-mix(in oklab, var(--vermilion) 30%, transparent);
  box-shadow:
    0 0 30px rgba(212,106,46,0.1),
    0 0 80px rgba(212,106,46,0.06),
    inset 0 0 40px rgba(0,0,0,0.5);
}

/* CRT scanline */
.mr-contact__scanline {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px, transparent 2px,
    rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px
  );
}

.mr-contact__prompt-dollar {
  color: color-mix(in oklab, var(--bone) 35%, transparent);
  margin-right: 2px;
}

.mr-contact__input {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.85rem;
  display: block;
  width: 100%;
  margin-top: 4px;
  padding: 8px 0;
  border: 0;
  border-bottom: 1px solid color-mix(in oklab, var(--bone) 15%, transparent);
  background: transparent;
  color: var(--bone);
  outline: none;
  transition: border-color .3s ease, box-shadow .3s ease;
  position: relative;
  z-index: 1;
}
.mr-contact__input:focus {
  border-bottom-color: var(--vermilion);
  box-shadow: 0 4px 16px -8px rgba(212,106,46,0.15);
}
.mr-contact__input--area {
  resize: none;
  border: 1px solid color-mix(in oklab, var(--bone) 15%, transparent);
  padding: 8px 10px;
  border-radius: 2px;
}
.mr-contact__input--area:focus {
  border-color: var(--vermilion);
  box-shadow: 0 0 20px -8px rgba(212,106,46,0.12), inset 0 0 20px -12px rgba(212,106,46,0.05);
}

/* Ghost placeholder overlay */
.mr-contact__ghost {
  position: absolute;
  left: 0;
  bottom: 9px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.85rem;
  color: color-mix(in oklab, var(--bone) 25%, transparent);
  pointer-events: none;
  z-index: 0;
}
label { position: relative; }

.mr-contact__cursor {
  display: inline-block;
  width: 1px;
  height: 1em;
  background: var(--vermilion);
  vertical-align: text-bottom;
  margin-left: 1px;
  animation: mr-cursor-blink 0.8s steps(1) infinite;
}
@keyframes mr-cursor-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* Submit button */
.mr-contact__btn {
  position: relative;
  display: inline-flex; align-items: center; gap: 10px;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 10px 22px;
  border-radius: 999px;
  border: 1px solid var(--vermilion);
  background: var(--vermilion);
  color: var(--bone);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  transition: background .3s ease, color .3s ease, transform .3s ease;
}
.mr-contact__btn:hover {
  background: transparent;
  color: var(--vermilion);
  transform: translateY(-2px);
}
.mr-contact__btn:active { transform: translateY(0); }
.mr-contact__btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.mr-contact__btn-ring {
  position: absolute; inset: -4px;
  border-radius: inherit;
  border: 1px solid var(--vermilion);
  opacity: 0;
  transition: opacity .3s ease, transform .3s ease;
}
.mr-contact__btn:hover .mr-contact__btn-ring {
  opacity: 0.4;
  transform: scale(1.04);
}

/* ── RIGHT: Terminal business card ───────────────────────────────── */
.mr-contact__card {
  padding: 24px;
  border-radius: 4px;
  background: #0a0a0c;
  border: 1px solid color-mix(in oklab, var(--bone) 12%, transparent);
  box-shadow: inset 0 0 30px rgba(0,0,0,0.4);
}
.mr-contact__boot-text {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  line-height: 1.6;
  color: color-mix(in oklab, var(--bone) 50%, transparent);
  white-space: pre-wrap;
  min-height: 3.2em;
}

/* Channel rows */
.mr-contact__channel {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid color-mix(in oklab, var(--bone) 6%, transparent);
}

.mr-contact__glitch {
  position: relative;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12px;
  color: var(--bone);
  text-decoration: none;
  transition: color .25s ease;
}
.mr-contact__glitch-main { position: relative; z-index: 1; }
.mr-contact__glitch-top,
.mr-contact__glitch-bot {
  position: absolute; inset: 0;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity .12s ease;
}
.mr-contact__glitch-top { color: #ff4d4d; top: -1px; }
.mr-contact__glitch-bot { color: #4d9eff; top: 1px; }
.mr-contact__channel:hover .mr-contact__glitch-main { color: var(--vermilion); }
.mr-contact__channel:hover .mr-contact__glitch-top {
  opacity: 0.7;
  animation: mr-glitch-top 0.25s ease-out 1;
}
.mr-contact__channel:hover .mr-contact__glitch-bot {
  opacity: 0.7;
  animation: mr-glitch-bot 0.25s ease-out 1;
}

@keyframes mr-glitch-top {
  0% { transform: translateX(0); opacity: 0; }
  25% { transform: translateX(-1.5px); opacity: 0.7; }
  50% { transform: translateX(1.5px); opacity: 0.5; }
  75% { transform: translateX(-0.5px); opacity: 0.3; }
  100% { transform: translateX(0); opacity: 0; }
}
@keyframes mr-glitch-bot {
  0% { transform: translateX(0); opacity: 0; }
  25% { transform: translateX(1.5px); opacity: 0.7; }
  50% { transform: translateX(-1.5px); opacity: 0.5; }
  75% { transform: translateX(0.5px); opacity: 0.3; }
  100% { transform: translateX(0); opacity: 0; }
}

.mr-contact__pulse-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--vermilion);
  box-shadow: 0 0 8px rgba(212,106,46,0.6);
  animation: mr-dot-pulse 2s ease-in-out infinite;
}
@keyframes mr-dot-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(212,106,46,0.6); }
  50% { opacity: 0.5; box-shadow: 0 0 16px rgba(212,106,46,0.3); }
}

/* ── Toast notification ─────────────────────────────────────────── */
.mr-contact__toast {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 999;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 999px;
  background: #0a0a0c;
  border: 1px solid color-mix(in oklab, var(--vermilion) 30%, transparent);
  box-shadow: 0 8px 32px -12px rgba(0,0,0,0.4), 0 0 20px rgba(212,106,46,0.08);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--bone);
  opacity: 0;
  transform: translateY(12px) scale(0.96);
  transition: opacity .4s ease, transform .5s cubic-bezier(.22,1,.36,1);
  pointer-events: none;
}
.mr-contact__toast.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.mr-contact__toast-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--vermilion);
  color: var(--bone);
  font-size: 10px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .mr-contact__glitch-top, .mr-contact__glitch-bot { display: none; }
  .mr-contact__toast { left: 16px; right: 16px; bottom: 16px; }
  .mr-contact__boot-text { font-size: 10px; }
}
`;
