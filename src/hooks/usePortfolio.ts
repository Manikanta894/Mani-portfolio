import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "@/services/api";

export interface PortfolioData {
  profile: any;
  education: any[];
  experience: any[];
  projects: any[];
  research: any[];
  publications: any[];
  certifications: any[];
  seo: any;
  aboutBeats: any[];
  aboutMilestones: any[];
  aboutMetrics: any[];
  awards: any[];
  capabilityDomains: any[];
  capabilities: any[];
  ecosystemStats: any[];
  linkedInFeed: any;
  journalArticles: any[];
  researchThemes: any[];
  navigationItems: any[];
  socialLinks: any[];
  siteSections: any[];
  pageSeo: any[];
  media: any[];
  siteSettings: any[];
  sectionContent: Record<string, any>;
}

// Every chapter/chrome component calls usePortfolio() independently (15+ call
// sites). This used to run a fresh useEffect + Promise.all(24 fetches) on
// *every* mount - ~360 duplicate network requests per page load, and a single
// failing endpoint (Promise.all) blanked the entire page.
//
// React Query dedupes by queryKey: every component asking for the same
// resource shares one in-flight request and one cache entry. Each resource
// is also isolated - if one table 500s, every other section still renders
// with its own data (or its component-level fallback) instead of the whole
// page failing.
const STALE_TIME = 60000; // 1 min - content is CMS-edited, not high-frequency

function resource<T>(key: string, fetcher: () => Promise<any>, fallback: T) {
  return useQuery({
    queryKey: ["portfolio", key],
    queryFn: async () => {
      const res = await fetcher();
      return (res?.data ?? fallback) as T;
    },
    staleTime: STALE_TIME,
    retry: 1,
    throwOnError: false,
  });
}

function pluck<T>(q: UseQueryResult<T>, fallback: T): T {
  return (q.data as T) ?? fallback;
}

export default function usePortfolio() {
  const profile = resource("profile", () => api.getProfile(), null as any);
  const education = resource("education", () => api.getEducation(), [] as any[]);
  const experience = resource("experience", () => api.getExperience(), [] as any[]);
  const projects = resource("projects", () => api.getProjects(), [] as any[]);
  const research = resource("research", () => api.getResearchPapers(), [] as any[]);
  const publications = resource("publications", () => api.getPublications(), [] as any[]);
  const certifications = resource("certifications", () => api.getCertifications(), [] as any[]);
  const seo = resource("seo", () => api.getSeo(), null as any);
  const aboutBeats = resource("aboutBeats", () => api.getAboutBeats(), [] as any[]);
  const aboutMilestones = resource("aboutMilestones", () => api.getAboutMilestones(), [] as any[]);
  const aboutMetrics = resource("aboutMetrics", () => api.getAboutMetrics(), [] as any[]);
  const awards = resource("awards", () => api.getAwards(), [] as any[]);
  const capabilityDomains = resource("capabilityDomains", () => api.getCapabilityDomains(), [] as any[]);
  const capabilities = resource("capabilities", () => api.getCapabilities(), [] as any[]);
  const ecosystemStats = resource("ecosystemStats", () => api.getEcosystemStats(), [] as any[]);
  const linkedInFeed = resource("linkedInFeed", () => api.getLinkedInFeed(), null as any);
  const journalArticles = resource("journalArticles", () => api.getJournalArticles(), [] as any[]);
  const researchThemes = resource("researchThemes", () => api.getResearchThemes(), [] as any[]);
  const navigationItems = resource("navigationItems", () => api.getNavigationItems(), [] as any[]);
  const socialLinks = resource("socialLinks", () => api.getSocialLinks(), [] as any[]);
  const siteSections = resource("siteSections", () => api.getSiteSections(), [] as any[]);
  const pageSeo = resource("pageSeo", () => api.getPageSeo(), [] as any[]);
  const media = resource("media", () => api.getMedia(), [] as any[]);
  const siteSettings = resource("siteSettings", () => api.getSiteSettings(), [] as any[]);
  const sectionContent = resource("sectionContent", () => api.getSectionContent(), [] as any[]);

  const all = [
    profile, education, experience, projects, research, publications, certifications, seo,
    aboutBeats, aboutMilestones, aboutMetrics, awards, capabilityDomains, capabilities,
    ecosystemStats, linkedInFeed, journalArticles, researchThemes, navigationItems,
    socialLinks, siteSections, pageSeo, media, siteSettings, sectionContent,
  ];

  const loading = all.some((q) => q.isLoading);
  const error = all.find((q) => q.isError)?.error ?? null;

  const data: PortfolioData = {
    profile: pluck(profile, null),
    education: pluck(education, []),
    experience: pluck(experience, []),
    projects: pluck(projects, []),
    research: pluck(research, []),
    publications: pluck(publications, []),
    certifications: pluck(certifications, []),
    seo: pluck(seo, null),
    aboutBeats: pluck(aboutBeats, []),
    aboutMilestones: pluck(aboutMilestones, []),
    aboutMetrics: pluck(aboutMetrics, []),
    awards: pluck(awards, []),
    capabilityDomains: pluck(capabilityDomains, []),
    capabilities: pluck(capabilities, []),
    ecosystemStats: pluck(ecosystemStats, []),
    linkedInFeed: pluck(linkedInFeed, null),
    journalArticles: pluck(journalArticles, []),
    researchThemes: pluck(researchThemes, []),
    navigationItems: pluck(navigationItems, []),
    socialLinks: pluck(socialLinks, []),
    siteSections: pluck(siteSections, []),
    pageSeo: pluck(pageSeo, []),
    media: pluck(media, []),
    siteSettings: pluck(siteSettings, []),
    sectionContent: (() => {
      const rows = pluck(sectionContent, []);
      const map: Record<string, any> = {};
      for (const row of rows) {
        if (row.section_key && row.content) {
          map[row.section_key] = row.content;
        }
      }
      return map;
    })(),
  };

  return {
    ...data,
    loading,
    error,
  };
}
