"use client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { MaskReveal, Reveal } from "@/components/motion/primitives";

type JournalArticle = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  cover: string | null;
  url: string;
};

const BLOG_URL = "https://blog.manikantar.in";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function fetchFeatured(): Promise<JournalArticle[]> {
  try {
    const res = await fetch(`${API_BASE}/journal-articles`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("journal_fetch_failed");
    const data = await res.json();
    if (data.success && data.data) {
      return data.data.slice(0, 3).map((a: any) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt || "",
        category: a.category || "",
        date: a.date || "",
        readingTime: a.reading_time || "",
        cover: a.cover || null,
        url: a.url || BLOG_URL,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

function truncate(text: string, max = 140) {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + "…" : clean;
}

function ArticleRow({ a, i }: { a: JournalArticle; i: number }) {
  return (
    <Reveal delay={i * 0.08}>
      <motion.a
        href={a.url}
        target="_blank"
        rel="noreferrer noopener"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="group relative block border-t border-ink/15 py-10 first:border-t-0 first:pt-2 md:py-14"
      >
        <span aria-hidden className="pointer-events-none absolute inset-x-[-1.5rem] inset-y-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "color-mix(in srgb, var(--ink) 4%, transparent)" }} />

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {a.cover ? (
            <div className="col-span-12 md:col-span-4">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                <motion.img src={a.cover} alt="" loading="lazy" className="h-full w-full object-cover" initial={{ scale: 1.06, opacity: 0.92 }} whileHover={{ scale: 1.1, opacity: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </div>
          ) : null}

          <div className={a.cover ? "col-span-12 md:col-span-8" : "col-span-12"}>
            <div className="text-mono flex flex-wrap items-center gap-x-4 gap-y-1 text-eyebrow uppercase tracking-[0.22em] text-graphite/55">
              <span className="text-vermilion">{a.category}</span>
              <span aria-hidden>·</span>
              <span>{a.date}</span>
              <span aria-hidden>·</span>
              <span>{a.readingTime}</span>
            </div>

            <h3 className="text-display mt-5 text-[clamp(1.7rem,3vw,2.6rem)] font-light leading-[1.08] tracking-[-0.01em] text-ink">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-out group-hover:bg-[length:100%_1px]">
                {a.title}
              </span>
            </h3>

            <p className="text-serif mt-4 max-w-[62ch] text-[clamp(0.98rem,1.1vw,1.08rem)] leading-[1.55] text-graphite/75 line-clamp-2">
              {truncate(a.excerpt, 160)}
            </p>

            <div className="text-mono mt-6 inline-flex items-center gap-2 text-eyebrow uppercase tracking-[0.22em] text-ink transition-colors group-hover:text-vermilion">
              Read article
              <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </div>
          </div>
        </div>
      </motion.a>
    </Reveal>
  );
}

function RowSkeleton() {
  return (
    <div className="border-t border-ink/15 py-10 first:border-t-0 first:pt-2 md:py-14">
      <div className="grid grid-cols-12 gap-6 md:gap-10">
        <div className="col-span-12 md:col-span-4"><div className="aspect-[4/3] animate-pulse bg-ink/5" /></div>
        <div className="col-span-12 md:col-span-8">
          <div className="h-3 w-48 animate-pulse bg-ink/10" />
          <div className="mt-5 h-8 w-[80%] animate-pulse bg-ink/10" />
          <div className="mt-3 h-8 w-[55%] animate-pulse bg-ink/10" />
          <div className="mt-6 h-3 w-full animate-pulse bg-ink/5" />
          <div className="mt-2 h-3 w-[70%] animate-pulse bg-ink/5" />
        </div>
      </div>
    </div>
  );
}

export function Ch10Journal() {
  const { data, isLoading } = useQuery({
    queryKey: ["journal", "featured"],
    queryFn: fetchFeatured,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const articles = data ?? [];

  return (
    <section id="journal" data-mood="warm" className="relative chapter-pad">
      <div className="mx-auto max-w-6xl">
        <header className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-9">
            <div className="text-mono text-meta uppercase tracking-[0.24em] text-graphite/55">
              /10 — Editorial · blog.manikantar.in
            </div>
            <h2 className="text-display mt-5 text-[clamp(2.4rem,5.6vw,4.8rem)] leading-[0.98] tracking-[-0.015em]">
              <MaskReveal>Research. Ideas. Field Notes.</MaskReveal>
            </h2>
            <p className="text-serif mt-6 max-w-[48ch] text-[clamp(1rem,1.25vw,1.18rem)] leading-[1.5] text-graphite/75">
              A curated selection from my personal journal.
            </p>
          </div>
          <div className="col-span-12 flex md:col-span-3 md:items-end md:justify-end">
            <div className="text-mono text-eyebrow uppercase tracking-[0.22em] text-graphite/45">
              Latest · {articles.length || "—"} featured
            </div>
          </div>
        </header>

        <div className="mt-16 md:mt-20">
          {isLoading
            ? [0, 1, 2].map((i) => <RowSkeleton key={i} />)
            : articles.map((a, i) => <ArticleRow key={a.id} a={a} i={i} />)}
        </div>

        <Reveal>
          <div className="mt-20 border-t border-ink/15 pt-10 md:mt-24">
            <div className="grid grid-cols-12 items-baseline gap-6">
              <div className="col-span-12 md:col-span-8">
                <div className="text-mono text-eyebrow uppercase tracking-[0.28em] text-vermilion">Continue reading</div>
                <p className="text-serif mt-3 max-w-[58ch] text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.55] text-graphite/80">More essays, research notes and long-form writing are available on my personal journal.</p>
              </div>
              <div className="col-span-12 md:col-span-4 md:text-right">
                <motion.a href={BLOG_URL} target="_blank" rel="noreferrer noopener" whileHover={{ x: 4 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="text-mono group inline-flex items-center gap-2 text-meta uppercase tracking-[0.24em] text-ink transition-colors hover:text-vermilion">
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1">Visit blog.manikantar.in</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </motion.a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}