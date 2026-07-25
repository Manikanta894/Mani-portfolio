"use client";
import { useEffect, useState } from "react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";
import { CHAPTER_NUMBERS } from "@/lib/chapterNumbers";

const API_BASE =
  typeof window !== "undefined"
    ? import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    : "";

/**
 * Ch12Contact — editorial, asymmetric redesign.
 * Uses the site's existing vermilion accent, white text for readability.
 */

const ACCENT = "var(--vermilion)";

export function Ch12Contact() {
  const { profile } = usePortfolio();
  const contactInfo = profile?.contact_info || {
    number: "",
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
    ],
  };

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
      setFormData({});
    } catch (err: any) {
      setSubmitStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" data-mood="ink" className="relative chapter-pad overflow-hidden">
      {/* Editorial ambient wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0 contact-ambient" />

      <div className="relative mx-auto max-w-6xl">
        {/* ── Masthead ───────────────────────────── */}
        <header className="mb-16 md:mb-24">
          <div className="text-mono text-[0.7rem] uppercase tracking-[0.28em] text-bone/50">
            /{CHAPTER_NUMBERS.contact} — {contactInfo.kicker}
          </div>

          <h2 className="text-display mt-6 leading-[0.92] tracking-[-0.025em]"
            style={{
              fontSize: "clamp(4rem, 14vw, 10rem)",
              color: "var(--bone)",
            }}
          >
            <MaskReveal>{contactInfo.title}</MaskReveal>
          </h2>

          <Reveal>
            <p className="text-display mt-6 max-w-3xl text-[clamp(1.8rem,3.6vw,3.2rem)] italic leading-[1.08] tracking-[-0.01em]"
              style={{ color: `color-mix(in oklab, var(--bone) 88%, transparent)` }}
            >
              {contactInfo.prompt}
            </p>
          </Reveal>
        </header>

        {/* ── Asymmetric body: form left, info right ─────── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
          {/* FORM */}
          <Reveal>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="space-y-8">
                {(contactInfo.fields || []).map((f: any) => {
                  const isMessage = f.name === "message";
                  return (
                    <label key={f.name} className="group block">
                      <span className="contact-label">{f.name}:</span>
                      {isMessage ? (
                        <textarea
                          rows={5}
                          placeholder={f.placeholder}
                          value={formData[f.name] || ""}
                          onChange={(e) => handleChange(f.name, e.target.value)}
                          className="contact-input contact-textarea"
                        />
                      ) : (
                        <input
                          type={f.name === "email" ? "email" : "text"}
                          placeholder={f.placeholder}
                          value={formData[f.name] || ""}
                          onChange={(e) => handleChange(f.name, e.target.value)}
                          className="contact-input"
                        />
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="contact-submit"
                >
                  <span className="relative z-10">
                    {submitting ? "Sending…" : "Send message"}
                  </span>
                </button>
                <span className="text-mono text-[0.7rem] uppercase tracking-[0.22em]"
                  style={{ color: `color-mix(in oklab, var(--bone) 50%, transparent)` }}
                >
                  {submitStatus === "success"
                    ? "· Message sent ✓"
                    : submitStatus === "error"
                    ? `· ${errorMessage}`
                    : "· All fields welcome"}
                </span>
              </div>
            </form>
          </Reveal>

          {/* INFO PANEL */}
          <Reveal delay={0.1}>
            <aside className="contact-info">
              {/* Status chip */}
              <div className="contact-chip">{contactInfo.status}</div>

              {/* Practice areas */}
              <p className="contact-practice">{contactInfo.practice}</p>

              {/* Availability */}
              <p className="contact-availability">{contactInfo.availability}</p>

              {/* Divider */}
              <div className="contact-divider" />

              {/* Channels */}
              <div className="space-y-4">
                <div className="text-mono text-[0.65rem] uppercase tracking-[0.3em]"
                  style={{ color: `color-mix(in oklab, var(--bone) 45%, transparent)` }}
                >
                  Reach me at
                </div>
                <ul className="space-y-3">
                  {(contactInfo.channels || []).map((c: any) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-channel"
                      >
                        <span className="contact-channel__label">{c.label}</span>
                        <span className="contact-channel__value">{c.value}</span>
                        <span className="contact-channel__arrow">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>

      <style>{`
        :root {
          --contact-accent: var(--vermilion, #D46A2E);
        }

        .contact-ambient {
          background:
            radial-gradient(900px 600px at 8% 12%, color-mix(in oklab, var(--contact-accent) 6%, transparent), transparent 60%),
            radial-gradient(600px 400px at 92% 88%, color-mix(in oklab, var(--contact-accent) 5%, transparent), transparent 55%);
        }

        .contact-form {
          width: 100%;
        }

        .contact-label {
          display: block;
          margin-bottom: 8px;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--contact-accent);
          transition: color .3s ease;
        }
        .contact-label::before {
          content: "// ";
          opacity: 0.5;
        }

        .contact-input {
          width: 100%;
          padding: 12px 0;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: clamp(1.05rem, 1.2vw, 1.15rem);
          line-height: 1.5;
          color: var(--bone);
          background: transparent;
          border: none;
          border-bottom: 1px solid color-mix(in oklab, var(--bone) 16%, transparent);
          outline: none;
          transition: border-color .3s ease, padding-left .3s ease;
        }
        .contact-input::placeholder {
          color: color-mix(in oklab, var(--bone) 35%, transparent);
          font-style: italic;
        }
        .contact-input:focus {
          border-bottom-color: var(--contact-accent);
          padding-left: 4px;
        }
        .contact-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .contact-submit {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 40px;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.75rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--ink);
          background: var(--bone);
          border: none;
          border-radius: 0;
          cursor: pointer;
          overflow: hidden;
          transition: transform .35s ease, box-shadow .35s ease;
          box-shadow: 0 8px 24px -8px rgba(0,0,0,0.4);
        }
        .contact-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px -10px rgba(0,0,0,0.5);
        }
        .contact-submit:active {
          transform: translateY(0);
        }
        .contact-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .contact-submit::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform .6s cubic-bezier(.2,.8,.2,1);
        }
        .contact-submit:hover::after {
          transform: translateX(100%);
        }

        /* ── Info panel ────────────────────────── */
        .contact-info {
          padding: 0;
        }

        .contact-chip {
          display: inline-block;
          padding: 8px 18px;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.65rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--contact-accent);
          border: 1px solid color-mix(in oklab, var(--contact-accent) 27%, transparent);
          background: color-mix(in oklab, var(--contact-accent) 5%, transparent);
          margin-bottom: 20px;
        }

        .contact-practice {
          font-family: var(--font-display, "Instrument Serif", serif);
          font-size: clamp(1.2rem, 1.6vw, 1.4rem);
          line-height: 1.45;
          color: color-mix(in oklab, var(--bone) 82%, transparent);
          margin-bottom: 14px;
        }

        .contact-availability {
          font-size: 0.95rem;
          line-height: 1.7;
          color: color-mix(in oklab, var(--bone) 70%, transparent);
        }

        .contact-divider {
          height: 1px;
          width: 48px;
          background: color-mix(in oklab, var(--contact-accent) 40%, transparent);
          margin: 28px 0;
        }

        .contact-channel {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          padding: 10px 14px;
          border: 1px solid color-mix(in oklab, var(--bone) 10%, transparent);
          transition: border-color .3s ease, background .3s ease, transform .3s ease;
        }
        .contact-channel:hover {
          border-color: color-mix(in oklab, var(--contact-accent) 27%, transparent);
          background: color-mix(in oklab, var(--contact-accent) 3%, transparent);
          transform: translateX(4px);
        }
        .contact-channel__label {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: color-mix(in oklab, var(--bone) 55%, transparent);
          min-width: 56px;
        }
        .contact-channel__value {
          flex: 1;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.95rem;
          color: var(--bone);
        }
        .contact-channel__arrow {
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.8rem;
          color: var(--contact-accent);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity .3s ease, transform .3s ease;
        }
        .contact-channel:hover .contact-channel__arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @media (max-width: 768px) {
          .contact-submit {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}