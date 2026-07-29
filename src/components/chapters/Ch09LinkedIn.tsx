"use client";
import { useQuery } from "@tanstack/react-query";
import portrait from "@/assets/portrait.jpg";
import { Reveal } from "@/components/motion/primitives";
import usePortfolio from "@/hooks/usePortfolio";

const BLOG_URL = "https://insights.manikantar.in";
const LINKEDIN_URL = "https://www.linkedin.com/in/manikanta894/";
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
                    <span className="li-row__thumb-read">{a.readingTime}</span>
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

export default function Ch09LinkedIn() {
  const { profile } = usePortfolio();
  const p = {
    name: profile?.name || "Manikanta R",
    headline: profile?.tagline_plain || profile?.headline || "MBA Candidate · HR & Business Analytics · Researcher in Algorithmic HRM",
    company: profile?.current_program || "Nagarjuna Degree College — MBA Program",
    location: profile?.location || "Bengaluru, India",
    verified: true,
  };

  return (
    <section id="linkedin" data-mood="ink" className="relative chapter-pad overflow-hidden">
      <div aria-hidden className="li-grid-bg" />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="li-eyebrow">
          <span className="li-eyebrow__num">09</span>
          <span className="li-eyebrow__sep" />
          <span>Connect · Long-form writing & where to find me</span>
        </div>
        <h2 className="li-title">A working public ledger of how I show up.</h2>
        <p className="li-subtitle">My writing lives here and on my journal — everything else about my work and network is on LinkedIn itself.</p>

        <div className="li-topRow li-topRow--solo">
          <article className="li-card li-profile li-profile--wide">
            <div className="li-profile__photo">
              <img src={portrait} alt={p.name} loading="lazy" />
              <span className="li-profile__ring" aria-hidden />
            </div>
            <div className="li-profile__identity">
              <div className="li-profile__nameRow">
                <h3 className="li-profile__name">{p.name}</h3>
                {p.verified && (
                  <span className="li-verified" title="LinkedIn verified profile">
                    <VerifiedTick /> Verified
                  </span>
                )}
              </div>
              <p className="li-profile__headline">{p.headline}</p>
            </div>
            <dl className="li-profile__meta li-profile__meta--row">
              <Meta label="Currently" value={p.company} />
              <Meta label="Based in" value={p.location} />
              <Meta label="Open to" value="Research · Analytics · Consulting" />
            </dl>
            <a className="li-cta" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              View verified profile <Arrow />
            </a>
          </article>
        </div>

        <div className="li-block">
          <BlockHead n="01" title="Field Notes & Journal" sub="Long-form writing, published on my own journal" />
          <JournalBlock />
        </div>

        <div className="li-finalCta">
          <a className="li-cta li-cta--lg" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            Connect with me on LinkedIn <Arrow />
          </a>
          <p className="li-finalCta__hint">Let's connect and keep the conversation going.</p>
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

const css = `
.li-grid-bg {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(60% 40% at 12% 8%, color-mix(in oklab, var(--vermilion) 14%, transparent), transparent 60%),
    radial-gradient(50% 35% at 88% 80%, color-mix(in oklab, var(--ink) 30%, transparent), transparent 60%);
  opacity: 0.5;
}
.li-eyebrow { display: inline-flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: color-mix(in oklab, currentColor 65%, transparent); margin-bottom: 18px; }
.li-eyebrow__num { color: var(--vermilion); font-weight: 600; }
.li-eyebrow__sep { width: 22px; height: 1px; background: color-mix(in oklab, currentColor 35%, transparent); }
.li-title { font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1.02; letter-spacing: -0.02em; max-width: 22ch; }
.li-subtitle { margin-top: 14px; max-width: 60ch; font-size: clamp(1rem, 1.15vw, 1.125rem); color: color-mix(in oklab, currentColor 72%, transparent); }
.li-card { position: relative; border-radius: 22px; background: color-mix(in oklab, var(--bone) 6%, transparent); border: 1px solid color-mix(in oklab, currentColor 14%, transparent); backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%); box-shadow: 0 1px 0 color-mix(in oklab, #ffffff 8%, transparent) inset, 0 24px 60px -32px color-mix(in oklab, #000 70%, transparent); transition: transform .4s cubic-bezier(.2,.7,.2,1), border-color .3s ease, background .3s ease; }
.li-card:hover { border-color: color-mix(in oklab, currentColor 24%, transparent); transform: translateY(-2px); }
.li-topRow { margin-top: 56px; display: grid; grid-template-columns: 1fr; gap: 20px; }
.li-profile--wide { grid-template-columns: 88px auto 1fr auto; gap: 28px; padding: 28px 32px; display: grid; align-items: center; }
.li-profile__identity { min-width: 220px; }
.li-profile__meta--row { display: flex; gap: 28px; margin: 0; border-left: 1px solid var(--rule); padding-left: 28px; }
@media (max-width: 1024px) {
  .li-profile--wide { grid-template-columns: 72px 1fr; }
  .li-profile__meta--row { border-left: none; padding-left: 0; margin-top: 16px; flex-wrap: wrap; grid-column: 1 / -1; }
}
.li-profile__photo { position: relative; width: 96px; height: 96px; border-radius: 50%; overflow: hidden; isolation: isolate; }
.li-profile__photo img { width: 100%; height: 100%; object-fit: cover; filter: saturate(1.05) contrast(1.02); }
.li-profile__ring { position: absolute; inset: -4px; border-radius: 50%; background: conic-gradient(from 220deg, color-mix(in oklab, var(--vermilion) 80%, transparent), color-mix(in oklab, currentColor 30%, transparent), color-mix(in oklab, var(--vermilion) 80%, transparent)); z-index: -1; filter: blur(2px); opacity: .8; }
.li-profile__nameRow { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.li-profile__name { font-family: var(--font-display); font-size: clamp(1.8rem, 2.6vw, 2.4rem); line-height: 1; letter-spacing: -0.01em; }
.li-verified { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: color-mix(in oklab, var(--vermilion) 14%, transparent); border: 1px solid color-mix(in oklab, var(--vermilion) 42%, transparent); color: var(--ink); font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; }
.dark .li-verified { color: var(--bone); }
.li-profile__headline { margin-top: 10px; font-size: clamp(1rem, 1.15vw, 1.125rem); color: color-mix(in oklab, currentColor 78%, transparent); max-width: 56ch; }
.li-meta { border-left: 1px solid color-mix(in oklab, currentColor 18%, transparent); padding-left: 12px; }
.li-meta dt { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: color-mix(in oklab, currentColor 55%, transparent); }
.li-meta dd { margin: 4px 0 0; font-size: 14px; }

.li-cta { display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 999px; background: color-mix(in oklab, var(--ink) 70%, transparent); color: var(--bone); font-size: 13.5px; letter-spacing: 0.02em; text-decoration: none; border: 1px solid color-mix(in oklab, currentColor 18%, transparent); transition: transform .25s ease, background .25s ease, box-shadow .25s ease; }
.dark .li-cta { background: var(--bone); color: var(--ink); }
.li-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -12px rgba(212,106,46,0.15); }
.li-cta--lg { padding: 14px 28px; font-size: 15px; }
.li-arrow { transition: transform .3s ease; }
.li-cta:hover .li-arrow { transform: translateX(4px); }
.li-block { margin-top: 64px; }
.li-blockHead { display: flex; align-items: baseline; gap: 14px; margin-bottom: 18px; }
.li-blockHead__n { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.22em; color: var(--vermilion); }
.li-blockHead__title { font-family: var(--font-display); font-size: clamp(1.35rem, 1.8vw, 1.75rem); letter-spacing: -0.01em; }
.li-blockHead__sub { margin-top: 2px; font-size: 13px; color: color-mix(in oklab, currentColor 60%, transparent); }
.li-latest { display: flex; flex-direction: column; gap: 14px; }
.li-row { display: grid; grid-template-columns: 120px 1fr auto; gap: 22px; padding: 18px 22px; align-items: center; text-decoration: none; color: inherit; }
@media (max-width: 720px) { .li-row { grid-template-columns: 1fr; gap: 12px; padding: 18px; } .li-row__read { justify-self: start; } }
.li-row__thumb { width: 120px; height: 80px; border-radius: 12px; overflow: hidden; background: linear-gradient(135deg, oklch(0.22 0.02 60), oklch(0.13 0.008 60)); position: relative; }
.li-row__thumb img { width: 100%; height: 100%; object-fit: cover; }
.li-row__thumbArt { position: absolute; inset: 0; background: radial-gradient(60% 60% at 70% 30%, color-mix(in oklab, var(--vermilion) 50%, transparent), transparent 70%), linear-gradient(135deg, oklch(0.22 0.02 60), oklch(0.13 0.008 60)); }
.li-row__thumb-read { position: absolute; bottom: 4px; left: 4px; padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.1em; color: #fff; }
.li-row__date { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.2em; text-transform: uppercase; color: color-mix(in oklab, currentColor 55%, transparent); }
.li-row__title { font-family: var(--font-display); font-size: clamp(1.1rem, 1.4vw, 1.3rem); line-height: 1.18; letter-spacing: -0.005em; margin-top: 4px; }
.li-row__excerpt { margin-top: 6px; font-size: 13.5px; line-height: 1.5; color: color-mix(in oklab, currentColor 70%, transparent); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.li-row__read { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: color-mix(in oklab, var(--vermilion) 75%, currentColor 25%); }
.li-finalCta { margin-top: 80px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; }
.li-finalCta__hint { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase; color: color-mix(in oklab, currentColor 50%, transparent); }
.li-row--skeleton { height: 96px; background: color-mix(in oklab, currentColor 6%, transparent); animation: li-pulse 1.6s ease-in-out infinite; }
@keyframes li-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
.li-journal__more { margin-top: 18px; display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.08em; color: color-mix(in oklab, var(--vermilion) 75%, currentColor 25%); text-decoration: none; }
.li-journal__more:hover { color: var(--vermilion); }
`;
