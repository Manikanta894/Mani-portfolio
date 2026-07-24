"use client";
import { useEffect, useState } from "react";
import usePortfolio from "@/hooks/usePortfolio";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

const API_BASE =
  typeof window !== "undefined"
    ? import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    : "";

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
      { label: "X / Twitter", value: "@ishaan___04", href: "https://x.com/ishaan___04" },
      { label: "Instagram", value: "@mani___894", href: "https://instagram.com/mani___894" },
    ],
    response: "average response time · < 48h",
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

  const [latency, setLatency] = useState(38);
  useEffect(() => {
    const i = setInterval(() => setLatency(30 + Math.floor(Math.random() * 30)), 1800);
    return () => clearInterval(i);
  }, []);

  return (
    <section id="contact" data-mood="ink" className="relative chapter-pad grain">
      <div className="mx-auto max-w-6xl">
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
          <div className="col-span-12 md:col-span-7">
            <Reveal>
              <form onSubmit={handleSubmit}
                className="rounded-sm border border-bone/15 bg-ink"
              >
                <div className="flex items-center gap-2 border-b border-bone/15 px-4 py-2.5 text-mono text-eyebrow text-bone/45">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-bone/25" />
                    <span className="h-2 w-2 rounded-full bg-bone/25" />
                    <span className="h-2 w-2 rounded-full bg-vermilion" />
                  </span>
                  <span>~/manikantar.in/contact ⌁ ping {latency}ms</span>
                </div>
                <div className="space-y-4 p-6">
                  {contactInfo.fields.map((f: any) => {
                    const isMessage = f.name === "message";
                    const required = f.name === "name" || f.name === "email";
                    return (
                      <label key={f.name} className="block">
                        <span className="text-mono block text-eyebrow text-vermilion">{">"} {f.name}:</span>
                        {isMessage ? (
                          <textarea required={required} rows={4} placeholder={f.placeholder} value={formData[f.name] || ""} onChange={(e) => handleChange(f.name, e.target.value)} className="text-mono mt-1 w-full resize-none border-b border-bone/20 bg-transparent py-2 text-[0.85rem] text-bone placeholder:text-bone/30 focus:border-vermilion focus:outline-none" />
                        ) : (
                          <input type={f.name === "email" ? "email" : "text"} required={required} placeholder={f.placeholder} value={formData[f.name] || ""} onChange={(e) => handleChange(f.name, e.target.value)} className="text-mono mt-1 w-full border-b border-bone/20 bg-transparent py-2 text-[0.85rem] text-bone placeholder:text-bone/30 focus:border-vermilion focus:outline-none" />
                        )}
                      </label>
                    );
                  })}
                  <div className="flex items-center justify-between pt-2">
                    <button type="submit" disabled={submitting} className="text-mono inline-flex items-center gap-2 border border-vermilion bg-vermilion px-4 py-2 text-meta uppercase text-bone hover:bg-bone hover:text-vermilion disabled:opacity-50">
                      <span>{">"} {submitting ? "sending..." : "transmit"}</span>
                      <span className="caret">▍</span>
                    </button>
                    <span className="text-mono text-eyebrow text-bone/45">
                      {submitStatus === "success" ? "// message sent ✓" : submitStatus === "error" ? `// ${errorMessage}` : "// awaiting input"}
                    </span>
                  </div>
                </div>
              </form>
            </Reveal>
          </div>

          <div className="col-span-12 md:col-span-5">
            <Reveal>
              <div className="border border-bone/15 bg-graphite p-6">
                <div className="text-mono text-eyebrow text-vermilion">:: connect</div>
                <div className="mt-1 text-mono text-meta text-bone/80">{contactInfo.status}</div>
                <p className="mt-3 text-mono text-meta text-bone/55">{contactInfo.practice}</p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-bone/75">{contactInfo.availability}</p>
                <ul className="mt-6 space-y-2.5">
                  {contactInfo.channels.map((c: any) => (
                    <li key={c.label} className="flex items-baseline justify-between gap-4 border-t border-bone/10 pt-2.5">
                      <span className="text-mono text-eyebrow text-bone/55">{c.label}</span>
                      <a href={c.href} target="_blank" rel="noreferrer" className="text-mono text-meta text-bone hover:text-vermilion">{c.value} ↗</a>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between text-mono text-eyebrow text-bone/45">
                  <span>// {contactInfo.response}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-vermilion pulse-dot" />
                    {latency}ms
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}