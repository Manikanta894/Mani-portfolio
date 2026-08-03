"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import portrait from "@/assets/portrait.jpg";

function FooterClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => { setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" })); };
    tick(); const i = setInterval(tick, 1000); return () => clearInterval(i);
  }, []);
  return <span className="tabular-nums">{time || "—"} IST</span>;
}

function LiIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>); }
function GhIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>); }
function OrcidIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 7h2.5c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8V7zm2.5 4.5c1.2 0 2-.6 2-1.5s-.8-1.5-2-1.5H9.5v3h1zM8 15.5h3l2 3h1.8l-2.2-3.2c1-.3 1.8-1.2 1.8-2.3 0-1.8-1.2-3-3.2-3H8v8.5z"/></svg>); }
function MailSvg() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>); }

export function SiteFooter() {
  const { profile } = usePortfolio();
  const name = profile?.name || "Manikanta R";
  const location = profile?.location || "Bengaluru, India";

  const navLinks = ["Journey", "Education", "Experience", "Projects", "Research", "Credentials", "Manifesto", "Connect"];
  const profiles = [
    { label: "LinkedIn", href: "https://linkedin.com/in/manikanta894", icon: <LiIcon /> },
    { label: "GitHub", href: "https://github.com/manikantar", icon: <GhIcon /> },
    { label: "ORCID", href: "https://orcid.org/0009-0005-2576-8731", icon: <OrcidIcon /> },
    { label: "SSRN", href: "https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=9646252", icon: <OrcidIcon /> },
    { label: "Email", href: "mailto:hello@manikantar.in", icon: <MailSvg /> },
    { label: "Resume", href: "https://manikantar.in/resume.pdf", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ];

  return (
    <footer className="relative bg-[#F7F4EC] text-[#2A2A2A] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-[0.012]">
        <span className="font-display italic text-[clamp(400px,55vw,750px)] leading-none">MR</span>
      </div>

      <div className="relative z-10 mx-auto px-8 sm:px-12 py-16 sm:py-20" style={{ maxWidth: "1500px" }}>
        {/* TOP — Closing Statement */}
        <motion.div className="mb-14" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 className="font-display italic leading-[0.92] tracking-[-0.03em] font-medium" style={{ fontSize: "clamp(3.6rem,7vw,6.8rem)" }}>
            Every project begins with <span className="text-[#D9782E]">curiosity</span><br />and ends with measurable impact.
          </h2>
          <p className="mt-6 text-[#555] font-medium max-w-[60ch] leading-[1.7]" style={{ fontSize: "clamp(1.2rem,1.8vw,1.8rem)" }}>
            Thank you for exploring my work. Whether you&apos;re hiring, collaborating, publishing research or simply exchanging ideas — I&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* MIDDLE — Three Column */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16 py-10 border-t border-[#2A2A2A]/[0.06]"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }}>

          {/* Column 1 — Profile */}
          <div>
            <div className="flex items-center gap-5 mb-5">
              <div className="w-[72px] h-[72px] rounded-full overflow-hidden shrink-0 border-[3px] border-[#F0EAD9] shadow-sm">
                <img src={portrait} alt={name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display" style={{ fontSize: "clamp(1.5rem,2vw,2.1rem)", lineHeight: 1.1 }}>{name}</div>
                <div className="text-[#555] font-medium mt-1" style={{ fontSize: "clamp(1rem,1.3vw,1.35rem)" }}>MBA · HR &amp; Business Analytics</div>
              </div>
            </div>
            <div className="space-y-2.5 font-medium" style={{ fontSize: "clamp(1rem,1.2vw,1.25rem)" }}>
              <div className="flex items-center gap-2 text-[#666]">📍 {location}</div>
              <div className="flex items-center gap-2 text-[#666]"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Open to Opportunities</div>
              <div className="flex items-center gap-2 text-[#666]">⏱ Response within 24h</div>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <div className="font-mono uppercase tracking-[0.14em] text-[#666] font-semibold mb-4" style={{ fontSize: "clamp(0.8rem,1vw,1rem)" }}>Navigate</div>
            <div className="flex flex-col" style={{ gap: "clamp(0.7rem,1.2vw,1rem)" }}>
              {navLinks.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="group flex items-center gap-2 text-[#555] hover:text-[#D9782E] transition-colors duration-200 pb-0.5 border-b border-transparent hover:border-[#D9782E]/30 font-medium" style={{ fontSize: "clamp(1.1rem,1.5vw,1.5rem)", lineHeight: 1.6 }}>
                  {l} <span className="text-[0.8rem] opacity-0 group-hover:opacity-50 group-hover:translate-x-1 transition-all duration-200">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 — Profiles */}
          <div>
            <div className="font-mono uppercase tracking-[0.14em] text-[#666] font-semibold mb-4" style={{ fontSize: "clamp(0.8rem,1vw,1rem)" }}>Profiles</div>
            <div className="flex flex-col" style={{ gap: "clamp(0.7rem,1.2vw,1rem)" }}>
              {profiles.map((p) => (
                <a key={p.label} href={p.href} target="_blank" rel="noreferrer"
                  className="group flex items-center gap-3 text-[#555] hover:text-[#D9782E] transition-colors duration-200 pb-0.5 border-b border-transparent hover:border-[#D9782E]/30 font-medium" style={{ fontSize: "clamp(1rem,1.3vw,1.35rem)", lineHeight: 1.6 }}>
                  <span className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200">{p.icon}</span>
                  {p.label} <span className="text-[0.8rem] opacity-0 group-hover:opacity-50 group-hover:translate-x-1 transition-all duration-200">→</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* BOTTOM BAR */}
        <motion.div className="flex flex-wrap justify-center gap-x-6 gap-y-2 py-9 border-t border-[#2A2A2A]/[0.06] text-[#666] font-medium" style={{ fontSize: "clamp(0.9rem,1.1vw,1.15rem)" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <span>&copy; 2026 {name}</span><span className="text-[#2A2A2A]/10">·</span>
          <span>manikantar.in</span><span className="text-[#2A2A2A]/10">·</span>
          <span>{location}</span><span className="text-[#2A2A2A]/10">·</span>
          <span><FooterClock /></span><span className="text-[#2A2A2A]/10">·</span>
          <span>Response &lt;24h</span>
        </motion.div>

        {/* FINAL CTA */}
        <motion.div className="text-center pt-10 border-t border-[#2A2A2A]/[0.06]"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <p className="font-display italic text-[#2A2A2A] font-medium mb-5" style={{ fontSize: "clamp(1.4rem,2vw,2rem)", lineHeight: 1.4 }}>Still reading? Let&apos;s build something meaningful.</p>
          <a href="#linkedin" className="inline-flex items-center gap-2 rounded-full bg-[#D9782E] text-white font-medium hover:bg-[#c06820] hover:shadow-lg hover:shadow-[#D9782E]/20 hover:-translate-y-0.5 transition-all duration-200" style={{ padding: "14px 32px", fontSize: "1.2rem" }}>
            Start a Conversation →
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
