"use client";
import { useQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import portrait from "@/assets/portrait.jpg";
import { Reveal } from "@/components/motion/primitives";
import usePortfolio from "@/hooks/usePortfolio";
const BLOG_URL = "https://insights.manikantar.in";
const JOURNAL_API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

async function fetchFeaturedArticles(): Promise<JournalArticle[]> {
  try {
    const res = await fetch(`${JOURNAL_API_BASE}/journal-articles`, { headers: { Accept: "application/json" } });
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

function JournalBlock() {
  const { data, isLoading } = useQuery({
    queryKey: ["journal", "featured"],
    queryFn: fetchFeaturedArticles,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
  const articles = data ?? [];

  return (
    <>
      <div className="li-latest">
        {isLoading
          ? [0, 1].map((i) => <div key={i} className="li-card li-row li-row--skeleton" aria-hidden />)
          : articles.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.08}>
                <a href={a.url} target="_blank" rel="noreferrer noopener" className="li-card li-row">
                  <div className="li-row__thumb" aria-hidden>
                    {a.cover ? <img src={a.cover} alt="" loading="lazy" /> : <span className="li-row__thumbArt" />}
                  </div>
                  <div className="li-row__body">
                    <span className="li-row__date">{a.category ? `${a.category} · ` : ""}{a.date}</span>
                    <h5 className="li-row__title">{a.title}</h5>
                    <p className="li-row__excerpt">{a.excerpt}</p>
                  </div>
                  <span className="li-row__read">Read <Arrow /></span>
                </a>
              </Reveal>
            ))}
      </div>
      <a href={BLOG_URL} target="_blank" rel="noreferrer noopener" className="li-journal__more">
        Visit insights.manikantar.in for the full archive <Arrow />
      </a>
    </>
  );
}

type FeedPost = {
  urn: string;
  url: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  cover?: string | null;
  metrics: {
    impressions?: number;
    likes?: number;
    comments?: number;
    reposts?: number;
    engagements?: number;
  };
};

type LinkedInFeed = {
  profile: {
    name: string;
    headline: string;
    company: string;
    location: string;
    profileUrl: string;
    verified: boolean;
  };
  network: { followers: number; connections: number };
  impact: {
    impressions: number;
    membersReached: number;
    engagements: number;
    topPostReach: number;
  };
  featured: FeedPost;
  editorsPick: FeedPost;
  latest: FeedPost[];
  updatedAt: string;
};

function useFeed() {
  return useQuery<LinkedInFeed>({
    queryKey: ["linkedin", "feed"],
    queryFn: async () => {
      // Try to fetch from API, fall back to seed data
      try {
        const r = await fetch("/api/public/linkedin-feed", { credentials: "omit" });
        if (!r.ok) throw new Error("feed unavailable");
        const data = await r.json();
        // The API returns { success: true, data: { ... } }
        if (data.success && data.data) {
          // Map API format to LinkedInFeed format
          const feed = data.data;
          return {
            profile: {
              name: feed.profile_name || "Manikanta R",
              headline: feed.profile_headline || "MBA Candidate · HR & Business Analytics · Researcher in Algorithmic HRM",
              company: feed.profile_company || "Nagarjuna Degree College — MBA Program",
              location: feed.profile_location || "Bengaluru, India",
              profileUrl: feed.profile_url || "https://www.linkedin.com/in/manikanta894/",
              verified: feed.profile_verified ?? true,
            },
            network: {
              followers: feed.followers || 302,
              connections: feed.connections || 282,
            },
            impact: {
              impressions: feed.impressions || 22488,
              membersReached: feed.members_reached || 12163,
              engagements: feed.engagements || 986,
              topPostReach: feed.top_post_reach || 14000,
            },
            featured: feed.featured || SEED.featured,
            editorsPick: feed.editors_pick || SEED.editorsPick,
            latest: feed.latest || [],
            updatedAt: feed.updated_at || new Date().toISOString(),
          };
        }
      } catch {
        // Fall through to seed data
      }
      return SEED;
    },
    initialData: SEED,
    staleTime: 60_000,
    retry: 1,
  });
}

const LINKEDIN_URL = "https://www.linkedin.com/in/manikanta894/";

// Initial values — used until API responds
const SEED: LinkedInFeed = {
  profile: {
    name: "Manikanta R",
    headline: "MBA Candidate · HR & Business Analytics · Researcher in Algorithmic HRM",
    company: "Nagarjuna Degree College — MBA Program",
    location: "Bengaluru, India",
    profileUrl: "https://www.linkedin.com/in/manikanta894/",
    verified: true,
  },
  network: { followers: 302, connections: 282 },
  impact: { impressions: 22488, membersReached: 12163, engagements: 986, topPostReach: 14000 },
  featured: {
    urn: "urn:li:share:7423180229197656064",
    url: "https://www.linkedin.com/feed/update/urn:li:share:7423180229197656064/",
    title: "The post that became my most read piece on LinkedIn",
    excerpt: "Notes on how AI is quietly rewriting the people-decisions stack — and why analytics leaders need to engage with it before policy does.",
    publishedAt: "2024-10-12T09:00:00.000Z",
    cover: null,
    metrics: { impressions: 14000, likes: 412, comments: 64, reposts: 28, engagements: 504 },
  },
  editorsPick: {
    urn: "urn:li:share:7461442770088538112",
    url: "https://www.linkedin.com/feed/update/urn:li:share:7461442770088538112/",
    title: "Editor's pick — Algorithmic HRM, in plain English",
    excerpt: "A short field note on how I think about algorithmic fairness when the algorithm is the manager.",
    publishedAt: "2025-02-04T09:00:00.000Z",
    cover: null,
    metrics: { impressions: 4800, likes: 168, comments: 22, reposts: 9, engagements: 199 },
  },
  latest: [],
  updatedAt: new Date().toISOString(),
};

export default function Ch09LinkedIn() {
  const { data } = useFeed();
  const f = data ?? SEED;

  return (
    <section id="linkedin" data-mood="graphite" className="relative chapter-pad overflow-hidden">
      <div aria-hidden className="li-ambient" />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="li-eyebrow">
          <span className="li-eyebrow__num">09</span>
          <span className="li-eyebrow__sep" />
          <span>Connect · Live from LinkedIn, my journal & elsewhere</span>
        </div>
        <h2 className="li-title">A working public ledger of how I show up.</h2>
        <p className="li-subtitle">Profile, network, writing, and the places I'm active — pulled from live feeds and refreshed automatically.</p>

        <article className="li-card li-profile">
          <div className="li-profile__photo">
            <img src={portrait} alt={f.profile.name} loading="lazy" />
            <span className="li-profile__ring" aria-hidden />
          </div>
          <div className="li-profile__body">
            <div className="li-profile__nameRow">
              <h3 className="li-profile__name">{f.profile.name}</h3>
              {f.profile.verified && (
                <span className="li-verified" title="LinkedIn verified profile">
                  <VerifiedTick /> Verified
                </span>
              )}
            </div>
            <p className="li-profile__headline">{f.profile.headline}</p>
            <dl className="li-profile__meta">
              <Meta label="Currently" value={f.profile.company} />
              <Meta label="Based in" value={f.profile.location} />
              <Meta label="Open to" value="Research collaborations · Analytics roles" />
            </dl>
            <a className="li-cta" href={f.profile.profileUrl} target="_blank" rel="noopener noreferrer">
              View verified profile <Arrow />
            </a>
          </div>
        </article>

        <div className="li-block">
          <BlockHead n="01" title="Network & Impact" sub="Reach across the platform, last twelve months" />
          <div className="li-grid-4">
            <ImpactStat label="Followers" value={f.network.followers} />
            <ImpactStat label="Connections" value={f.network.connections} />
            <ImpactStat label="Total Impressions" value={f.impact.impressions} suffix="+" />
            <ImpactStat label="Total Engagements" value={f.impact.engagements} />
          </div>
        </div>

        <div className="li-block">
          <BlockHead n="02" title="Featured Post" sub="The piece that travelled the furthest" />
          <FeaturedHero post={f.featured} />
        </div>

        <div className="li-block">
          <BlockHead n="03" title="Latest Posts" sub="Refreshes whenever I publish" />
          <div className="li-latest">
            {(f.latest.length ? f.latest : [SEED.featured, SEED.editorsPick]).slice(0, 2).map((p, i) => (
              <PostRow key={p.urn + i} post={p} />
            ))}
          </div>
        </div>

        <div className="li-block">
          <BlockHead n="04" title="Field Notes & Journal" sub="Long-form writing, off-platform" />
          <JournalBlock />
        </div>

        <div className="li-finalCta">
          <a className="li-cta li-cta--lg" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            Connect with me on LinkedIn <Arrow />
          </a>
          <p className="li-finalCta__hint">Updated {fmtUpdated(f.updatedAt)} · Synchronised from live feeds.</p>
        </div>
      </div>
      <style>{css}</style>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="li-meta">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function BlockHead({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <header className="li-blockHead">
      <span className="li-blockHead__n tabular-nums">{n}</span>
      <div>
        <h3 className="li-blockHead__title">{title}</h3>
        <p className="li-blockHead__sub">{sub}</p>
      </div>
    </header>
  );
}

function BigStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="li-card li-bigStat">
      <Counter value={value} className="li-bigStat__num tabular-nums" />
      <span className="li-bigStat__label">{label}</span>
    </div>
  );
}

function ImpactStat({ label, value, suffix, compact }: { label: string; value: number; suffix?: string; compact?: boolean }) {
  return (
    <div className="li-card li-impact">
      <Counter value={value} suffix={suffix} compact={compact} className="li-impact__num tabular-nums" />
      <span className="li-impact__label">{label}</span>
    </div>
  );
}

function FeaturedHero({ post }: { post: FeedPost }) {
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer" className="li-card li-hero group">
      <div className="li-hero__cover" aria-hidden>
        {post.cover ? <img src={post.cover} alt="" loading="lazy" /> : <FeaturedCoverArt />}
      </div>
      <div className="li-hero__body">
        <div className="li-hero__chip">Most read · Featured</div>
        <h4 className="li-hero__title">{post.title}</h4>
        <p className="li-hero__excerpt">{post.excerpt}</p>
        <div className="li-hero__metrics">
          <MetricCell label="Impressions" value={post.metrics.impressions} />
          <MetricCell label="Likes" value={post.metrics.likes} />
          <MetricCell label="Comments" value={post.metrics.comments} />
          <MetricCell label="Reposts" value={post.metrics.reposts} />
          <MetricCell label="Engagements" value={post.metrics.engagements} />
        </div>
        <span className="li-hero__read">Read on LinkedIn <Arrow /></span>
      </div>
    </a>
  );
}

function PostRow({ post }: { post: FeedPost }) {
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer" className="li-card li-row">
      <div className="li-row__thumb" aria-hidden>
        {post.cover ? <img src={post.cover} alt="" loading="lazy" /> : <span className="li-row__thumbArt" />}
      </div>
      <div className="li-row__body">
        <span className="li-row__date">{fmtDate(post.publishedAt)}</span>
        <h5 className="li-row__title">{post.title}</h5>
        <p className="li-row__excerpt">{post.excerpt}</p>
        <div className="li-row__metrics">
          <MiniMetric label="Impressions" value={post.metrics.impressions} />
          <MiniMetric label="Likes" value={post.metrics.likes} />
          <MiniMetric label="Comments" value={post.metrics.comments} />
          <MiniMetric label="Reposts" value={post.metrics.reposts} />
        </div>
      </div>
      <span className="li-row__read">Read <Arrow /></span>
    </a>
  );
}

function MetricCell({ label, value }: { label: string; value?: number }) {
  if (value == null) return null;
  return (
    <div className="li-mcell">
      <Counter value={value} compact className="li-mcell__v tabular-nums" />
      <span className="li-mcell__l">{label}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value?: number }) {
  if (value == null) return null;
  return (
    <span className="li-mini">
      <Counter value={value} compact className="tabular-nums" /> {label}
    </span>
  );
}

function VerifiedTick() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
      <path fill="currentColor" d="M12 1.6 14.2 4l3.3-.2.2 3.3L20 9l-1.6 2.2.2 3.3-3.3.2-2.2 2.3-2.2-2.3-3.3-.2.2-3.3L4 9l1.7-1.9-.2-3.3 3.3.2L12 1.6Zm-1.3 12 5-5-1.4-1.4-3.6 3.6-1.6-1.6-1.4 1.4 3 3Z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden className="li-arrow">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function FeaturedCoverArt() {
  return (
    <div className="li-coverArt">
      <div className="li-coverArt__grid" />
      <div className="li-coverArt__orb" />
      <span className="li-coverArt__mono">MR</span>
    </div>
  );
}

function Counter({ value, suffix = "", className = "", compact = false }: { value: number; suffix?: string; className?: string; compact?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setDisplay(Math.round(value * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  const text = compact ? fmtCompact(display) : display.toLocaleString();
  return <motion.span ref={ref} className={className}>{text}{suffix}</motion.span>;
}

function fmtCompact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, "") + "K";
  return n.toString();
}
function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
  catch { return ""; }
}
function fmtUpdated(iso: string) {
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
  catch { return "recently"; }
}

const css = `
.li-ambient { position: absolute; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(60% 40% at 12% 8%, color-mix(in oklab, var(--vermilion) 14%, transparent), transparent 60%), radial-gradient(50% 35% at 88% 80%, color-mix(in oklab, var(--ink) 30%, transparent), transparent 60%); opacity: 0.5; }
.li-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: color-mix(in oklab, currentColor 65%, transparent); margin-bottom: 18px; }
.li-eyebrow__num { color: var(--vermilion); font-weight: 600; }
.li-eyebrow__sep { width: 22px; height: 1px; background: color-mix(in oklab, currentColor 35%, transparent); }
.li-title { font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.02; letter-spacing: -0.02em; max-width: 22ch; }
.li-subtitle { margin-top: 14px; max-width: 60ch; font-size: clamp(1rem, 1.15vw, 1.125rem); color: color-mix(in oklab, currentColor 72%, transparent); }
.li-card { position: relative; border-radius: 22px; background: color-mix(in oklab, var(--bone) 6%, transparent); border: 1px solid color-mix(in oklab, currentColor 14%, transparent); backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%); box-shadow: 0 1px 0 color-mix(in oklab, #ffffff 8%, transparent) inset, 0 24px 60px -32px color-mix(in oklab, #000 70%, transparent); transition: transform .4s cubic-bezier(.2,.7,.2,1), border-color .3s ease, background .3s ease; }
.li-card:hover { border-color: color-mix(in oklab, currentColor 24%, transparent); transform: translateY(-2px); }
.li-profile { margin-top: 56px; display: grid; grid-template-columns: 220px 1fr; gap: 36px; padding: 28px; align-items: center; }
@media (max-width: 760px) { .li-profile { grid-template-columns: 1fr; gap: 22px; padding: 22px; } }
.li-profile__photo { position: relative; width: 200px; height: 200px; border-radius: 50%; overflow: hidden; isolation: isolate; }
.li-profile__photo img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.05) contrast(1.02); }
.li-profile__ring { position: absolute; inset: -4px; border-radius: 50%; background: conic-gradient(from 220deg, color-mix(in oklab, var(--vermilion) 80%, transparent), color-mix(in oklab, currentColor 30%, transparent), color-mix(in oklab, var(--vermilion) 80%, transparent)); z-index: -1; filter: blur(2px); opacity: .8; }
.li-profile__nameRow { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.li-profile__name { font-family: var(--font-display); font-size: clamp(1.8rem, 2.6vw, 2.4rem); line-height: 1; letter-spacing: -0.01em; }
.li-verified { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: color-mix(in oklab, var(--vermilion) 14%, transparent); border: 1px solid color-mix(in oklab, var(--vermilion) 42%, transparent); color: var(--ink); font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; }
.li-profile__headline { margin-top: 10px; font-size: clamp(1rem, 1.15vw, 1.125rem); color: color-mix(in oklab, currentColor 78%, transparent); max-width: 56ch; }
.li-profile__meta { margin-top: 18px; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; }
@media (max-width: 760px) { .li-profile__meta { grid-template-columns: 1fr; gap: 8px; } }
.li-meta { border-left: 1px solid color-mix(in oklab, currentColor 18%, transparent); padding-left: 12px; }
.li-meta dt { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: color-mix(in oklab, currentColor 55%, transparent); }
.li-meta dd { margin: 4px 0 0; font-size: 14px; }
.li-cta { display: inline-flex; align-items: center; gap: 8px; margin-top: 22px; padding: 11px 18px; border-radius: 999px; background: color-mix(in oklab, var(--ink) 70%, transparent); color: var(--bone); font-size: 13.5px; letter-spacing: 0.02em; text-decoration: none; border: 1px solid color-mix(in oklab, currentColor 18%, transparent); transition: transform .25s ease, background .25s ease; }
.dark .li-cta { background: var(--bone); color: var(--ink); }
.li-cta:hover { transform: translateY(-1px); }
.li-cta--lg { padding: 14px 24px; font-size: 15px; }
.li-arrow { transition: transform .3s ease; }
.li-cta:hover .li-arrow { transform: translateX(3px); }
.li-block { margin-top: 64px; }
.li-blockHead { display: flex; align-items: baseline; gap: 14px; margin-bottom: 18px; }
.li-blockHead__n { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.22em; color: var(--vermilion); }
.li-blockHead__title { font-family: var(--font-display); font-size: clamp(1.35rem, 1.8vw, 1.75rem); letter-spacing: -0.01em; }
.li-blockHead__sub { margin-top: 2px; font-size: 13px; color: color-mix(in oklab, currentColor 60%, transparent); }
.li-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.li-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
@media (max-width: 880px) { .li-grid-4 { grid-template-columns: 1fr 1fr; } }
@media (max-width: 520px) { .li-grid-2, .li-grid-4 { grid-template-columns: 1fr; } }
.li-bigStat { padding: 28px 28px 24px; }
.li-bigStat__num { display: block; font-family: var(--font-display); font-size: clamp(3rem, 5.5vw, 4.5rem); line-height: 1; letter-spacing: -0.02em; }
.li-bigStat__label { display: block; margin-top: 10px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: color-mix(in oklab, currentColor 60%, transparent); }
.li-impact { padding: 22px 22px 20px; }
.li-impact__num { display: block; font-family: var(--font-display); font-size: clamp(1.9rem, 3vw, 2.6rem); line-height: 1; letter-spacing: -0.015em; }
.li-impact__label { display: block; margin-top: 8px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: color-mix(in oklab, currentColor 55%, transparent); }
.li-hero { display: grid; grid-template-columns: 1.05fr 1fr; gap: 0; overflow: hidden; text-decoration: none; color: inherit; }
@media (max-width: 880px) { .li-hero { grid-template-columns: 1fr; } }
.li-hero__cover { position: relative; min-height: 320px; background: linear-gradient(135deg, oklch(0.22 0.02 60), oklch(0.13 0.01 60)); }
.li-hero__cover img { width: 100%; height: 100%; object-fit: cover; }
.li-hero__body { padding: 32px 32px 28px; display: flex; flex-direction: column; gap: 14px; }
.li-hero__chip { align-self: flex-start; padding: 5px 12px; border-radius: 999px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase; background: color-mix(in oklab, var(--vermilion) 22%, transparent); color: color-mix(in oklab, var(--vermilion) 80%, currentColor 20%); border: 1px solid color-mix(in oklab, var(--vermilion) 40%, transparent); }
.li-hero__title { font-family: var(--font-display); font-size: clamp(1.6rem, 2.4vw, 2.2rem); line-height: 1.08; letter-spacing: -0.015em; }
.li-hero__excerpt { font-size: 15px; line-height: 1.55; color: color-mix(in oklab, currentColor 78%, transparent); }
.li-hero__metrics { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-top: 4px; padding-top: 16px; border-top: 1px solid color-mix(in oklab, currentColor 14%, transparent); }
@media (max-width: 600px) { .li-hero__metrics { grid-template-columns: repeat(3, 1fr); } }
.li-mcell { display: flex; flex-direction: column; gap: 2px; }
.li-mcell__v { font-family: var(--font-display); font-size: 18px; }
.li-mcell__l { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.18em; text-transform: uppercase; color: color-mix(in oklab, currentColor 55%, transparent); }
.li-hero__read { margin-top: auto; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: color-mix(in oklab, currentColor 92%, transparent); }
.li-coverArt { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(120% 80% at 80% 20%, color-mix(in oklab, var(--vermilion) 30%, transparent), transparent 60%), linear-gradient(135deg, oklch(0.24 0.02 60), oklch(0.12 0.008 60)); }
.li-coverArt__grid { position: absolute; inset: 0; background-image: linear-gradient(color-mix(in oklab, currentColor 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, currentColor 8%, transparent) 1px, transparent 1px); background-size: 32px 32px; mask-image: radial-gradient(80% 60% at 30% 60%, #000, transparent 80%); }
.li-coverArt__orb { position: absolute; right: -60px; top: -60px; width: 260px; height: 260px; border-radius: 50%; background: radial-gradient(circle, color-mix(in oklab, var(--vermilion) 65%, transparent), transparent 70%); filter: blur(8px); }
.li-coverArt__mono { position: absolute; left: 28px; bottom: 22px; font-family: var(--font-display); font-size: 72px; line-height: 1; color: color-mix(in oklab, currentColor 88%, transparent); letter-spacing: -0.04em; }
.li-mini { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: color-mix(in oklab, currentColor 65%, transparent); }
.li-mini .tabular-nums { font-family: var(--font-display); font-size: 14px; letter-spacing: 0; color: currentColor; margin-right: 4px; }
.li-latest { display: flex; flex-direction: column; gap: 14px; }
.li-row { display: grid; grid-template-columns: 120px 1fr auto; gap: 22px; padding: 18px 22px; align-items: center; text-decoration: none; color: inherit; }
@media (max-width: 720px) { .li-row { grid-template-columns: 1fr; gap: 12px; padding: 18px; } .li-row__read { justify-self: start; } }
.li-row__thumb { width: 120px; height: 80px; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, oklch(0.22 0.02 60), oklch(0.13 0.008 60)); position: relative; }
.li-row__thumbArt { position: absolute; inset: 0; background: radial-gradient(60% 60% at 70% 30%, color-mix(in oklab, var(--vermilion) 50%, transparent), transparent 70%), linear-gradient(135deg, oklch(0.22 0.02 60), oklch(0.13 0.008 60)); }
.li-row__date { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: color-mix(in oklab, currentColor 55%, transparent); }
.li-row__title { font-family: var(--font-display); font-size: clamp(1.1rem, 1.4vw, 1.3rem); line-height: 1.18; letter-spacing: -0.005em; margin-top: 4px; }
.li-row__excerpt { margin-top: 6px; font-size: 13.5px; line-height: 1.5; color: color-mix(in oklab, currentColor 70%, transparent); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.li-row__metrics { margin-top: 10px; display: flex; flex-wrap: wrap; gap: 14px; }
.li-row__read { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: color-mix(in oklab, var(--vermilion) 75%, currentColor 25%); }
.li-finalCta { margin-top: 80px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
.li-finalCta__hint { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase; color: color-mix(in oklab, currentColor 50%, transparent); }
.li-row--skeleton { height: 96px; background: color-mix(in oklab, currentColor 6%, transparent); animation: li-pulse 1.6s ease-in-out infinite; }
@keyframes li-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
.li-journal__more { margin-top: 18px; display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.08em; color: color-mix(in oklab, var(--vermilion) 75%, currentColor 25%); text-decoration: none; }
`;