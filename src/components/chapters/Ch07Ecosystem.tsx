"use client";
import { useMemo } from "react";
import { motion } from "motion/react";
import usePortfolio from "@/hooks/usePortfolio";

type Cap = { id: string; name: string; domain: string; stage: string };

const DOMAINS = [
  "Analytics",
  "Artificial Intelligence",
  "Business",
  "People & HR",
  "Research",
  "Leadership",
  "Visualization",
  "Technology",
];

export function Ch07Ecosystem() {
  const { capabilities: apiCaps } = usePortfolio();
  const caps = (apiCaps?.length ? apiCaps : []) as Cap[];

  const byDomain = useMemo(() => {
    const m = new Map<string, Cap[]>();
    DOMAINS.forEach((d) => m.set(d, []));
    caps.forEach((c) => {
      const key = m.has(c.domain) ? c.domain : DOMAINS.find((d) => d.includes(c.domain) || c.domain.includes(d));
      if (key) m.get(key)?.push(c);
      else {
        // try matching
        const match = DOMAINS.find((d) => c.domain.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(c.domain.toLowerCase()));
        if (match) m.get(match)?.push(c);
      }
    });
    return m;
  }, [caps]);

  const domainLabels: Record<string, string> = {
    "Analytics": "Analytics & BI",
    "Artificial Intelligence": "Artificial Intelligence",
    "Business": "Business & Strategy",
    "People & HR": "People & HR",
    "Research": "Research & Writing",
    "Leadership": "Leadership",
    "Visualization": "Data Visualization",
    "Technology": "Technology & Tools",
  };

  return (
    <section id="ecosystem" className="relative bg-[#F7F4EC] text-[#1E1E1E] chapter-pad">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <header className="mb-16">
          <div className="flex items-center gap-3 font-mono text-[0.8rem] uppercase tracking-[0.16em] text-[#8A8578]/60 mb-3">
            <span className="text-[#D9782E] font-bold">05</span>
            <span className="w-4 h-px bg-[#8A8578]/25" />
            Core Expertise
          </div>
          <h2 className="font-display italic text-[clamp(2.8rem,6vw,5rem)] leading-[0.94] tracking-[-0.02em] mb-4">Capabilities</h2>
          <p className="text-[1.05rem] leading-relaxed text-[#8A8578] max-w-[48ch]">
            The disciplines, technologies and business capabilities I use to solve real-world problems.
          </p>
        </header>

        <div className="space-y-6">
          {DOMAINS.map((domain, di) => {
            const items = byDomain.get(domain) || [];
            if (items.length === 0) return null;
            return (
              <motion.div
                key={domain}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: di * 0.06, duration: 0.5 }}
              >
                <div className="flex items-baseline gap-6 group cursor-default pb-6 border-b border-[#1E1E1E]/6">
                  <h3 className="font-mono text-[0.85rem] uppercase tracking-[0.12em] text-[#1E1E1E]/50 font-semibold shrink-0 w-40 sm:w-52 transition-colors duration-300 group-hover:text-[#D9782E]">
                    {domainLabels[domain] || domain}
                  </h3>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {items.map((c) => (
                      <span
                        key={c.id}
                        className="text-[1.05rem] text-[#1E1E1E]/70 hover:text-[#1E1E1E] transition-colors duration-200 cursor-default"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
