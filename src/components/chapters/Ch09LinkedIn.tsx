"use client";
import { useState } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const API_BASE = typeof window !== "undefined" ? import.meta.env.VITE_API_URL || "http://localhost:5000/api" : "";
const TOPICS = ["Job Opportunity", "Research", "Consulting", "Speaking", "Startup", "Networking", "Other"];

function LiIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>); }
function GhIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>); }
function MailIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>); }
function OrcidSvg() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 7h2.5c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8V7zm2.5 4.5c1.2 0 2-.6 2-1.5s-.8-1.5-2-1.5H9.5v3h1zM8 15.5h3l2 3h1.8l-2.2-3.2c1-.3 1.8-1.2 1.8-2.3 0-1.8-1.2-3-3.2-3H8v8.5z"/></svg>); }

export default function Ch09LinkedIn() {
  const { profile } = usePortfolio();
  const p = { name: profile?.name || "Manikanta R", location: profile?.location || "Bengaluru, India", email: "hello@manikantar.in" };
  const [form, setForm] = useState<Record<string, string>>({});
  const [topic, setTopic] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSending(true); try { await fetch(`${API_BASE}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, subject: topic }) }); setSent(true); } catch {} finally { setSending(false); } };
  const copyEmail = () => { navigator.clipboard?.writeText(p.email); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section id="linkedin" className="relative bg-[#F7F4EC] text-[#111] overflow-hidden" style={{ minHeight: "95vh", display: "flex", flexDirection: "column" }}>
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute top-1/2 left-[3%] -translate-y-1/2 font-display italic text-[clamp(500px,50vw,700px)] leading-none text-[#111]/[0.035]">MR</span>
      </div>

      <div className="flex-1 flex items-center">
        <div className="w-full mx-auto max-w-6xl px-6 sm:px-10 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <div className="font-mono text-[clamp(0.8rem,1vw,0.9rem)] uppercase tracking-[0.14em] text-black/40 mb-4">
                <span className="text-[#D96D22] font-bold mr-2">09</span>Connect
              </div>

              <h1 className="font-display italic leading-[0.86] tracking-[-0.05em] text-[#111] mb-3 whitespace-nowrap font-medium" style={{ fontSize: "clamp(5.5rem,9vw,8.5rem)" }}>
                {p.name.split(" ")[0]} <span className="text-[#D96D22]">{p.name.split(" ").slice(1).join(" ")}.</span>
              </h1>

              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[clamp(0.85rem,1.1vw,1rem)] font-mono uppercase tracking-[0.22em] text-black/50 font-medium mb-4">
                <span>MBA</span><span className="text-black/15">·</span>
                <span>HR &amp; BA</span><span className="text-black/15">·</span>
                <span>AI Research</span><span className="text-black/15">·</span>
                <span>Strategy</span>
              </div>

              <p className="font-display italic leading-[0.94] tracking-[-0.03em] text-[#111] mb-3" style={{ fontSize: "clamp(3rem,5vw,4rem)" }}>
                Let&apos;s Build Something Meaningful.
              </p>

              <p className="text-[clamp(1.1rem,1.3vw,1.4rem)] leading-[1.7] text-black/[0.82] max-w-[540px] mb-3">
                I enjoy solving real-world business problems through AI, analytics, research and strategy. Whether you&apos;re hiring, collaborating, or simply exchanging ideas — I&apos;d love to hear from you.
              </p>
              <p className="text-[1rem] text-black/50 italic mb-6">
                Currently building AI-powered HR research, analytics dashboards and business strategy projects from {p.location}. <span className="font-display text-[#D96D22]">— Manikanta R.</span>
              </p>

              <div className="space-y-0 mb-5">
                {[
                  { icon: "✉", label: "Email", value: p.email, action: true },
                  { icon: "📍", label: "Location", value: p.location },
                  { icon: "🟢", label: "Status", value: "Open for Opportunities" },
                  { icon: "⏱", label: "Response Time", value: "Usually within 24 hours" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3 py-3.5 border-b border-black/8 group cursor-pointer hover:bg-black/[0.02] transition-all duration-[220ms] px-1 -mx-1 rounded" onClick={r.action ? copyEmail : undefined}>
                    <span className="w-7 text-center shrink-0 text-lg opacity-45">{r.icon}</span>
                    <span className="text-[0.9rem] font-mono uppercase tracking-[0.16em] text-black/60 w-36 shrink-0 font-medium">{r.label}</span>
                    <span className="text-[1.1rem] text-black/75 group-hover:text-[#D96D22] transition-colors flex-1 font-medium">{r.value}</span>
                    {r.action && <span className="text-[0.85rem] font-mono text-[#D96D22]/50 group-hover:text-[#D96D22] transition-colors shrink-0">{copied ? "Copied ✓" : "Copy →"}</span>}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-x-7 gap-y-2.5">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/manikanta894/", icon: <LiIcon /> },
                  { label: "GitHub", href: "https://github.com/manikantar", icon: <GhIcon /> },
                  { label: "Email", href: `mailto:${p.email}`, icon: <MailIcon /> },
                  { label: "ORCID", href: "https://orcid.org/0009-0005-2576-8731", icon: <OrcidSvg /> },
                  { label: "Resume", href: "https://manikantar.in/resume.pdf" },
                ].map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                    className="group flex items-center gap-2 text-[1rem] font-mono tracking-[0.04em] text-black/50 hover:text-[#D96D22] transition-colors duration-[220ms] pb-1 border-b border-transparent hover:border-[#D96D22]/40">
                    <span className="opacity-45 group-hover:opacity-100 group-hover:rotate-[8deg] transition-all duration-[220ms]">{l.icon}</span>
                    {l.label} <span className="inline-block group-hover:translate-x-1 transition-transform duration-[220ms]">→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                {sent ? (
                  <motion.div className="py-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-16 h-16 rounded-full bg-[#D96D22]/10 flex items-center justify-center mx-auto mb-4">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D96D22" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5" strokeLinecap="round"/></svg>
                    </div>
                    <h3 className="font-display text-[2rem] text-[#111] mb-1">Message Sent.</h3>
                    <p className="text-[1.05rem] text-black/55 mb-3">I&apos;ll reply within 24 hours.</p>
                    <button onClick={() => { setSent(false); setForm({}); setTopic(""); }} className="text-[0.9rem] font-mono text-[#D96D22] underline hover:no-underline">Send another</button>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="font-display text-[clamp(2.4rem,3.5vw,3.2rem)] text-[#111] mb-1 leading-[0.94]">Start a Conversation.</h3>
                    <p className="text-[1.05rem] text-black/50 mb-6">Every meaningful collaboration begins with a simple message.</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {TOPICS.map((t) => (
                        <button key={t} onClick={() => setTopic(t === topic ? "" : t)}
                          className={`px-4 py-2.5 rounded-full text-[0.9rem] font-mono tracking-[0.04em] transition-all duration-[220ms]
                            ${topic === t ? "bg-[#111] text-[#F7F4EC]" : "border border-black/10 text-black/50 hover:border-[#D96D22]/25 hover:text-[#D96D22]"}`}>
                          {t}
                        </button>
                      ))}
                    </div>

                    <motion.form onSubmit={submit} className="space-y-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      {[
                        { name: "name", placeholder: "Your name", required: true },
                        { name: "email", placeholder: "you@company.com", required: true, type: "email" },
                        { name: "message", placeholder: "Tell me about your project, idea or opportunity...", required: true, area: true },
                      ].map((f) => (
                        <div key={f.name}>
                          {f.area ? (
                            <textarea required={f.required} value={form[f.name] || ""} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                              placeholder={f.placeholder} rows={3}
                              className="w-full bg-transparent border-b-2 border-black/10 py-4 text-[1.1rem] text-[#111] placeholder:text-black/35 outline-none transition-colors duration-[220ms] focus:border-[#D96D22] focus:border-b-[3px] resize-none" style={{ minHeight: "180px" }} />
                          ) : (
                            <input type={f.type || "text"} required={f.required} value={form[f.name] || ""} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                              placeholder={f.placeholder}
                              className="w-full bg-transparent border-b-2 border-black/10 py-4 text-[1.1rem] text-[#111] placeholder:text-black/35 outline-none transition-colors duration-[220ms] focus:border-[#D96D22] focus:border-b-[3px]" style={{ height: "60px" }} />
                          )}
                        </div>
                      ))}

                      <div className="pt-3">
                        <motion.button type="submit" disabled={sending}
                          className="inline-flex items-center gap-2 rounded-full bg-[#D96D22] text-white font-mono tracking-[0.08em] uppercase hover:bg-[#b85a1a] hover:shadow-xl hover:shadow-[#D96D22]/20 transition-all duration-[220ms] disabled:opacity-50"
                          style={{ padding: "18px 36px", fontSize: "1rem" }}
                          whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                          {sending ? "Sending..." : <>Send Message →</>}
                        </motion.button>
                      </div>
                    </motion.form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/6 px-6 sm:px-10 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display italic text-[clamp(1.2rem,1.6vw,1.5rem)] text-[#111] mb-1">Every great collaboration starts with curiosity.</p>
          <p className="text-[0.85rem] font-mono text-black/30">&copy; 2026 Manikanta R. — Designed &amp; Built with intention.</p>
          <p className="font-display italic text-[1rem] text-[#D96D22]/50 mt-4">Curiosity never graduates.</p>
        </div>
      </div>
    </section>
  );
}
