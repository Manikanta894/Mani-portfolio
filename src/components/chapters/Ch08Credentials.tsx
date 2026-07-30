"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const VERIFY_URLS: Record<string, string> = {
  "7ecccae8-e822-4152-a131-46765d5805a2": "https://www.credly.com/badges/7ecccae8-e822-4152-a131-46765d5805a2",
  "01981cbc-8e58-4e61-852d-4eae53b5b2ec": "https://unstop.com/certificate-preview/01981cbc-8e58-4e61-852d-4eae53b5b2ec",
  "xovin-vaheb-satep-rupot-pobeg": "https://badger.learning.sap.com/verify/xovin-vaheb-satep-rupot-pobeg",
  "5499a92f2b1b43e48d7669830509294e": "https://courses.edx.org/certificates/5499a92f2b1b43e48d7669830509294e",
  "88CMB5YRUYEN": "https://www.coursera.org/account/accomplishments/verify/88CMB5YRUYEN",
  "82TJOP4XGX1S": "https://www.coursera.org/account/accomplishments/verify/82TJOP4XGX1S",
  "436df506e92242839860108d9683f921": "https://courses.edx.org/certificates/436df506e92242839860108d9683f921",
  "AV8QI58AJF1A": "https://www.coursera.org/account/accomplishments/verify/AV8QI58AJF1A",
  "guSpiFbzKFwS5Wu7M": "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG",
  "B6mz7r6dbckaPPLz5": "https://www.theforage.com/completion-certificates/MBA4MnZTNFEoJZGnk/ETGMhLB5eCrYjcH8o",
  "USUFXDSL": "https://www.mygreatlearning.com/certificate/USUFXDSL",
  "42": "https://certx.in/certificate/36a28147-6eed-47a5-8342-e5f926ebba61",
};

function getVerifyUrl(cert: any) {
  if (cert.url) return cert.url;
  if (cert.credential_id && VERIFY_URLS[cert.credential_id]) return VERIFY_URLS[cert.credential_id];
  return null;
}

function MsLogo() { return (<svg width="22" height="22" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>); }
function GoogleLogo() { return (<svg width="22" height="22" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>); }
function SapLogo() { return (<svg width="22" height="22" viewBox="0 0 24 24"><path fill="#008FD3" d="M2 2h20v20H2z"/><path fill="#fff" d="M6 17V7h2.5l3 4.5V7H14v10h-2.5l-3-4.5V17H6zm9-10h4v2h-4V7zm0 4h4v2h-4v-2zm0 4h3v2h-3v-2z"/></svg>); }
function LinkIcon() { return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>); }

const COLORS: Record<string, string> = {
  "Microsoft": "#00A4EF", "Google": "#4285F4", "SAP": "#008FD3",
  "Kennesaw State University": "#2C3E50", "Stellenbosch University": "#8B0000",
  "University System of Maryland": "#E03A3E", "Forage": "#5B2C8E",
  "Unstop": "#2563EB", "Great Learning": "#00B0B9", "Be10x": "#6366F1",
  "Goldman Sachs": "#7399C6",
};

function IssuerLogo({ issuer, color }: { issuer: string; color: string }) {
  const cls = "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white";
  if (issuer === "Microsoft") return <div className={cls} style={{ background: color }}><MsLogo /></div>;
  if (issuer === "Google") return <div className={cls} style={{ background: "#fff", border: "1px solid #e8e8e8" }}><GoogleLogo /></div>;
  if (issuer === "SAP") return <div className={cls} style={{ background: color }}><SapLogo /></div>;
  return <div className={cls} style={{ background: color }}><span className="font-bold text-sm">{issuer.charAt(0)}</span></div>;
}

export function Ch08Credentials() {
  const { certifications } = usePortfolio();
  const certs = certifications?.length ? certifications : [];
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? certs : certs.slice(0, 6);

  const uniqueIssuers = [...new Set(certs.map((c: any) => c.issuer).filter(Boolean))];

  return (
    <section id="credentials" className="relative chapter-pad text-ink">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <header className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 text-mono text-[0.8rem] uppercase tracking-[0.22em] text-ink/40 mb-4">
              <span className="text-vermilion font-bold">07</span>
              <span className="w-8 h-px bg-ink/20" />
              Credentials
            </div>
            <h2 className="font-display font-normal text-[clamp(3.2rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.02em]">
              Licenses &amp; Certifications
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-mono text-xs text-ink/35 tracking-[0.1em] uppercase">
            {certs.length} credentials · {uniqueIssuers.length} institutions
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((c: any, i: number) => {
            const color = COLORS[c.issuer] || "#666";
            const verifyUrl = getVerifyUrl(c);
            return (
              <motion.a
                key={c.id}
                href={verifyUrl || "#"}
                target={verifyUrl ? "_blank" : undefined}
                rel={verifyUrl ? "noreferrer" : undefined}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm hover:border-ink/20 hover:-translate-y-0.5 transition-all duration-300"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <IssuerLogo issuer={c.issuer} color={color} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[0.92rem] leading-snug line-clamp-2">{c.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono text-ink/40">{c.issuer}</span>
                    <span className="text-[10px] font-mono text-vermilion font-medium">{c.date}</span>
                  </div>
                </div>
                  {verifyUrl && (
                    <a href={verifyUrl} target="_blank" rel="noreferrer" className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-ink/5 group-hover:bg-ink/10 transition-colors text-ink/30 group-hover:text-ink/60 relative" title={verifyUrl.includes("coursera") ? "Coursera" : verifyUrl.includes("credly") ? "Credly" : verifyUrl.includes("edx") ? "edX" : verifyUrl.includes("sap") ? "SAP Learning" : verifyUrl.includes("forage") ? "Forage" : verifyUrl.includes("greatlearning") ? "Great Learning" : verifyUrl.includes("unstop") ? "Unstop" : verifyUrl.includes("certx") ? "Be10x" : "Verify"}>
                      <LinkIcon />
                    </a>
                  )}
              </motion.a>
            );
          })}
        </div>

        {/* Show more */}
        {certs.length > 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono tracking-[0.08em] uppercase border border-ink/15 text-ink/50 hover:border-ink/30 hover:text-ink transition-colors"
            >
              {showAll ? "Show less" : `Show all ${certs.length} credentials`}
              <span className="text-ink/25">{showAll ? "↑" : "↓"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
