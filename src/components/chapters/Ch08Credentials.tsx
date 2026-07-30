"use client";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

const ISSUER_COLORS: Record<string, string> = {
  "Microsoft": "#00A4EF",
  "Google": "#4285F4",
  "SAP": "#008FD3",
  "Kennesaw State University": "#2C3E50",
  "Stellenbosch University": "#8B0000",
  "University System of Maryland": "#E03A3E",
  "Forage": "#5B2C8E",
  "Unstop": "#2563EB",
  "Great Learning": "#00B0B9",
  "Be10x": "#6366F1",
  "Goldman Sachs": "#7399C6",
};

export function Ch08Credentials() {
  const { certifications, awards } = usePortfolio();
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {uniqueIssuers.slice(0, 4).map((issuer, i) => (
            <motion.div
              key={issuer}
              className="rounded-2xl border border-ink/8 bg-white/40 backdrop-blur-sm p-5 text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center text-white font-bold text-xs" style={{ background: ISSUER_COLORS[issuer] || "var(--ink)" }}>
                {issuer.charAt(0)}
              </div>
              <div className="text-[11px] font-medium mt-2 leading-tight">{issuer}</div>
              <div className="text-[10px] font-mono text-ink/35 mt-0.5">{certs.filter((c: any) => c.issuer === issuer).length} cert</div>
            </motion.div>
          ))}
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
            const accent = ISSUER_COLORS[c.issuer] || "#888";
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
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs" style={{ background: accent }}>
                    {c.issuer.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm leading-tight">{c.title}</h3>
                    <div className="text-[11px] font-mono text-ink/40 mt-0.5">{c.issuer}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-ink/5">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-mono px-2 py-1 rounded-full bg-vermilion/10 border border-vermilion/20 text-vermilion">{c.date}</span>
                  {c.credential_id && (
                    <span className="text-[9px] font-mono text-ink/30 truncate" title={c.credential_id}>ID: {c.credential_id.slice(0, 12)}...</span>
                  )}
                  {c.verified && (
                    <span className="ml-auto text-[9px] uppercase tracking-[0.1em] font-mono text-[#63c4a8]">✓ Verified</span>
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
