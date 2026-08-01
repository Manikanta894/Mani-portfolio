"use client";
import { useState } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const API_BASE = typeof window !== "undefined" ? import.meta.env.VITE_API_URL || "http://localhost:5000/api" : "";
const LINKEDIN_URL = "https://www.linkedin.com/in/manikanta894/";
const TOPICS = ["Job Opportunity", "Research", "Consulting", "Speaking", "Startup", "Networking", "Other"];

export default function Ch09LinkedIn() {
  const { profile } = usePortfolio();
  const p = {
    name: profile?.name || "Manikanta R",
    headline: profile?.tagline || "Building AI-powered business solutions through analytics, research, and human-centered strategy.",
    location: profile?.location || "Bengaluru, India",
    email: "hello@manikantar.in",
  };

  const [form, setForm] = useState<Record<string, string>>({});
  const [topic, setTopic] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try { await fetch(`${API_BASE}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, subject: topic }) }); setSent(true); }
    catch {} finally { setSending(false); }
  };

  return (
    <section id="linkedin" className="relative bg-[#F7F4EC] text-[#1E1E1E] overflow-hidden" style={{ minHeight: "90vh", display: "flex", flexDirection: "column" }}>
      <div className="flex-1 flex items-center">
        <div className="w-full mx-auto max-w-6xl px-5 sm:px-8 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            {/* LEFT — Identity */}
            <div className="lg:col-span-7">
              <div className="font-mono text-[0.8rem] uppercase tracking-[0.12em] text-[#8A8578] mb-6">
                <span className="text-[#D9782E] font-bold mr-2">09</span>Connect
              </div>

              <h1 className="font-display italic text-[clamp(3.2rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.02em] text-[#1E1E1E] mb-4">
                {p.name.split(" ")[0]}<br /><span className="text-[#D9782E]">{p.name.split(" ").slice(1).join(" ")}.</span>
              </h1>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.78rem] font-mono uppercase tracking-[0.08em] text-[#8A8578] mb-6">
                <span>MBA Candidate</span><span className="text-[#8A8578]/30">·</span>
                <span>HR &amp; Business Analytics</span><span className="text-[#8A8578]/30">·</span>
                <span>AI Research</span><span className="text-[#8A8578]/30">·</span>
                <span>Business Strategy</span><span className="text-[#8A8578]/30">·</span>
                <span>{p.location}</span>
              </div>

              <p className="font-display italic text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1] text-[#1E1E1E] mb-4">
                Let&apos;s Build Something Meaningful.
              </p>

              <p className="text-[0.95rem] leading-[1.7] text-[#8A8578] max-w-[44ch] mb-8">
                I enjoy solving real-world business problems through AI, analytics, research and strategy. Whether you&apos;re hiring, collaborating, or simply exchanging ideas — I&apos;d love to hear from you.
              </p>

              {/* Contact info */}
              <div className="space-y-2 mb-8 text-[0.85rem] text-[#8A8578]">
                <button onClick={() => { navigator.clipboard?.writeText(p.email); }} className="flex items-center gap-2 hover:text-[#D9782E] transition-colors group cursor-pointer">
                  <span className="opacity-60">✉</span> {p.email} <span className="text-[0.65rem] opacity-0 group-hover:opacity-50 transition-opacity ml-1">Click to copy</span>
                </button>
                <div className="flex items-center gap-2"><span className="opacity-60">📍</span> {p.location}</div>
                <div className="flex items-center gap-2"><span className="opacity-60">🕒</span> Replies within 24 Hours</div>
                <div className="flex items-center gap-2"><span className="opacity-60">💼</span> Open to Full-Time Opportunities</div>
                <div className="flex items-center gap-2"><span className="opacity-60">🤝</span> Available for Research Collaboration</div>
              </div>

              {/* Social links */}
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {[
                  { label: "LinkedIn", href: LINKEDIN_URL },
                  { label: "GitHub", href: "https://github.com/manikantar" },
                  { label: "Email", href: `mailto:${p.email}` },
                  { label: "ORCID", href: "https://orcid.org/0009-0005-2576-8731" },
                  { label: "SSRN", href: "https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=9646252" },
                  { label: "Resume", href: "https://manikantar.in/resume.pdf" },
                ].map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                    className="group flex items-center gap-1.5 text-[0.8rem] font-mono tracking-[0.04em] text-[#8A8578] hover:text-[#D9782E] transition-colors duration-250 border-b border-transparent hover:border-[#D9782E]/40 pb-0.5">
                    {l.label} <span className="inline-block group-hover:translate-x-0.5 transition-transform duration-250">→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT — Conversation */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                {sent ? (
                  <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-14 h-14 rounded-full bg-[#D9782E]/10 flex items-center justify-center mx-auto mb-4">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D9782E" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5" strokeLinecap="round"/></svg>
                    </div>
                    <h3 className="font-display text-[1.4rem] text-[#1E1E1E] mb-1">Message Sent.</h3>
                    <p className="text-[#8A8578] mb-4">I&apos;ll reply within 24 hours.</p>
                    <button onClick={() => { setSent(false); setForm({}); setTopic(""); }} className="text-[0.8rem] font-mono text-[#D9782E] underline hover:no-underline">Send another</button>
                  </motion.div>
                ) : (
                  <>
                    <h3 className="font-display text-[1.4rem] text-[#1E1E1E] mb-1">Start a Conversation.</h3>
                    <p className="text-[0.85rem] text-[#8A8578] mb-5">Every meaningful collaboration begins with a simple message.</p>

                    {/* Topic chips */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {TOPICS.map((t) => (
                        <button key={t} onClick={() => setTopic(t === topic ? "" : t)}
                          className={`px-3.5 py-2 rounded-full text-[0.75rem] font-mono tracking-[0.04em] transition-all duration-250
                            ${topic === t ? "bg-[#1E1E1E] text-[#F7F4EC]" : "border border-[#1E1E1E]/12 text-[#8A8578] hover:border-[#D9782E]/25 hover:text-[#D9782E]"}`}>
                          {t}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                      {[
                        { name: "name", placeholder: "Your full name", required: true },
                        { name: "email", placeholder: "you@company.com", required: true, type: "email" },
                        { name: "message", placeholder: "What would you like to discuss?", required: true, area: true },
                      ].map((f) => (
                        <div key={f.name}>
                          {f.area ? (
                            <textarea
                              required={f.required}
                              value={form[f.name] || ""}
                              onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                              placeholder={f.placeholder}
                              rows={4}
                              className="w-full bg-transparent border-b-2 border-[#1E1E1E]/10 py-3 text-[0.95rem] text-[#1E1E1E] placeholder:text-[#8A8578]/45 outline-none transition-colors duration-250 focus:border-[#D9782E] resize-none"
                            />
                          ) : (
                            <input
                              type={f.type || "text"}
                              required={f.required}
                              value={form[f.name] || ""}
                              onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                              placeholder={f.placeholder}
                              className="w-full bg-transparent border-b-2 border-[#1E1E1E]/10 py-3 text-[0.95rem] text-[#1E1E1E] placeholder:text-[#8A8578]/45 outline-none transition-colors duration-250 focus:border-[#D9782E]"
                            />
                          )}
                        </div>
                      ))}

                      <div className="pt-2">
                        <motion.button type="submit" disabled={sending}
                          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9782E] text-white font-mono text-[0.85rem] tracking-[0.04em] hover:bg-[#c06820] hover:shadow-lg hover:shadow-[#D9782E]/20 transition-all duration-300 disabled:opacity-50"
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                          {sending ? "Sending..." : <>Send Message →</>}
                        </motion.button>
                        <p className="mt-3 text-[0.72rem] text-[#8A8578]/60">I personally reply within 24 hours.</p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Closing */}
      <div className="border-t border-[#1E1E1E]/6 px-5 sm:px-8 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display italic text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.2] text-[#1E1E1E] mb-3">
            Thank you for exploring my work.
          </p>
          <p className="text-[0.9rem] text-[#8A8578] mb-6">
            Every project in this portfolio started with curiosity.<br />Maybe the next one starts with this conversation.
          </p>
          <p className="text-[0.8rem] text-[#8A8578]/50 mb-8">— Manikanta R.</p>

          <div className="text-[0.7rem] font-mono text-[#8A8578]/40 space-y-1">
            <p>&copy; 2026 Manikanta R. &mdash; Designed &amp; Built with intention.</p>
            <p>React &bull; TypeScript &bull; Framer Motion &bull; GSAP &bull; Supabase &bull; Vercel</p>
          </div>

          <p className="font-display italic text-[1rem] text-[#D9782E]/60 mt-6">Curiosity never graduates.</p>
        </div>
      </div>
    </section>
  );
}
