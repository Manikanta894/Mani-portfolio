"use client";
import { useState } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const API = "/api/public";
const TOPICS = ["Job Opportunity", "Research", "Consulting", "Speaking", "Startup", "Networking", "Other"];

function LiIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>); }
function GhIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>); }
function MailIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>); }
function OrcidSvg() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 7h2.5c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8V7zm2.5 4.5c1.2 0 2-.6 2-1.5s-.8-1.5-2-1.5H9.5v3h1zM8 15.5h3l2 3h1.8l-2.2-3.2c1-.3 1.8-1.2 1.8-2.3 0-1.8-1.2-3-3.2-3H8v8.5z"/></svg>); }

export default function Ch09LinkedIn() {
  const { profile, linkedInFeed } = usePortfolio();
  const li = linkedInFeed || {};
  const p = { name: profile?.name || "Manikanta R", location: profile?.location || "Bengaluru, India", email: "hello@manikantar.in" };
  const [form, setForm] = useState<Record<string, string>>({});
  const [topic, setTopic] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => { e.preventDefault(); setSending(true); try { const res = await fetch(`${API}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, subject: topic }) }); const data = await res.json(); if (data.success) { setSent(true); setForm({}); setTopic(""); } else { alert(`Failed to send: ${data.error || "Unknown error"}`); } } catch (err) { alert(`Network error: ${err}`); } finally { setSending(false); } };
  const copyEmail = () => { navigator.clipboard?.writeText(p.email); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <section id="linkedin" className="relative bg-[#F7F4EC] text-[#111] overflow-hidden" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* MR Watermark */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <span className="absolute top-1/2 left-[4%] -translate-y-1/2 font-display italic text-[clamp(400px,40vw,560px)] leading-none text-[#111]/[0.02] blur-[1px]">MR</span>
      </div>

      <div className="flex-1 flex items-center">
        <div className="w-full mx-auto px-8 sm:px-12 py-14 sm:py-16" style={{ maxWidth: "1440px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: "clamp(40px,6vw,64px)" }}>
            {/* LEFT — 46% */}
            <motion.div className="lg:col-span-5" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <div className="font-mono text-[0.85rem] uppercase tracking-[0.14em] text-black/40 mb-4">
                <span className="text-[#D96D22] font-bold mr-2">09</span>Connect
              </div>

              <h1 className="font-display italic leading-[0.88] tracking-[-0.045em] text-[#111] mb-4 whitespace-nowrap font-medium" style={{ fontSize: "clamp(5.5rem,8vw,7.5rem)" }}>
                {p.name.split(" ")[0]} <span className="text-[#D96D22]">{p.name.split(" ").slice(1).join(" ")}.</span>
              </h1>

              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[0.9rem] font-mono uppercase tracking-[0.2em] text-black/[0.52] font-medium mb-4">
                <span>MBA Candidate</span><span className="text-black/15">·</span>
                <span>HR &amp; BA</span><span className="text-black/15">·</span>
                <span>AI Research</span><span className="text-black/15">·</span>
                <span>Strategy</span>
              </div>

              <p className="font-display italic leading-[0.96] tracking-[-0.03em] text-[#111] mb-4 font-medium" style={{ fontSize: "clamp(2rem,3.2vw,3.2rem)" }}>
                Let&apos;s Build Something Meaningful.
              </p>

              <p className="text-[clamp(1rem,1.15vw,1.2rem)] leading-[1.7] text-black/[0.82] max-w-[560px] mb-4">
                I enjoy solving real-world business problems through AI, analytics, research and strategy. Whether you&apos;re hiring, collaborating, or simply exchanging ideas — I&apos;d love to hear from you.
              </p>
              <p className="text-[0.95rem] text-black/50 italic mb-6">
                Currently building AI-powered HR research, analytics dashboards and business strategy projects from {p.location}. <span className="font-display text-[#D96D22]">— Manikanta R.</span>
              </p>

              <div className="space-y-0 mb-6">
                {[
                  { icon: "📧", label: "EMAIL", value: p.email, action: true },
                  { icon: "📍", label: "LOCATION", value: p.location, action: false },
                  { icon: "🟢", label: "STATUS", value: "Open for Opportunities", action: false },
                  { icon: "⏱", label: "RESPONSE", value: "Within 24 Hours", action: false },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3 border-b border-black/5 group cursor-pointer hover:bg-black/[0.015] transition-all duration-200 px-1 -mx-1 rounded" style={{ height: "52px" }}
                    onClick={r.action ? copyEmail : undefined}>
                    <span className="text-base opacity-40 shrink-0">{r.icon}</span>
                    <span className="text-[0.75rem] font-mono uppercase tracking-[0.16em] text-black/45 w-24 shrink-0 font-semibold">{r.label}</span>
                    <span className="text-[1rem] text-black/70 group-hover:text-[#D96D22] transition-colors flex-1 font-medium">{r.value}</span>
                    {r.action && <span className="text-[0.7rem] font-mono tracking-[0.06em] text-[#D96D22]/50 group-hover:text-[#D96D22] transition-colors shrink-0">{copied ? "COPIED ✓" : "COPY →"}</span>}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/manikanta894/", icon: <LiIcon /> },
                  { label: "GitHub", href: "https://github.com/Manikanta894/Manikanta894", icon: <GhIcon /> },
                  { label: "Email", href: `mailto:${p.email}`, icon: <MailIcon /> },
                  { label: "ORCID", href: "https://orcid.org/0009-0005-2576-8731", icon: <OrcidSvg /> },
                  { label: "Resume", href: "https://manikantar.in/resume.pdf" },
                ].map((l) => (
                  <motion.a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                    className="group flex items-center gap-2 px-4 py-2 rounded-full border border-black/8 text-[0.82rem] font-mono tracking-[0.04em] text-black/50 hover:border-[#D96D22]/30 hover:text-[#D96D22] hover:shadow-sm hover:shadow-[#D96D22]/5 transition-all duration-200"
                    style={{ height: "42px" }}
                    whileHover={{ y: -2 }}>
                    <span className="opacity-45 group-hover:opacity-100 group-hover:rotate-[6deg] transition-all duration-200">{l.icon}</span>
                    {l.label} <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — 54% */}
            <div className="lg:col-span-7">
              <div className="lg:sticky lg:top-16">
                {sent ? (
                  <motion.div className="rounded-3xl border border-black/8 bg-[#111] text-[#F7F4EC] px-10 py-14 text-center" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                    <div className="w-16 h-16 rounded-full bg-[#D96D22]/20 flex items-center justify-center mx-auto mb-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D96D22" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5" strokeLinecap="round"/></svg>
                    </div>
                    <h3 className="font-display text-[2rem] mb-2">Message Sent!</h3>
                    <p className="text-white/45 mb-5 text-base">Thank you for reaching out. I&apos;ll reply within 24 hours.</p>
                    <button onClick={() => { setSent(false); setForm({}); setTopic(""); }} className="text-[0.85rem] font-mono text-[#D96D22] border border-[#D96D22]/30 rounded-full px-5 py-2 hover:bg-[#D96D22]/10 transition-all">Send another</button>
                  </motion.div>
                ) : (
                  <div className="rounded-3xl border border-black/8 bg-white/40 backdrop-blur-sm px-8 sm:px-10 py-8 sm:py-10 shadow-sm">
                    <h3 className="font-display leading-[0.94] text-[#111] mb-1" style={{ fontSize: "clamp(1.8rem,2.8vw,2.8rem)" }}>Start a Conversation</h3>
                    <p className="text-[clamp(0.95rem,1.1vw,1.1rem)] text-black/50 mb-6">Every meaningful collaboration begins with a simple message.</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {TOPICS.map((t) => (
                        <button key={t} type="button" onClick={() => setTopic(t === topic ? "" : t)}
                          className={`px-4 py-2 rounded-full text-[0.82rem] font-mono tracking-[0.04em] transition-all duration-200
                            ${topic === t ? "bg-[#D96D22] text-white shadow-sm shadow-[#D96D22]/20" : "border border-black/10 text-black/50 hover:border-[#D96D22]/30 hover:text-[#D96D22]"}`}>
                          {t}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" required value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Your name"
                          className="w-full bg-transparent border-b-2 border-black/10 py-3 text-[0.95rem] text-[#111] placeholder:text-black/25 outline-none transition-all duration-200 focus:border-[#D96D22]" />
                        <input type="email" required value={form.email || ""} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          placeholder="you@company.com"
                          className="w-full bg-transparent border-b-2 border-black/10 py-3 text-[0.95rem] text-[#111] placeholder:text-black/25 outline-none transition-all duration-200 focus:border-[#D96D22]" />
                      </div>
                      <textarea required value={form.message || ""} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        placeholder="Tell me about your project or opportunity..." rows={4}
                        className="w-full bg-transparent border-b-2 border-black/10 py-3 text-[0.95rem] text-[#111] placeholder:text-black/25 outline-none transition-all duration-200 focus:border-[#D96D22] resize-none" />

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-[0.72rem] text-black/30 font-mono">Typical reply: &lt; 24h</p>
                        <motion.button type="submit" disabled={sending}
                          className="flex items-center justify-center gap-2 rounded-full text-white font-mono tracking-[0.04em] uppercase transition-all duration-200 disabled:opacity-50"
                          style={{ height: "48px", width: "200px", fontSize: "0.82rem", background: "#D96D22", boxShadow: "0 4px 16px -4px rgba(217,109,34,0.35)" }}
                          whileHover={{ y: -2, boxShadow: "0 8px 24px -6px rgba(217,109,34,0.5)" }} whileTap={{ scale: 0.97 }}>
                          {sending ? "Sending..." : <>Send Message →</>}
                        </motion.button>
                      </div>
                    </form>

                    <div className="mt-6 pt-5 border-t border-black/6">
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-black/35 font-semibold">Currently Accepting</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {["Research", "Consulting", "Speaking", "AI Projects"].map((s) => (
                          <span key={s} className="px-3 py-1.5 rounded-full bg-[#D96D22]/5 border border-[#D96D22]/12 text-[0.75rem] font-mono text-[#D96D22]">{s}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[0.7rem] font-mono text-black/30">
                        <div><span className="block text-[0.6rem] uppercase tracking-[0.1em] text-black/25 font-semibold">Response</span>&lt; 24h</div>
                        <div><span className="block text-[0.6rem] uppercase tracking-[0.1em] text-black/25 font-semibold">Available</span>Mon–Sat</div>
                        <div><span className="block text-[0.6rem] uppercase tracking-[0.1em] text-black/25 font-semibold">Timezone</span>GMT +5:30</div>
              </div>

               {/* LinkedIn Live Metrics */}
              {li.followers && (
                <motion.div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  {[
                    { label: "Followers", value: li.followers, fmt: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : String(v) },
                    { label: "Connections", value: li.connections || 300, fmt: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : `${v}+` },
                    { label: "Impressions", value: li.impressions, fmt: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : String(v) },
                    { label: "Engagements", value: li.engagements, fmt: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : String(v) },
                  ].map((m, i) => (
                    <motion.div key={m.label} className="rounded-xl border border-black/6 bg-white/40 p-3.5 text-center hover:border-[#0077B5]/30 transition-colors"
                      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}>
                      <div className="font-display text-[1.3rem] leading-none text-[#0077B5]">{m.fmt(m.value || 0)}</div>
                      <div className="text-[0.65rem] font-mono uppercase tracking-[0.08em] text-black/40 mt-1">{m.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Featured LinkedIn Posts */}
              {(li.featured || li.editors_pick) && (
                <div className="mt-4 space-y-2">
                  {[li.featured, li.editors_pick].filter(Boolean).map((post: any, i: number) => (
                    <a key={i} href={post.url} target="_blank" rel="noreferrer"
                      className="block rounded-xl border border-black/6 bg-white/30 p-3.5 hover:border-[#0077B5]/25 hover:bg-white/50 transition-all duration-200 group">
                      <div className="text-[0.65rem] font-mono uppercase tracking-[0.1em] text-[#0077B5] font-semibold mb-1">{i === 0 ? "Top Post" : "Editor's Pick"}</div>
                      <div className="text-[0.85rem] font-medium leading-snug text-[#111] group-hover:text-[#0077B5] transition-colors">{post.title}</div>
                      <div className="flex items-center gap-3 mt-2 text-[0.7rem] font-mono text-black/35">
                        {post.metrics?.likes && <span>{post.metrics.likes} likes</span>}
                        {post.metrics?.comments && <span>{post.metrics.comments} comments</span>}
                        <span className="ml-auto text-[#0077B5]/50 group-hover:translate-x-0.5 transition-transform">View →</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
              </div>

              {/* Resume Summary & Quick Connect */}
              <div className="mt-5 space-y-3">
                {/* Resume Preview */}
                <div className="rounded-xl border border-black/6 bg-white/30 backdrop-blur-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-black/40 font-semibold">Resume Summary</span>
                    <a href="https://manikantar.in/resume.pdf" target="_blank" rel="noreferrer" className="text-[0.7rem] font-mono text-[#D96D22] hover:underline">PDF ↓</a>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="font-display text-[1.2rem] leading-none text-[#D96D22]">6+</div>
                      <div className="text-[0.6rem] font-mono uppercase tracking-[0.06em] text-black/35 mt-0.5">Years</div>
                    </div>
                    <div>
                      <div className="font-display text-[1.2rem] leading-none text-[#D96D22]">6</div>
                      <div className="text-[0.6rem] font-mono uppercase tracking-[0.06em] text-black/35 mt-0.5">Papers</div>
                    </div>
                    <div>
                      <div className="font-display text-[1.2rem] leading-none text-[#D96D22]">12</div>
                      <div className="text-[0.6rem] font-mono uppercase tracking-[0.06em] text-black/35 mt-0.5">Certs</div>
                    </div>
                  </div>
                </div>

                {/* Quick Connect */}
                <div className="flex flex-wrap gap-2">
                  <a href="https://www.linkedin.com/in/manikanta894/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/6 bg-white/30 text-[0.75rem] font-mono text-black/50 hover:text-[#D96D22] hover:border-[#D96D22]/25 transition-all">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    Message
                  </a>
                  <button onClick={copyEmail} className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/6 bg-white/30 text-[0.75rem] font-mono text-black/50 hover:text-[#D96D22] hover:border-[#D96D22]/25 transition-all">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>
                    {copied ? "Copied!" : "Email"}
                  </button>
                </div>
              </div>
            </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/6 px-8 sm:px-12 py-9">
        <div className="mx-auto text-center" style={{ maxWidth: "1440px" }}>
          <p className="font-display italic text-[clamp(1.2rem,1.6vw,1.5rem)] text-[#111] mb-1">Every great collaboration starts with curiosity.</p>
          <p className="text-[0.8rem] font-mono text-black/30">&copy; 2026 Manikanta R. — Designed &amp; Built with intention.</p>
          <p className="font-display italic text-[1rem] text-[#D96D22]/50 mt-4">Curiosity never graduates.</p>
        </div>
      </div>
    </section>
  );
}
