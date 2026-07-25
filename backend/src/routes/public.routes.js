const express = require("express");
const router = express.Router();

const { track } = require("../controllers/analytics.controller");
const { submitContact } = require("../controllers/contact.controller");
const { buildPublicRouter } = require("./resource.routes");

// Public read-only endpoints the website's frontend fetches
router.use("/profile", buildPublicRouter("profile", { singleton: true }));
router.use("/education", buildPublicRouter("education"));
router.use("/experience", buildPublicRouter("experience"));
router.use("/skills", buildPublicRouter("skills"));
router.use("/projects", buildPublicRouter("projects"));
router.use("/research-papers", buildPublicRouter("research_papers"));
router.use("/certifications", buildPublicRouter("certifications"));
router.use("/publications", buildPublicRouter("publications"));
router.use("/seo", buildPublicRouter("page_seo", { orderBy: "page_slug" }));

// New dynamic content endpoints
router.use("/about-beats", buildPublicRouter("about_beats"));
router.use("/about-milestones", buildPublicRouter("about_milestones"));
router.use("/about-metrics", buildPublicRouter("about_metrics"));
router.use("/awards", buildPublicRouter("awards"));
router.use("/capability-domains", buildPublicRouter("capability_domains"));
router.use("/capabilities", buildPublicRouter("capabilities"));
router.use("/linkedin-feed", buildPublicRouter("linkedin_feed", { singleton: true }));
router.use("/journal-articles", buildPublicRouter("journal_articles"));
router.use("/ecosystem-stats", buildPublicRouter("ecosystem_stats"));
router.use("/research-themes", buildPublicRouter("research_themes"));

// Full dynamic control endpoints
router.use("/navigation-items", buildPublicRouter("navigation_items", { orderBy: "sort_order" }));
router.use("/social-links", buildPublicRouter("social_links", { orderBy: "sort_order" }));
router.use("/site-sections", buildPublicRouter("site_sections", { orderBy: "sort_order" }));
router.use("/page-seo", buildPublicRouter("page_seo", { orderBy: "page_slug" }));
router.use("/media", buildPublicRouter("media", { orderBy: "created_at" }));
router.use("/site-settings", buildPublicRouter("site_settings", { orderBy: "key" }));

// Section content — single JSONB table for all hardcoded section text
router.use("/section-content", buildPublicRouter("section_content", { orderBy: "section_key" }));

router.post("/analytics/track", track);
router.post("/contact", submitContact);

module.exports = router;