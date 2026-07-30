"use client";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const VERIFY_URLS: Record<string, string> = {
  "7ecccae8-e822-4152-a131-46765d5805a2": "https://learn.microsoft.com/training/achievements/7ecccae8-e822-4152-a131-46765d5805a2",
  "88CMB5YRUYEN": "https://coursera.org/verify/88CMB5YRUYEN",
  "82TJOP4XGX1S": "https://coursera.org/verify/82TJOP4XGX1S",
  "AV8QI58AJF1A": "https://coursera.org/verify/AV8QI58AJF1A",
  "5499a92f2b1b43e48d7669830509294e": "https://courses.edx.org/certificates/5499a92f2b1b43e48d7669830509294e",
  "436df506e92242839860108d9683f921": "https://courses.edx.org/certificates/436df506e92242839860108d9683f921",
  "USUFXDSL": "https://verify.mygreatlearning.com/USUFXDSL",
  "guSpiFbzKFwS5Wu7M": "https://www.theforage.com/simulations/deloitte-au/data-analytics-virtual-internship",
  "B6mz7r6dbckaPPLz5": "https://www.theforage.com/simulations/goldman-sachs/risk-job-simulation",
};

function getVerifyUrl(cert: any) {
  if (cert.url) return cert.url;
  if (cert.credential_id && VERIFY_URLS[cert.credential_id]) return VERIFY_URLS[cert.credential_id];
  return null;
}

function GoogleLogo() { return (<svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>); }
function MsLogo() { return (<svg width="14" height="14" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>); }
function SapLogo() { return (<svg width="14" height="14" viewBox="0 0 24 24"><path fill="#008FD3" d="M2 2h20v20H2z"/><path fill="#fff" d="M6 17V7h2.5l3 4.5V7H14v10h-2.5l-3-4.5V17H6zm9-10h4v2h-4V7zm0 4h4v2h-4v-2zm0 4h3v2h-3v-2z"/></svg>); }
function LinkIcon() { return (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>); }

const ISSUER_COLORS: Record<string, string> = {
  "Microsoft": "#00A4EF", "Google": "#4285F4", "SAP": "#008FD3",
  "Kennesaw State University": "#2C3E50", "Stellenbosch University": "#8B0000",
  "University System of Maryland": "#E03A3E", "Forage": "#5B2C8E",
  "Unstop": "#2563EB", "Great Learning": "#00B0B9", "Be10x": "#6366F1",
  "Goldman Sachs": "#7399C6",
};

function IssuerLogo({ issuer, color }: { issuer: string; color: string }) {
  const cls = "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white";
  if (issuer === "Microsoft") return <div className={cls} style={{ background: color }}><MsLogo /></div>;
  if (issuer === "Google") return <div className={cls} style={{ background: "#fff", border: "1px solid #eee" }}><GoogleLogo /></div>;
  if (issuer === "SAP") return <div className={cls} style={{ background: color }}><SapLogo /></div>;
  return <div className={cls} style={{ background: color }}><span className="font-bold text-xs">{issuer.charAt(0)}</span></div>;
}

export function Ch08Credentials() {
  const { certifications } = usePortfolio();
  const certs = certifications?.length ? certifications : [];
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(certs.map((c: any) => c.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [certs]);

  const filtered = useMemo(() => {
    if (filter === "All") return certs;
    return certs.filter((c: any) => c.category === filter);
  }, [filter, certs]);

  const uniqueIssuers = [...new Set(certs.map((c: any) => c.issuer).filter(Boolean))];

  return (
    <section id="credentials" className="relative chapter-pad text-ink">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="mb-14">
          <div className="flex items-center gap-3 text-mono text-[0.75rem] uppercase tracking-[0.2em] text-ink/40 mb-4">
            <span className="text-vermilion font-medium">07</span>
            <span className="w-8 h-px bg-ink/20" />
            Credentials
          </div>
          <h2 className="font-display font-normal text-[clamp(3.2rem,7vw,6rem)] leading-[0.92] tracking-[-0.02em]">
            Licenses &amp; Certifications
          </h2>
          <p className="mt-5 text-[1.05rem] text-ink/55 max-w-[52ch]">
            {certs.length} verified credentials from {uniqueIssuers.length} institutions — Microsoft, Google, SAP, and more.
          </p>
        </header>

        {/* Top issuers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {uniqueIssuers.map((issuer, i) => {
            const color = ISSUER_COLORS[issuer] || "#666";
            return (
              <motion.div
                key={issuer}
                className="rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm p-4 text-center"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <IssuerLogo issuer={issuer} color={color} />
                <div className="text-[10px] font-medium mt-2 leading-tight">{issuer}</div>
                <div className="text-[9px] font-mono text-ink/35 mt-0.5">{certs.filter((c: any) => c.issuer === issuer).length} cert</div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-[11px] tracking-[0.08em] uppercase font-mono border transition-colors ${filter === cat ? "bg-ink text-bone border-ink" : "bg-transparent text-ink/50 border-ink/15 hover:border-ink/30 hover:text-ink"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cert grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c: any, i: number) => {
            const color = ISSUER_COLORS[c.issuer] || "#666";
            const verifyUrl = getVerifyUrl(c);
            return (
              <motion.article
                key={c.id}
                className="group rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm p-5 flex flex-col gap-3 hover:border-ink/20 hover:-translate-y-0.5 transition-all duration-300"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <div className="flex items-start gap-3">
                  <IssuerLogo issuer={c.issuer} color={color} />
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm leading-tight">{c.title}</h3>
                    <div className="text-[11px] font-mono text-ink/40 mt-0.5">{c.issuer}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-ink/5">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-mono px-2 py-1 rounded-full bg-vermilion/10 border border-vermilion/20 text-vermilion">{c.date}</span>
                  {c.verified && (
                    <span className="text-[9px] uppercase tracking-[0.1em] font-mono text-[#63c4a8]">✓ Verified</span>
                  )}
                  {verifyUrl && (
                    <a href={verifyUrl} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-mono tracking-[0.04em] bg-ink/5 border border-ink/10 text-ink/50 hover:border-ink/30 hover:text-ink transition-colors">
                      <LinkIcon /> Verify
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
