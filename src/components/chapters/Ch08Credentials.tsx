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
function getVerifyUrl(c: any) { return c.url || (c.credential_id && VERIFY_URLS[c.credential_id]) || null; }

function MsLogo() { return (<svg width="20" height="20" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>); }
function GoogleLogo() { return (<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>); }
function SapIcon() { return (<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#008FD3" d="M2 2h20v20H2z"/><path fill="#fff" d="M6 17V7h2.5l3 4.5V7H14v10h-2.5l-3-4.5V17H6zm9-10h4v2h-4V7zm0 4h4v2h-4v-2zm0 4h3v2h-3v-2z"/></svg>); }
function VerifyIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>); }

const ISSUER_LOGO: Record<string, React.ReactNode> = {
  "Microsoft": <MsLogo />, "Google": <GoogleLogo />, "SAP": <SapIcon />,
};

function IssuerIcon({ issuer }: { issuer: string }) {
  const logo = ISSUER_LOGO[issuer];
  if (logo) return <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: issuer === "Google" ? "#fff" : "transparent", border: issuer === "Google" ? "1px solid #e0e0e0" : "none" }}>{logo}</div>;
  return <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#1E1E1E]/5 text-[#1E1E1E]/40 font-mono text-sm font-bold">{issuer.charAt(0)}</div>;
}

const FILTERS = ["All", "AI", "Analytics", "Business", "Research", "HR", "Leadership"];

export function Ch08Credentials() {
  const { certifications } = usePortfolio();
  const certs = (certifications?.length ? certifications : []).sort((a: any, b: any) => {
    const aD = a.date || ""; const bD = b.date || "";
    const aY = parseInt(aD.split(" ").pop() || "0"); const bY = parseInt(bD.split(" ").pop() || "0");
    return bY - aY;
  });
  const [filter, setFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "All") return certs;
    return certs.filter((c: any) => (c.category || "").toLowerCase().includes(filter.toLowerCase()));
  }, [filter, certs]);

  const visible = showAll ? filtered : filtered.slice(0, 6);
  const uniqueIssuers = [...new Set(certs.map((c: any) => c.issuer).filter(Boolean))];
  const years = [...new Set(certs.map((c: any) => {
    const parts = (c.date || "").split(" ");
    return parts[parts.length - 1] || "";
  }).filter(Boolean))].sort((a, b) => Number(b) - Number(a));

  return (
    <section id="credentials" className="relative bg-[#F7F4EC] text-[#1E1E1E] chapter-pad">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT SIDEBAR — Identity Panel */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-2 font-mono text-[0.8rem] uppercase tracking-[0.12em] text-[#8A8578] mb-3">
                <span className="text-[#D9782E] font-bold">07</span>
                Verified Credentials
              </div>
              <h2 className="font-display italic text-[clamp(2.4rem,4.5vw,3.4rem)] leading-[0.92] text-[#1E1E1E] mb-4">Learning Never<br />Stops.</h2>
              <p className="text-[0.95rem] leading-[1.7] text-[#8A8578] mb-8 max-w-[22ch]">
                Every credential represents deliberate investment in AI, Analytics, HR, Business, and Research.
              </p>

              <div className="h-px bg-[#1E1E1E]/6 mb-7" />

              <div className="space-y-4 mb-7">
                {[
                  { label: "Verified Credentials", value: certs.length },
                  { label: "Learning Providers", value: uniqueIssuers.length },
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between">
                    <span className="text-[0.8rem] font-mono tracking-[0.04em] text-[#8A8578]">{s.label}</span>
                    <span className="font-display text-[1.8rem] leading-none text-[#D9782E]">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[#1E1E1E]/6 mb-7" />

              {/* Institution logos */}
              <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#8A8578]/50 font-semibold mb-3">Learning Partners</div>
              <div className="flex flex-wrap gap-3 mb-7">
                {uniqueIssuers.map((issuer) => (
                  <span key={issuer} className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1E1E1E]/3 hover:bg-[#1E1E1E]/6 transition-colors cursor-default" title={issuer}>
                    {ISSUER_LOGO[issuer] ? <span className="scale-75">{ISSUER_LOGO[issuer]}</span> : <span className="text-[0.55rem] font-mono font-bold text-[#1E1E1E]/30">{issuer.charAt(0)}</span>}
                  </span>
                ))}
              </div>

              <div className="h-px bg-[#1E1E1E]/6 mb-7" />

              {/* Learning Timeline */}
              <div className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[#8A8578]/50 font-semibold mb-3">Learning Timeline</div>
              <div className="space-y-2.5">
                {years.slice(0, 4).map((y) => (
                  <div key={y} className="flex items-baseline gap-3">
                    <span className="text-[0.75rem] font-mono font-semibold text-[#D9782E] w-9 shrink-0">{y}</span>
                    <span className="text-[0.75rem] text-[#8A8578]">{certs.filter((c: any) => (c.date || "").includes(y)).length} credentials</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Credential Cards */}
          <div className="lg:col-span-8">
            {/* Filters */}
            <div className="flex flex-wrap gap-1.5 mb-8">
              {FILTERS.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-[0.7rem] font-mono tracking-[0.06em] uppercase transition-all duration-250
                  ${filter === f ? "bg-[#1E1E1E] text-[#F7F4EC]" : "text-[#8A8578] border border-[#1E1E1E]/10 hover:border-[#D9782E]/20 hover:text-[#D9782E]"}`}>
                  {f}
                </button>
              ))}
            </div>

            {/* Featured credential */}
            {visible.length > 0 && (
              <motion.article
                className="group rounded-2xl border-2 border-[#D9782E]/20 bg-gradient-to-br from-[#D9782E]/3 via-transparent to-transparent p-6 sm:p-7 mb-5 cursor-pointer hover:border-[#D9782E]/35 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#D9782E]/5 transition-all duration-[250ms]"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              >
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D9782E]/10 border border-[#D9782E]/15 text-[0.65rem] font-mono uppercase tracking-[0.12em] text-[#D9782E] mb-3 font-semibold">
                  <span className="w-1 h-1 rounded-full bg-[#D9782E]" /> Featured
                </span>

                <div className="flex items-start gap-4">
                  <IssuerIcon issuer={visible[0].issuer} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-[1.4rem] leading-[1.1] text-[#1E1E1E] mb-1 group-hover:text-[#D9782E] transition-colors">{visible[0].title}</h3>
                    <div className="text-[0.85rem] text-[#8A8578] mb-3">{visible[0].issuer} · {visible[0].date}</div>
                    {visible[0].credential_id && <div className="text-[0.7rem] font-mono text-[#8A8578]/50 mb-3">ID: {visible[0].credential_id}</div>}
                    <p className="text-[0.9rem] leading-relaxed text-[#555555] mb-4">{visible[0].description || "Earners demonstrate foundational and applied knowledge in this domain."}</p>
                    {visible[0].skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {visible[0].skills.slice(0, 4).map((s: string) => (
                          <span key={s} className="px-2.5 py-1.5 rounded-full bg-[#F7F4EC] border border-[#E5DDD2] text-[0.7rem] font-mono text-[#555555]">{s}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      {getVerifyUrl(visible[0]) && (
                        <motion.a href={getVerifyUrl(visible[0])!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.75rem] font-mono tracking-[0.04em] text-[#D9782E] hover:underline" whileHover={{ x: 2 }}>
                          <VerifyIcon /> Verify →
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            )}

            {/* Remaining credentials */}
            <div className="space-y-3">
              {visible.slice(1).map((c: any, i: number) => (
                <motion.a
                  key={c.id}
                  href={getVerifyUrl(c) || "#"}
                  target={getVerifyUrl(c) ? "_blank" : undefined}
                  rel={getVerifyUrl(c) ? "noreferrer" : undefined}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-[#1E1E1E]/6 hover:border-[#D9782E]/20 hover:-translate-y-1 hover:shadow-md transition-all duration-[250ms] cursor-pointer"
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.35 }}
                >
                  <IssuerIcon issuer={c.issuer} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[0.95rem] font-semibold leading-snug text-[#1E1E1E] group-hover:text-[#D9782E] transition-colors">{c.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[0.75rem] text-[#8A8578]">{c.issuer}</span>
                      <span className="text-[0.7rem] font-mono text-[#D9782E] font-medium">{c.date}</span>
                    </div>
                  </div>
                  <span className="text-[0.7rem] font-mono tracking-[0.04em] text-[#8A8578]/40 group-hover:text-[#D9782E] group-hover:translate-x-1 transition-all duration-250 shrink-0">View →</span>
                </motion.a>
              ))}
            </div>

            {filtered.length > 6 && (
              <div className="mt-6 text-center">
                <button onClick={() => setShowAll(!showAll)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[0.75rem] font-mono tracking-[0.08em] uppercase border border-[#1E1E1E]/10 text-[#8A8578] hover:border-[#D9782E]/30 hover:text-[#D9782E] transition-colors">
                  {showAll ? "Show less" : `Show all ${filtered.length} credentials`} {showAll ? "↑" : "↓"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
