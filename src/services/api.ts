const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API Error ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  // ==========================
  // PROFILE (includes all site-wide settings)
  // ==========================
  getProfile() {
    return this.request("/profile");
  }

  // ==========================
  // EDUCATION
  // ==========================
  getEducation() {
    return this.request("/education");
  }

  // ==========================
  // EXPERIENCE
  // ==========================
  getExperience() {
    return this.request("/experience");
  }

  // ==========================
  // PROJECTS
  // ==========================
  getProjects() {
    return this.request("/projects");
  }

  // ==========================
  // RESEARCH PAPERS
  // ==========================
  getResearchPapers() {
    return this.request("/research-papers");
  }

  // ==========================
  // PUBLICATIONS
  // ==========================
  getPublications() {
    return this.request("/publications");
  }

  // ==========================
  // CERTIFICATIONS
  // ==========================
  getCertifications() {
    return this.request("/certifications");
  }

  // ==========================
  // SEO
  // ==========================
  getSeo() {
    return this.request("/seo");
  }

  // ==========================
  // ABOUT CONTENT
  // ==========================
  getAboutBeats() {
    return this.request("/about-beats");
  }

  getAboutMilestones() {
    return this.request("/about-milestones");
  }

  getAboutMetrics() {
    return this.request("/about-metrics");
  }

  // ==========================
  // AWARDS
  // ==========================
  getAwards() {
    return this.request("/awards");
  }

  // ==========================
  // CAPABILITIES / ECOSYSTEM
  // ==========================
  getCapabilityDomains() {
    return this.request("/capability-domains");
  }

  getCapabilities() {
    return this.request("/capabilities");
  }

  getEcosystemStats() {
    return this.request("/ecosystem-stats");
  }

  // ==========================
  // LINKEDIN FEED
  // ==========================
  getLinkedInFeed() {
    return this.request("/linkedin-feed");
  }

  // ==========================
  // JOURNAL ARTICLES
  // ==========================
  getJournalArticles() {
    return this.request("/journal-articles");
  }

  // ==========================
  // RESEARCH THEMES
  // ==========================
  getResearchThemes() {
    return this.request("/research-themes");
  }

  // ==========================
  // NAVIGATION (dynamic)
  // ==========================
  getNavigationItems() {
    return this.request("/navigation-items");
  }

  // ==========================
  // SOCIAL LINKS (dynamic)
  // ==========================
  getSocialLinks() {
    return this.request("/social-links");
  }

  // ==========================
  // SITE SECTIONS (dynamic)
  // ==========================
  getSiteSections() {
    return this.request("/site-sections");
  }

  // ==========================
  // PAGE SEO (dynamic)
  // ==========================
  getPageSeo() {
    return this.request("/page-seo");
  }

  // ==========================
  // MEDIA (dynamic)
  // ==========================
  getMedia() {
    return this.request("/media");
  }

  // ==========================
  // SITE SETTINGS (dynamic)
  // ==========================
  getSiteSettings() {
    return this.request("/site-settings");
  }

  // ==========================
  // SECTION CONTENT (all hardcoded text via JSONB)
  // ==========================
  getSectionContent() {
    return this.request("/section-content");
  }
}

export default new ApiService();
