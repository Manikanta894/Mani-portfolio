import { createFileRoute } from "@tanstack/react-router";

import { useLenis } from "@/lib/hooks";
import { LiveClock, CornerStamp } from "@/components/chrome/Chrome";
import { PremiumNav } from "@/components/chrome/PremiumNav";
import { ReadingProgress } from "@/components/chrome/ReadingProgress";
import usePortfolio from "@/hooks/usePortfolio";


import { Ch00Cover } from "@/components/chapters/Ch00Cover";
import { Ch01About } from "@/components/chapters/Ch01About";
import { Ch02Education } from "@/components/chapters/Ch02Education";
import { Ch03Experience } from "@/components/chapters/Ch03Experience";

import { Ch05Research } from "@/components/chapters/Ch05Research";
import { Ch06Work } from "@/components/chapters/Ch06Work";
import { Ch07Ecosystem } from "@/components/chapters/Ch07Ecosystem";
import { Ch08Credentials } from "@/components/chapters/Ch08Credentials";
import Ch09LinkedIn from "@/components/chapters/Ch09LinkedIn";
import { Ch11Philosophy } from "@/components/chapters/Ch11Philosophy";
import { Ch12Contact } from "@/components/chapters/Ch12Contact";
import { Ch14BeyondNotes } from "@/components/chapters/Ch14BeyondNotes";
import { SiteFooter } from "@/components/chrome/SiteFooter";


export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useLenis();

  const {
    loading,
    error,
    profile,
    education,
    experience,
    projects,
    research,
    publications,
    certifications,
    seo,
    pageSeo,
    siteSettings,
  } = usePortfolio();

  const SITE_URL = "https://manikantar.in";

  // Dynamic SEO — page_seo table first, fall back to profile
  const pageSeoData = (pageSeo || []).find((p: any) => p.page_slug === "/");
  const title = pageSeoData?.title || profile?.site_title || "Manikanta R — HR Analytics · AI Strategy · People Data";
  const desc = pageSeoData?.description || profile?.site_description || "Manikanta R · MBA candidate in HR & Business Analytics, Bengaluru.";
  const keywords = pageSeoData?.keywords || profile?.site_keywords || "Manikanta R, HR Analytics, Business Analytics, AI Strategy, People Analytics, MBA, Bengaluru";
  const ogImage = pageSeoData?.og_image || profile?.og_image || `${SITE_URL}/og-image.jpg`;
  const ogTitle = pageSeoData?.og_title || title;
  const ogDesc = pageSeoData?.og_description || desc;
  const twitterTitle = pageSeoData?.twitter_title || ogTitle;
  const twitterDesc = pageSeoData?.twitter_description || ogDesc;
  const twitterImage = pageSeoData?.twitter_image || ogImage;
  const canonicalUrl = pageSeoData?.canonical_url || SITE_URL;
  const noindex = pageSeoData?.noindex || false;
  const nofollow = pageSeoData?.nofollow || false;

  // Structured data from page_seo or build dynamically
  const customStructuredData = pageSeoData?.structured_data;
  const personJsonLd = customStructuredData && Object.keys(customStructuredData).length > 0
    ? customStructuredData
    : {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile?.name || "Manikanta R",
        url: SITE_URL,
        jobTitle: profile?.role || "MBA Candidate — HR & Business Analytics",
        address: { "@type": "PostalAddress", addressLocality: profile?.location || "Bengaluru", addressCountry: "IN" },
        sameAs: [
          "https://www.linkedin.com/in/manikanta-r",
          "https://github.com/manikantar",
          "https://orcid.org/0009-0005-2576-8731",
        ],
      };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading Portfolio...
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Failed to load portfolio.
      </main>
    );
  }
  return (
    <main className="relative bg-bone text-ink">
      <ReadingProgress />
      <PremiumNav />
      
      <LiveClock />
      <CornerStamp />

      <Ch00Cover />
      <Ch01About />
      <Ch02Education />
      <Ch03Experience />

      <Ch06Work />
      <Ch07Ecosystem />
      <Ch05Research />
      <Ch08Credentials />
      <Ch09LinkedIn />
      <Ch11Philosophy />
      <Ch12Contact />
      <Ch14BeyondNotes />
      
      <SiteFooter />

      {/*
        Dynamic head meta. NOTE: this must NOT be wrapped in a literal
        <head> element - <head> is not a valid child of <main>/<body> and
        React does not treat it as a hoistable tag. React 19 auto-hoists
        bare <title>, <meta>, <link>, and <script> tags to the real
        document <head> no matter where they're rendered, so a fragment is
        all that's needed. (The <head> wrapper caused invalid DOM nesting
        and was silently breaking hydration.)
      */}
      <>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={SITE_URL} />
        {noindex || nofollow ? (
          <meta
            name="robots"
            content={`${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`}
          />
        ) : null}
        <script type="application/ld+json">
          {JSON.stringify(personJsonLd)}
        </script>
      </>
    </main>
  );
}
