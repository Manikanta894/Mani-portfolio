"use client";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";
import portrait from "@/assets/portrait.jpg";

function LiIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>); }
function GhIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>); }
function OrcidIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 7h2.5c2 0 3.5 1 3.5 3s-1.5 3-3.5 3H8V7zm2.5 4.5c1.2 0 2-.6 2-1.5s-.8-1.5-2-1.5H9.5v3h1zM8 15.5h3l2 3h1.8l-2.2-3.2c1-.3 1.8-1.2 1.8-2.3 0-1.8-1.2-3-3.2-3H8v8.5z"/></svg>); }
function MailIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>); }

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
    { label: "Resume", href: "https://manikantar.in/resume.pdf", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  ];

  const explore = ["Journey", "Education", "Experience", "Projects", "Research", "Skills", "Credentials", "Manifesto", "Connect"];
  const resources = ["Privacy Policy", "Terms", "Sitemap", "Accessibility"];
  const connectLinks = ["Email", "LinkedIn", "GitHub", "ORCID", "SSRN", "Resume"];

  return (
    <footer className="relative bg-[#F8F5EF] text-[#111] overflow-hidden" style={{ fontFamily: "var(--font-sans)" }}>
      {/* MR watermark */}
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
        <span className="font-display italic text-[clamp(350px,45vw,600px)] leading-none text-[#111]/[0.04]">MR</span>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_45%,rgba(217,119,50,0.015)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto px-6 sm:px-8 py-16 sm:py-20 text-center" style={{ maxWidth: "1100px" }}>
        {/* Hero Quote — single line */}
        <motion.h2 className="font-display italic leading-[0.94] tracking-[-0.035em] font-medium text-[#111] mb-8"
          style={{ fontSize: "clamp(2.8rem,5.5vw,5rem)" }}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          Every great decision begins with <span className="text-[#D97732]">curiosity</span>.
        </motion.h2>

        {/* Divider */}
        <motion.div className="flex items-center justify-center gap-3 mb-8 text-[#111]/10"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
          <span className="h-px w-12 bg-[#111]/10" />
          <span className="text-[#D97732]/40 text-sm">✦</span>
          <span className="h-px w-12 bg-[#111]/10" />
        </motion.div>

        {/* Thank you */}
        <motion.p className="text-[#555] font-medium max-w-[48ch] mx-auto mb-12 leading-relaxed"
          style={{ fontSize: "clamp(1rem,1.4vw,1.5rem)" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.25, duration: 0.5 }}>
          Thank you for exploring my work. Let&apos;s build something meaningful together.
        </motion.p>

        {/* Profile Block */}
        <motion.div className="inline-flex flex-col items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 }}>
          <motion.div className="w-[88px] h-[88px] rounded-full overflow-hidden border-[3px] border-[#F0EAD9] shadow-md"
            whileHover={{ scale: 1.04, rotate: 2 }}>
            <img src={portrait} alt={name} className="w-full h-full object-cover" />
          </motion.div>
          <div>
            <div className="font-display" style={{ fontSize: "clamp(1.6rem,2vw,2rem)" }}>{name}</div>
            <div className="text-[#555] font-medium" style={{ fontSize: "clamp(0.95rem,1.1vw,1.15rem)" }}>MBA · HR &amp; Business Analytics</div>
            <div className="text-[#555]/70 font-medium mt-1" style={{ fontSize: "clamp(0.85rem,1vw,1rem)" }}>
              {location} &nbsp;·&nbsp; <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Available</span> &nbsp;·&nbsp; Replies &lt;24h
            </div>
          </div>
        </motion.div>

        {/* Social Icons */}
        <motion.div className="flex justify-center gap-3.5 mb-10"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.45 }}>
          {socials.map((s) => (
            <motion.a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              className="w-11 h-11 rounded-full border border-[#111]/8 flex items-center justify-center text-[#111]/35 hover:text-[#D97732] hover:border-[#D97732]/30 hover:bg-[#D97732]/5 hover:shadow-sm hover:shadow-[#D97732]/5 transition-all duration-200"
              whileHover={{ y: -2, scale: 1.08 }} title={s.label}>{s.icon}</motion.a>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.55 }}>
          <a href="#linkedin" className="inline-flex items-center gap-2 rounded-full bg-[#D97732] text-white font-medium hover:bg-[#c06820] hover:shadow-lg hover:shadow-[#D97732]/20 transition-all duration-200" style={{ padding: "14px 30px", fontSize: "1.05rem" }}>
            Let&apos;s Connect →
          </a>
          <a href="https://manikantar.in/resume.pdf" className="inline-flex items-center gap-2 rounded-full border-2 border-[#111]/8 text-[#555] font-medium hover:border-[#D97732]/25 hover:text-[#D97732] transition-all duration-200" style={{ padding: "14px 30px", fontSize: "1.05rem" }}>
            Download Resume
          </a>
        </motion.div>

        {/* Resources */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 max-w-4xl mx-auto py-8 border-t border-[#111]/6 text-left" style={{ alignItems: "start" }}
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
          <div>
            <div className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[#D97732] font-semibold mb-3">Explore</div>
            <div className="flex flex-col gap-1.5">
              {explore.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[0.9rem] text-[#555] hover:text-[#D97732] transition-colors duration-200 font-medium border-b border-transparent hover:border-[#D97732]/30 pb-0.5">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[#D97732] font-semibold mb-3">Resources</div>
            <div className="flex flex-col gap-1.5">
              {resources.map((l) => (
                <a key={l} href={l === "Sitemap" ? "/sitemap.xml" : "#"} className="text-[0.9rem] text-[#555] hover:text-[#D97732] transition-colors duration-200 font-medium border-b border-transparent hover:border-[#D97732]/30 pb-0.5">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-[#D97732] font-semibold mb-3">Stay Connected</div>
            <div className="flex flex-col gap-1.5">
              {connectLinks.map((l) => (
                <span key={l} className="text-[0.9rem] text-[#555] font-medium">{l}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-8 border-t border-[#111]/6 text-[#111]/25 font-medium"
          style={{ fontSize: "clamp(0.8rem,1vw,0.9rem)" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
          <span>&copy; 2026 {name}</span><span className="text-[#111]/10">·</span>
          <span>manikantar.in</span><span className="text-[#111]/10">·</span>
          <span>{location}</span><span className="text-[#111]/10">·</span>
          <span>Built with Intention · Updated</span><span className="text-[#111]/10">·</span>
          <span>Always Improving</span>
        </motion.div>
      </div>
    </footer>
  );
}
