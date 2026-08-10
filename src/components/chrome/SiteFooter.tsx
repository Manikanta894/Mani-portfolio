"use client";
import { motion } from "motion/react";
import { Caveat } from "next/font/google";
import usePortfolio from "@/hooks/usePortfolio";
import portrait from "@/assets/portrait.jpg";
import {
  MapPin,
  GraduationCap,
  Target,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Plus,
  Grid3x3,
} from "lucide-react";

// Real handwriting/script font for the signature — swap for any other
// script font (Homemade Apple, Dancing Script, Sacramento, etc.) if you'd like.
const signature = Caveat({ subsets: ["latin"], weight: ["600", "700"] });

function LiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
function GhIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 6l10 7 10-7" />
    </svg>
  );
}
function ResumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export function SiteFooter() {
  const { profile } = usePortfolio();
  const name = profile?.name || "Manikanta R";
  const location = profile?.location || "Bengaluru, India";
  const email = "hello@manikantar.in";

  const explore = [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Research", href: "#research" },
  ];
  const work = [
    { label: "Skills", href: "#skills" },
    { label: "Certifications", href: "#credentials" },
    { label: "Publications", href: "#research" },
    { label: "Resume", href: "https://manikantar.in/resume.pdf" },
  ];
  const connect = [
    { label: "LinkedIn", href: "https://linkedin.com/in/manikanta894", icon: <LiIcon /> },
    { label: "GitHub", href: "https://github.com/manikantar", icon: <GhIcon /> },
    { label: "Email", href: `mailto:${email}`, icon: <MailIcon /> },
    { label: "Download Resume", href: "https://manikantar.in/resume.pdf", icon: <ResumeIcon /> },
  ];

  return (
    <footer className="relative bg-[#F8F5EF] text-[#111] overflow-hidden" style={{ fontFamily: "var(--font-sans)" }}>
      <div className="relative z-10 mx-auto px-6 sm:px-10 py-16 sm:py-24" style={{ maxWidth: "1200px" }}>

        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#111]/40 mb-10"
          initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <span className="text-[#111]/25">—</span>
          <span className="text-[#D97732] font-semibold">09</span>
          <span>Connect</span>
        </motion.div>

        {/* Hero row */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-20">
          {/* Left: heading */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-display leading-[0.96] tracking-[-0.02em] font-medium text-[#111] mb-6" style={{ fontSize: "clamp(2.6rem,5vw,4.2rem)" }}>
              Let&rsquo;s build
              <br />
              something
              <br />
              <span className="italic text-[#D97732]">meaningful.</span>
            </h2>
            <span className="block w-10 h-[2px] bg-[#D97732] mb-6" />
            <p className="text-[#555] font-medium max-w-[38ch] leading-relaxed" style={{ fontSize: "1.05rem" }}>
              I&rsquo;m always open to discussing new ideas, collaborations, and opportunities that create real impact.
            </p>
          </motion.div>

          {/* Right: MR monogram + a compact contact panel filling the extra space */}
          <motion.div
            className="flex flex-col sm:flex-row items-center sm:items-end justify-center md:justify-end gap-6 sm:gap-10"
            initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            {/* Monogram */}
            <div className="relative w-full sm:w-auto" style={{ maxWidth: 480 }}>
              <svg viewBox="0 0 900 420" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <mask id="mLetterMask">
                    <rect width="900" height="420" fill="black" />
                    <text x="-10" y="360" fontFamily="var(--font-display)" fontWeight="600" fontSize="440" fill="white">M</text>
                  </mask>
                </defs>

                {/* faint full M outline (shows where photo doesn't cover) */}
                <text x="-10" y="360" fontFamily="var(--font-display)" fontWeight="600" fontSize="440" fill="none" stroke="#111" strokeOpacity="0.06">M</text>

                {/* portrait clipped into the M glyph */}
                <g mask="url(#mLetterMask)">
                  <image href={portrait?.src || portrait} x="30" y="-30" width="480" height="480" preserveAspectRatio="xMidYMid slice" />
                </g>

                {/* outlined R */}
                <text x="430" y="360" fontFamily="var(--font-display)" fontWeight="600" fontSize="440" fill="none" stroke="#111" strokeOpacity="0.12" strokeWidth="1.5">R</text>
              </svg>

              <Sparkles className="absolute -top-1 right-0 text-[#D97732]" size={22} strokeWidth={1.5} />

              {/* the one and only signature, in a real script font */}
              <div
                className={`${signature.className} absolute bottom-6 right-2 text-[#D97732]`}
                style={{ fontSize: "1.9rem", transform: "rotate(-6deg)" }}
              >
                {name}.
              </div>
            </div>

            {/* Useful content for the empty space: availability + quick contact */}
            <div className="flex flex-col items-center sm:items-start gap-4 sm:pb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#111]/8 bg-white/50 px-3 py-1.5 text-xs font-medium text-[#444]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Open to new opportunities
              </span>
              <p className="text-sm text-[#777] max-w-[26ch] text-center sm:text-left leading-relaxed">
                Currently based in {location}, exploring roles at the intersection of HR and analytics.
              </p>
              <a
                href={`mailto:${email}`}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#111] hover:text-[#D97732] transition-colors duration-200"
              >
                Say hello
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-[#111]/8" />

        {/* Link columns */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 py-14"
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
        >
          {/* Profile summary */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-2xl mb-1">
              {name} <span className="text-[#D97732]">.</span>
            </div>
            <div className="text-xs font-mono uppercase tracking-[0.12em] text-[#D97732] font-semibold mb-2">
              MBA · HR &amp; Business Analytics
            </div>
            <div className="text-[#777] text-sm mb-4">People x Data x Better Decisions</div>
            <div className="flex flex-col gap-2 text-sm text-[#444]">
              <span className="flex items-center gap-2"><MapPin size={15} className="text-[#111]/40" /> {location}</span>
              <span className="flex items-center gap-2"><GraduationCap size={15} className="text-[#111]/40" /> MBA · 2027</span>
              <span className="flex items-center gap-2"><Target size={15} className="text-[#111]/40" /> HR &amp; Business Analytics</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-[#111]/40 mb-4">
              <span className="text-[#111]/25">—</span> Explore
            </div>
            <div className="flex flex-col gap-3">
              {explore.map((l, i) => (
                <a key={l.label} href={l.href} className="group flex items-center justify-between text-[#333] hover:text-[#D97732] transition-colors duration-200">
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-[#111]/25 font-mono">{String(i + 1).padStart(2, "0")}</span>
                    {l.label}
                  </span>
                  <ArrowRight size={15} className="text-[#D97732] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Work */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-[#111]/40 mb-4">
              <span className="text-[#111]/25">—</span> Work
            </div>
            <div className="flex flex-col gap-3">
              {work.map((l, i) => (
                <a key={l.label} href={l.href} className="group flex items-center justify-between text-[#333] hover:text-[#D97732] transition-colors duration-200">
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-[#111]/25 font-mono">{String(i + 1).padStart(2, "0")}</span>
                    {l.label}
                  </span>
                  <ArrowRight size={15} className="text-[#D97732] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-[#111]/40 mb-4">
              <span className="text-[#111]/25">—</span> Connect
            </div>
            <div className="flex flex-col gap-3">
              {connect.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between text-[#333] hover:text-[#D97732] transition-colors duration-200">
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#111] text-white flex items-center justify-center">{l.icon}</span>
                    {l.label}
                  </span>
                  <ArrowRight size={15} className="text-[#D97732] opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="border-t border-[#111]/8" />

        {/* Bottom bar */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4 pt-8 text-[#111]/35 font-medium text-sm"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
        >
          <span>&copy; 2026 {name}</span>
          <span className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#D97732]" /> {location}
          </span>
          <a href="#sitemap" className="flex items-center gap-2 hover:text-[#D97732] transition-colors">
            Sitemap <Plus size={14} />
            <Grid3x3 size={16} />
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
