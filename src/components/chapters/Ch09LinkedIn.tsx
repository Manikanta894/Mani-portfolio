"use client";
import { useState } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import portrait from "@/assets/portrait.jpg";

const API_BASE = typeof window !== "undefined" ? import.meta.env.VITE_API_URL || "http://localhost:5000/api" : "";
const LINKEDIN_URL = "https://www.linkedin.com/in/manikanta894/";

const SUBJECTS = ["Job Opportunity", "Research Collaboration", "Speaking", "Project", "Networking", "Other"];

export default function Ch09LinkedIn() {
  const { profile } = usePortfolio();
  const p = {
    name: profile?.name || "Manikanta R",
    headline: profile?.tagline || "MBA Candidate · HR & Business Analytics · Researcher",
    location: profile?.location || "Bengaluru, India",
    email: "hello@manikantar.in",
  };
  const channels = profile?.contact_info?.channels || [
    { label: "LinkedIn", value: "/in/manikanta894", href: "https://linkedin.com/in/manikanta894" },
    { label: "Email", value: "hello@manikantar.in", href: "mailto:hello@manikantar.in" },
  ];

  const [form, setForm] = useState<Record<string, string>>({});
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch(`${API_BASE}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, subject }) });
      setSent(true);
    } catch {} finally { setSending(false); }
  };

  const FLOATING_WORDS = ["Research", "AI", "Analytics", "People", "Business", "Leadership", "Impact", "Innovation"];

  return (
    <section id="linkedin" className="relative bg-[#F7F4EC] text-[#1E1E1E] chapter-pad overflow-hidden">
      {/* Floating background words */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {FLOATING_WORDS.map((w, i) => (
          <motion.span
            key={w}
            className="absolute font-display italic text-[clamp(3rem,6vw,6rem)] text-[#1E1E1E]/[0.02] whitespace-nowrap"
            style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 3) * 30}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.015, 0.025, 0.015] }}
            transition={{ duration: 6 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          >{w}</motion.span>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT — Identity */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-2 font-mono text-[0.85rem] uppercase tracking-[0.1em] text-[#8A8578] mb-2">
                <span className="text-[#D9782E] font-bold">09</span>
                Connect
              </div>

              <h1 className="font-display italic text-[clamp(2.6rem,4.5vw,3.6rem)] leading-[0.94] text-[#1E1E1E] mb-1">
                {p.name.split(" ")[0]}<br /><span className="text-[#D9782E]">{p.name.split(" ").slice(1).join(" ")}.</span>
              </h1>

              <div className="text-[0.9rem] text-[#8A8578] mb-4 leading-relaxed">
                MBA Candidate · HR &amp; Business Analytics · AI Research · Business Strategy
              </div>

              <h2 className="font-display italic text-[clamp(1.7rem,2.5vw,2.2rem)] leading-[0.96] text-[#1E1E1E] mb-3">
                Let&apos;s Build<br />Something Meaningful.
              </h2>

              <p className="text-[0.88rem] leading-[1.65] text-[#8A8578] mb-6 max-w-[32ch]">
                Building AI-powered business solutions through analytics, research, and human-centered strategy. Always open to meaningful conversations and collaborations.
              </p>

              {/* Profile card */}
              <div className="rounded-2xl border border-[#1E1E1E]/8 bg-white/40 backdrop-blur-sm p-4 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-[3px] border-[#F0EAD9] shadow-sm">
                    <img src={portrait} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-display text-[1.1rem] leading-tight">{p.name}</div>
                    <div className="text-[0.78rem] text-[#8A8578] mt-0.5">MBA · HR &amp; Business Analytics</div>
                    <div className="flex items-center gap-2 mt-1.5 text-[0.75rem] text-[#8A8578]">
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Available</span>
                      <span>·</span>
                      <span>📍 {p.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="text-[0.78rem] text-[#8A8578] space-y-1 mb-4">
                <button onClick={() => { navigator.clipboard?.writeText(p.email); }} className="flex items-center gap-1.5 hover:text-[#D9782E] transition-colors group cursor-pointer">
                  <span className="text-[#D9782E]">✉</span> {p.email} <span className="text-[0.65rem] opacity-0 group-hover:opacity-60 transition-opacity">Click to copy</span>
                </button>
                <div className="flex items-center gap-1.5"><span className="text-[#D9782E]">🕒</span> Replies within 24 Hours</div>
                <div className="flex items-center gap-1.5"><span className="text-[#D9782E]">💼</span> Open to Full-Time &amp; Research Collaboration</div>
              </div>

              {/* Quick links with icons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "LinkedIn", href: LINKEDIN_URL },
                  { label: "GitHub", href: "https://github.com/manikantar" },
                  { label: "Email", href: `mailto:${p.email}`, accent: true },
                  { label: "ORCID", href: "https://orcid.org/0009-0005-2576-8731" },
                  { label: "Resume", href: "https://manikantar.in/resume.pdf" },
                ].map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                    className={`px-3.5 py-2 rounded-full text-[0.75rem] font-mono tracking-[0.04em] transition-all duration-200 hover:-translate-y-0.5
                      ${l.accent ? "bg-[#D9782E] text-white hover:bg-[#c06820] hover:shadow-md" : "border border-[#1E1E1E]/10 text-[#8A8578] hover:border-[#D9782E]/30 hover:text-[#D9782E]"}`}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Conversation Card */}
          <div className="lg:col-span-7">
            <motion.div className="rounded-2xl border border-[#1E1E1E]/6 bg-white/40 backdrop-blur-sm p-5 sm:p-7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {sent ? (
                <motion.div className="text-center py-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="w-14 h-14 rounded-full bg-[#D9782E]/10 flex items-center justify-center mx-auto mb-3">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D9782E" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5" strokeLinecap="round"/></svg>
                  </div>
                  <h3 className="font-display text-[1.3rem] text-[#1E1E1E] mb-1">Message Sent.</h3>
                  <p className="text-[#8A8578] mb-3">I&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({}); setSubject(""); }} className="text-[0.8rem] font-mono tracking-[0.06em] text-[#D9782E] underline hover:no-underline">Send another message</button>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-display text-[1.3rem] text-[#1E1E1E] mb-4">Start a Conversation.</h3>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {SUBJECTS.map((s) => (
                      <button key={s} onClick={() => setSubject(s === subject ? "" : s)}
                        className={`px-3.5 py-2 rounded-full text-[0.78rem] font-mono tracking-[0.04em] transition-all duration-200
                          ${subject === s ? "bg-[#1E1E1E] text-[#F7F4EC]" : "border border-[#1E1E1E]/12 text-[#8A8578] hover:border-[#D9782E]/30 hover:text-[#D9782E]"}`}>
                        {s}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { name: "name", label: "Name", placeholder: "Your full name", required: true },
                      { name: "email", label: "Email", placeholder: "you@company.com", required: true, type: "email" },
                      { name: "message", label: "Message", placeholder: "What would you like to discuss?", required: true },
                    ].map((f) => (
                      <div key={f.name}>
                        <input
                          type={f.type || "text"}
                          required={f.required}
                          value={form[f.name] || ""}
                          onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                          placeholder={f.placeholder}
                          className={`w-full bg-transparent border-b-2 border-[#1E1E1E]/10 py-3 text-[0.95rem] text-[#1E1E1E] placeholder:text-[#8A8578]/50 outline-none transition-colors duration-200 focus:border-[#D9782E] ${f.name === "message" ? "min-h-[100px] resize-none" : ""}`}
                        />
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                      <motion.button
                        type="submit"
                        disabled={sending}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D9782E] text-white font-mono text-[0.85rem] tracking-[0.04em] hover:bg-[#c06820] hover:shadow-lg hover:shadow-[#D9782E]/20 transition-all duration-300 disabled:opacity-50"
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      >
                        {sending ? "Sending..." : <>Let&apos;s Talk →</>}
                      </motion.button>
                      <span className="text-[0.72rem] text-[#8A8578]/60">I personally respond within 24 hours.</span>
                    </div>
                  </form>
                </>
              )}
            </motion.div>

          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 pt-8 border-t border-[#1E1E1E]/6 text-center">
          <p className="font-display italic text-[clamp(1.2rem,1.8vw,1.5rem)] text-[#8A8578] mb-1">Still Reading?</p>
          <p className="text-[0.85rem] text-[#8A8578]/60 mb-4">Let&apos;s turn ideas into action.</p>
          <a href="#cover" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1E1E1E]/10 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[#8A8578] hover:border-[#D9782E]/30 hover:text-[#D9782E] transition-all duration-300">Back to Top ↑</a>
        </div>
      </div>
    </section>
  );
}
