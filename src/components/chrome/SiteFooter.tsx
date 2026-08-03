"use client";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import portrait from "@/assets/portrait.jpg";

function LiIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>); }
function GhIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>); }
function OrcidIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 7h2.5c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8V7zm2.5 4.5c1.2 0 2-.6 2-1.5s-.8-1.5-2-1.5H9.5v3h1zM8 15.5h3l2 3h1.8l-2.2-3.2c1-.3 1.8-1.2 1.8-2.3 0-1.8-1.2-3-3.2-3H8v8.5z"/></svg>); }
function MailIcon() { return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>); }

export function SiteFooter() {
  const { profile } = usePortfolio();
  const name = profile?.name || "Manikanta R";
  const location = profile?.location || "Bengaluru, India";
  const email = "hello@manikantar.in";

  const socials = [
    { label: "LinkedIn", href: "https://linkedin.com/in/manikanta894", icon: <LiIcon /> },
    { label: "GitHub", href: "https://github.com/manikantar", icon: <GhIcon /> },
    { label: "Email", href: `mailto:${email}`, icon: <MailIcon /> },
    { label: "ORCID", href: "https://orcid.org/0009-0005-2576-8731", icon: <OrcidIcon /> },
    { label: "Resume", href: "https://manikantar.in/resume.pdf", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ];

  return (
    <footer className="relative bg-[#F7F4EC] text-[#111] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(217,120,46,0.02)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-8 py-20 sm:py-24 text-center">
        {/* Label */}
        <motion.div className="font-mono text-[0.8rem] uppercase tracking-[0.14em] text-[#D9782E] font-bold mb-8"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          10 — Beyond
        </motion.div>

        {/* Editorial statement */}
        <motion.h2 className="font-display italic leading-[0.94] tracking-[-0.03em] text-[#111] mb-6 font-medium"
          style={{ fontSize: "clamp(3rem,6vw,5.6rem)" }}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }}>
          Every great decision begins with curiosity.
        </motion.h2>

        <motion.p className="text-[#8A8578] max-w-[44ch] mx-auto font-medium leading-relaxed mb-12"
          style={{ fontSize: "clamp(1rem,1.5vw,1.5rem)" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.25, duration: 0.5 }}>
          Let&apos;s build the future together.
        </motion.p>

        {/* Profile card */}
        <motion.div className="inline-flex flex-col items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.5 }}>
          <motion.div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-[#F0EAD9] shadow-md"
            whileHover={{ scale: 1.05, rotate: 2 }}>
            <img src={portrait} alt={name} className="w-full h-full object-cover" />
          </motion.div>
          <div className="text-center">
            <div className="font-display text-[1.6rem] leading-tight">{name}</div>
            <div className="text-[0.95rem] text-[#8A8578] mt-1">MBA · HR &amp; Business Analytics</div>
            <div className="text-[0.85rem] text-[#8A8578]/70 mt-0.5">{location} · Available for opportunities</div>
          </div>
        </motion.div>

        {/* Social icons */}
        <motion.div className="flex justify-center gap-4 mb-10"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
          {socials.map((s) => (
            <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              className="group relative w-12 h-12 rounded-full border border-[#111]/8 flex items-center justify-center text-[#111]/40 hover:text-[#D9782E] hover:border-[#D9782E]/30 hover:bg-[#D9782E]/5 transition-all duration-200"
              whileHover={{ y: -3 }} title={s.label}>
              {s.icon}
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[0.65rem] font-mono text-[#111]/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{s.label}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Buttons */}
        <motion.div className="flex flex-wrap justify-center gap-3 mb-14"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
          <a href="#linkedin" className="inline-flex items-center gap-2 rounded-full bg-[#D9782E] text-white font-medium hover:bg-[#c06820] hover:shadow-lg hover:shadow-[#D9782E]/20 transition-all duration-200" style={{ padding: "14px 28px", fontSize: "1.1rem" }}>
            Let&apos;s Connect →
          </a>
          <a href="https://manikantar.in/resume.pdf" className="inline-flex items-center gap-2 rounded-full border-2 border-[#111]/10 text-[#555] font-medium hover:border-[#D9782E]/30 hover:text-[#D9782E] transition-all duration-200" style={{ padding: "14px 28px", fontSize: "1.1rem" }}>
            Download Resume
          </a>
        </motion.div>

        {/* Bottom */}
        <motion.div className="text-[#111]/30 font-medium" style={{ fontSize: "0.9rem" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
          &copy; 2026 {name} &mdash; Built with intention.
        </motion.div>
      </div>
    </footer>
  );
}
