const express = require("express");
const router = express.Router();

const { login } = require("../controllers/auth.controller");
const { summary } = require("../controllers/analytics.controller");
const { listContact } = require("../controllers/contact.controller");
const { buildAdminRouter } = require("./resource.routes");

router.post("/login", login);
router.get("/analytics/summary", require("../middleware/auth").requireAuth, summary);
router.get("/contact", require("../middleware/auth").requireAuth, listContact);

// Bulk delete endpoint (available on all CRUD resources).
// NOTE: this must be registered BEFORE the per-resource router.use() mounts
// below. Express matches in registration order, and router.use("/education", ...)
// etc. match on path *prefix* - so DELETE /api/admin/education/bulk would have
// been swallowed by the "/education" sub-router (which would try to delete a
// row with id "bulk") and never reach this handler at all.
const RESOURCE_TABLE_MAP = {
  profile: "profile",
  education: "education",
  experience: "experience",
  skills: "skills",
  projects: "projects",
  "research-papers": "research_papers",
  certifications: "certifications",
  publications: "publications",
  seo: "seo_settings",
  "about-beats": "about_beats",
  "about-milestones": "about_milestones",
  "about-metrics": "about_metrics",
  awards: "awards",
  "capability-domains": "capability_domains",
  capabilities: "capabilities",
  "linkedin-feed": "linkedin_feed",
  "journal-articles": "journal_articles",
  "ecosystem-stats": "ecosystem_stats",
  "research-themes": "research_themes",
  "navigation-items": "navigation_items",
  "social-links": "social_links",
  "site-sections": "site_sections",
  "page-seo": "page_seo",
  media: "media",
  "site-settings": "site_settings",
};

router.delete("/:resource/bulk", require("../middleware/auth").requireAuth, async (req, res) => {
  try {
    const table = RESOURCE_TABLE_MAP[req.params.resource];
    if (!table) {
      return res.status(404).json({ success: false, message: `Unknown resource '${req.params.resource}'` });
    }
    const ids = req.query.ids?.split(",").filter(Boolean) || [];
    if (ids.length === 0) {
      return res.status(400).json({ success: false, message: "No ids provided" });
    }
    const supabase = require("../config/supabase");
    const { error } = await supabase.from(table).delete().in("id", ids);
    if (error) throw error;
    res.json({ success: true, deleted: ids.length });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Full CRUD for every CMS resource
router.use("/profile", buildAdminRouter("profile", { singleton: true }));
router.use("/education", buildAdminRouter("education"));
router.use("/experience", buildAdminRouter("experience"));
router.use("/skills", buildAdminRouter("skills"));
router.use("/projects", buildAdminRouter("projects"));
router.use("/research-papers", buildAdminRouter("research_papers"));
router.use("/certifications", buildAdminRouter("certifications"));
router.use("/publications", buildAdminRouter("publications"));
router.use("/seo", buildAdminRouter("seo_settings", { orderBy: "page_slug" }));

// New dynamic content endpoints (admin CRUD)
router.use("/about-beats", buildAdminRouter("about_beats"));
router.use("/about-milestones", buildAdminRouter("about_milestones"));
router.use("/about-metrics", buildAdminRouter("about_metrics"));
router.use("/awards", buildAdminRouter("awards"));
router.use("/capability-domains", buildAdminRouter("capability_domains"));
router.use("/capabilities", buildAdminRouter("capabilities"));
router.use("/linkedin-feed", buildAdminRouter("linkedin_feed", { singleton: true }));
router.use("/journal-articles", buildAdminRouter("journal_articles"));
router.use("/ecosystem-stats", buildAdminRouter("ecosystem_stats"));
router.use("/research-themes", buildAdminRouter("research_themes"));

// Full dynamic control endpoints (admin CRUD)
router.use("/navigation-items", buildAdminRouter("navigation_items"));
router.use("/social-links", buildAdminRouter("social_links"));
router.use("/site-sections", buildAdminRouter("site_sections"));
router.use("/page-seo", buildAdminRouter("page_seo"));
router.use("/media", buildAdminRouter("media"));
router.use("/site-settings", buildAdminRouter("site_settings"));

module.exports = router;
