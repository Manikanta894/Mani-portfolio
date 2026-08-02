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

export function SiteFooter() {
  const { profile } = usePortfolio();
  const name = profile?.name || "Manikanta R";
  const location = profile?.location || "Bengaluru, India";

  const navLinks = ["Journey", "Education", "Experience", "Projects", "Research", "Credentials", "Manifesto", "Connect"];
  const profiles = [
    { label: "LinkedIn", href: "https://linkedin.com/in/manikanta894" },
    { label: "GitHub", href: "https://github.com/manikantar" },
    { label: "ORCID", href: "https://orcid.org/0009-0005-2576-8731" },
    { label: "SSRN", href: "https://papers.ssrn.com/sol3/cf_dev/AbsByAuth.cfm?per_id=9646252" },
    { label: "Email", href: "mailto:hello@manikantar.in" },
    { label: "Resume", href: "https://manikantar.in/resume.pdf" },
  ];

  return (
    <footer className="relative bg-[#F7F4EC] text-[#1E1E1E] overflow-hidden border-t border-[#1E1E1E]/6">
      {/* MR Watermark */}
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
        <span className="font-display italic text-[clamp(300px,45vw,600px)] leading-none text-[#1E1E1E]/[0.02]">MR</span>
      </div>

      {/* Radial light */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,_rgba(217,120,46,0.03)_0%,_transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-8">
        {/* TOP — Closing Statement */}
        <motion.div className="py-16 sm:py-20 text-center"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="font-display italic leading-[0.94] tracking-[-0.02em] mb-4" style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}>
            Every project begins with <span className="text-[#D9782E]">curiosity</span><br />and ends with measurable impact.
          </h2>
          <p className="text-[clamp(1rem,1.4vw,1.3rem)] text-[#8A8578] max-w-[48ch] mx-auto leading-relaxed">
            Thank you for exploring my work. Whether you&apos;re hiring, collaborating, publishing research or simply exchanging ideas — I&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* MIDDLE — Three Column Editorial */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 py-10 border-t border-[#1E1E1E]/6"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.5 }}>

          {/* Column 1 — Profile */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#F0EAD9]">
                <img src={portrait} alt={name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-display text-[1.1rem] leading-tight">{name}</div>
                <div className="text-[0.75rem] text-[#8A8578]">MBA · HR &amp; Business Analytics</div>
              </div>
            </div>
            <div className="text-[0.8rem] text-[#8A8578] space-y-1">
              <div>📍 {location}</div>
              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Available</div>
              <div>⏱ Response &lt; 24h</div>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#1E1E1E]/35 font-semibold mb-3">Navigate</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {navLinks.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[0.85rem] text-[#8A8578] hover:text-[#D9782E] transition-colors duration-200 border-b border-transparent hover:border-[#D9782E]/30 pb-0.5">{l}</a>
              ))}
            </div>
          </div>

          {/* Column 3 — Profiles */}
          <div>
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#1E1E1E]/35 font-semibold mb-3">Profiles</div>
            <div className="flex flex-col gap-1.5">
              {profiles.map((p) => (
                <a key={p.label} href={p.href} target="_blank" rel="noreferrer" className="text-[0.85rem] text-[#8A8578] hover:text-[#D9782E] transition-colors duration-200 border-b border-transparent hover:border-[#D9782E]/30 pb-0.5 inline-flex items-center gap-1.5 w-fit group">
                  {p.label} <span className="text-[0.6rem] opacity-0 group-hover:opacity-50 transition-opacity">→</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* BOTTOM — Info Bar */}
        <motion.div className="flex flex-wrap justify-center gap-x-5 gap-y-2 py-8 border-t border-[#1E1E1E]/6 text-[0.72rem] font-mono text-[#1E1E1E]/30"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <span>&copy; 2026 {name}</span><span className="text-[#1E1E1E]/15">·</span>
          <span>manikantar.in</span><span className="text-[#1E1E1E]/15">·</span>
          <span>{location}</span><span className="text-[#1E1E1E]/15">·</span>
          <span><FooterClock /></span><span className="text-[#1E1E1E]/15">·</span>
          <span>Response &lt;24h</span>
        </motion.div>

        {/* FINAL CTA */}
        <motion.div className="text-center py-10 border-t border-[#1E1E1E]/6"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <p className="font-display italic text-[clamp(1.1rem,1.5vw,1.3rem)] text-[#1E1E1E] mb-4">Still reading? Let&apos;s build something meaningful.</p>
          <a href="#linkedin" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D9782E] text-white font-mono text-[0.85rem] tracking-[0.04em] hover:bg-[#c06820] hover:shadow-lg hover:shadow-[#D9782E]/20 transition-all duration-200">
            Start a Conversation →
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
