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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT — Identity + Social */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-2 font-mono text-[0.8rem] uppercase tracking-[0.12em] text-[#8A8578] mb-3">
                <span className="text-[#D9782E] font-bold">09</span>
                Connect
              </div>
              <h2 className="font-display italic text-[clamp(2.8rem,5vw,4.4rem)] leading-[0.9] tracking-[-0.02em] text-[#1E1E1E] mb-4">
                Let&apos;s Build<br />Something<br />Meaningful.
              </h2>
              <p className="text-[1rem] leading-[1.7] text-[#8A8578] mb-8 max-w-[28ch]">
                Whether it&apos;s AI, Business Analytics, Research, HR Strategy, or simply exchanging ideas — I&apos;m always open to conversations that create impact.
              </p>

              {/* Availability card */}
              <div className="rounded-2xl border border-[#1E1E1E]/6 bg-white/40 backdrop-blur-sm p-5 mb-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[0.85rem] font-medium">Available for Collaboration</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[0.8rem]">
                  <div><span className="text-[#8A8578] block text-[0.65rem] uppercase tracking-[0.1em] font-mono">Response</span>Within 24 hours</div>
                  <div><span className="text-[#8A8578] block text-[0.65rem] uppercase tracking-[0.1em] font-mono">Location</span>{p.location}</div>
                  <div><span className="text-[#8A8578] block text-[0.65rem] uppercase tracking-[0.1em] font-mono">Timezone</span>GMT +5:30</div>
                  <div><span className="text-[#8A8578] block text-[0.65rem] uppercase tracking-[0.1em] font-mono">Status</span>Open to Work</div>
                </div>
              </div>

              {/* Social cards */}
              <div className="space-y-2.5 mb-6">
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="group flex items-center justify-between px-4 py-3 rounded-xl border border-[#1E1E1E]/6 bg-white/40 backdrop-blur-sm hover:border-[#0077B5]/30 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#0077B520", color: "#0077B5" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.6c0-1.28-.6-2.05-1.7-2.05a1.86 1.86 0 00-1.75 1.3A2.3 2.3 0 0012.5 14v5H9.5V9h3v1.5a3.11 3.11 0 012.6-1.4c1.85 0 3.4 1.1 3.4 3.7z"/></svg>
                    </span>
                    <div><div className="text-[0.85rem] font-medium">LinkedIn</div><div className="text-[0.7rem] text-[#8A8578]">Professional Network</div></div>
                  </div>
                  <span className="text-[#0077B5] text-[0.7rem] font-mono group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <a href={`mailto:${p.email}`} className="group flex items-center justify-between px-4 py-3 rounded-xl border border-[#1E1E1E]/6 bg-white/40 backdrop-blur-sm hover:border-[#D9782E]/30 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "#D9782E15", color: "#D9782E" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>
                    </span>
                    <div><div className="text-[0.85rem] font-medium">Email</div><div className="text-[0.7rem] text-[#8A8578]">{p.email}</div></div>
                  </div>
                  <span className="text-[#D9782E] text-[0.7rem] font-mono group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>

              {/* Profile card */}
              <div className="rounded-2xl border border-[#1E1E1E]/8 bg-white/40 backdrop-blur-sm p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-[#F0EAD9]">
                  <img src={portrait} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-display text-[1.05rem] leading-tight">{p.name}</div>
                  <div className="text-[0.8rem] text-[#8A8578]">{p.headline}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Conversation Card */}
          <div className="lg:col-span-7">
            <motion.div className="rounded-2xl border border-[#1E1E1E]/6 bg-white/40 backdrop-blur-sm p-6 sm:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {sent ? (
                <motion.div className="text-center py-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="w-16 h-16 rounded-full bg-[#D9782E]/10 flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D9782E" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5" strokeLinecap="round"/></svg>
                  </div>
                  <h3 className="font-display text-[1.4rem] text-[#1E1E1E] mb-2">Message Sent.</h3>
                  <p className="text-[#8A8578] mb-4">I&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({}); setSubject(""); }} className="text-[0.8rem] font-mono tracking-[0.06em] text-[#D9782E] underline hover:no-underline">Send another message</button>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-display text-[1.5rem] text-[#1E1E1E] mb-6">Start a Conversation.</h3>

                  {/* Subject pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {SUBJECTS.map((s) => (
                      <button key={s} onClick={() => setSubject(s === subject ? "" : s)}
                        className={`px-3.5 py-2 rounded-full text-[0.75rem] font-mono tracking-[0.04em] transition-all duration-200
                          ${subject === s ? "bg-[#1E1E1E] text-[#F7F4EC] border-[#1E1E1E]" : "border border-[#1E1E1E]/12 text-[#8A8578] hover:border-[#D9782E]/30 hover:text-[#D9782E]"}`}>
                        {s}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                      { name: "name", label: "Name", placeholder: "Your full name", required: true },
                      { name: "email", label: "Email", placeholder: "you@company.com", required: true, type: "email" },
                      { name: "message", label: "Message", placeholder: "What would you like to discuss?", required: true },
                    ].map((f) => (
                      <div key={f.name} className="relative">
                        <input
                          {...(f.name === "message" ? { as: "textarea", rows: 3 } : {})}
                          type={f.type || "text"}
                          required={f.required}
                          value={form[f.name] || ""}
                          onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                          placeholder={f.placeholder}
                          className={`w-full bg-transparent border-b border-[#1E1E1E]/12 py-3 text-[0.95rem] text-[#1E1E1E] placeholder:text-[#8A8578]/50 outline-none transition-colors duration-200 focus:border-[#D9782E] ${f.name === "message" ? "min-h-[80px] resize-none" : ""}`}
                        />
                      </div>
                    ))}

                    <motion.button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D9782E] text-white font-mono text-[0.8rem] tracking-[0.06em] uppercase hover:bg-[#c06820] hover:shadow-lg hover:shadow-[#D9782E]/20 transition-all duration-300 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    >
                      {sending ? "Sending..." : <>Let&apos;s Talk <span className="transition-transform group-hover:translate-x-1">→</span></>}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>

            {/* Quick links row */}
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { label: "Email", href: `mailto:${p.email}` },
                { label: "LinkedIn", href: LINKEDIN_URL },
                { label: "GitHub", href: "https://github.com/manikantar" },
                { label: "ORCID", href: "https://orcid.org/0009-0005-2576-8731" },
                { label: "Resume", href: "https://manikantar.in/resume.pdf" },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full border border-[#1E1E1E]/10 text-[0.75rem] font-mono tracking-[0.04em] text-[#8A8578] hover:border-[#D9782E]/30 hover:text-[#D9782E] transition-all duration-200">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-10 border-t border-[#1E1E1E]/6 text-center">
          <p className="font-display italic text-[clamp(1.3rem,2vw,1.8rem)] text-[#8A8578] mb-2">Still Reading?</p>
          <p className="text-[0.9rem] text-[#8A8578]/70 mb-6 max-w-[40ch] mx-auto">Let&apos;s turn ideas into action. Coffee. Research. Innovation. Opportunity.</p>
          <a href="#cover" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1E1E1E]/10 font-mono text-[0.8rem] uppercase tracking-[0.1em] text-[#1E1E1E]/60 hover:border-[#D9782E]/40 hover:text-[#D9782E] transition-all duration-300">
            Back to Top ↑
          </a>
        </div>
      </div>
    </section>
  );
}
