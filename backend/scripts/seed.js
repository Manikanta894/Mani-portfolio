/**
 * Seed script — migrates hardcoded content from src/content/manikanta.ts
 * into Supabase tables so the portfolio becomes fully dynamic.
 *
 * Usage: node backend/scripts/seed.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ==============================
// DATA FROM manikanta.ts
// ==============================

const meta = {
  name: "Manikanta R",
  initials: "MR",
  role: "HR · Analytics · AI",
  location: "Bengaluru, India",
  status: "Available For Opportunities",
  tagline: "Building the Future of Work Through AI, Analytics & Human Insight",
  identity: "MBA · Researcher · Operator",
  cohort: "MBA · '27",
  focus: ["HR Analytics", "AI Strategy", "People Data"],
};

const marquee = [
  "AI in HR", "People Analytics", "Power BI", "Algorithmic HRM",
  "Workforce Strategy", "Business Analytics", "SSRN · IJIRT · Published", "Bengaluru, IN",
];

const about = {
  number: "01",
  kicker: "Origin / Position",
  title: "About",
  epigraph: "I didn't start with a plan. I started with curiosity about why businesses worked the way they did — and a notebook full of questions.",
  footnote: "signal over noise",
  tags: ["MBA Candidate", "Researcher", "Power BI", "AI Strategy", "Algorithmic HRM", "Bengaluru"],
};

const beyond = {
  number: "01.5",
  kicker: "Beyond Education & Work",
  title: "Who I am, when no one's looking",
  lede: "Resumes are a poor mirror. They show what I built; they hide why I keep showing up. So here is the quieter half.",
  pillars: [
    { label: "Curiosity", body: "I read because I refuse to stop being wrong. Most of what I now believe was learned, late, from people more careful than I was." },
    { label: "Discipline", body: "I treat focus as a craft, not a mood. Deep work, repeated daily, beats inspiration almost every time." },
    { label: "Mindset", body: "Systems over goals. Compounding over heroics. The boring thing — done for months — is usually the unfair advantage." },
    { label: "What excites me", body: "Problems where people, data and decisions collide. Where the right model still needs the right conversation." },
  ],
  values: [
    "Honest signal beats loud noise.",
    "Numbers without context are vandalism.",
    "Respect the operator — they know what the dashboard doesn't.",
    "Build for the team you'll have in three years.",
  ],
  future: "Over the next decade I want to help build the playbook for human-centered AI in organizations — research that operators can use on Monday, not just cite in October.",
};

const philosophy = {
  number: "11",
  title: "Personal Philosophy",
  quote: "I didn't start with a plan. I started with curiosity about why businesses worked the way they did — and a notebook full of questions. The analytics came later. The discipline came from necessity. The direction came from paying attention.",
  pillars: [
    { n: "01", name: "Self-Built", body: "Balanced full-time work alongside every academic and research milestone — no shortcuts, no inheritance of access." },
    { n: "02", name: "Disciplined", body: "Studied after shifts. Researched on weekends. Built the habit before the credentials caught up." },
    { n: "03", name: "Long-Term", body: "Building a five-year foundation, not chasing a quarter. Compounding over performing." },
  ],
};

const dispatch = {
  title: "The Dispatch",
  tagline: "A weekly note on AI, analytics & the architecture of the modern workforce.",
  body: "Field notes from the seam between people, process and prediction. No spam, no fluff — just signal. Unsubscribe in one click.",
  meta: ["500+ readers", "Weekly cadence", "Avg 4-min read"],
};

const footer = {
  blurb: "Building the future of work — one model, one paper, one decision at a time.",
  practice: "HR Analytics · AI Strategy · People Data",
  navigate: ["About", "Education", "Experience", "Awards", "Research", "Publications", "Projects", "Skills", "Certifications", "LinkedIn", "Blog", "Newsletter"],
  signature: "Built with intention · Bengaluru, IN",
  copyright: "© 2026 Manikanta R · manikantar.in",
};

const chapters = [
  { n: "00", label: "Cover", id: "cover" },
  { n: "01", label: "About", id: "about" },
  { n: "02", label: "Education", id: "education" },
  { n: "03", label: "Experience", id: "experience" },
  { n: "04", label: "Awards", id: "awards" },
  { n: "05", label: "Research", id: "research" },
  { n: "06", label: "Work", id: "work" },
  { n: "07", label: "Ecosystem", id: "ecosystem" },
  { n: "08", label: "Credentials", id: "credentials" },
  { n: "09", label: "LinkedIn", id: "linkedin" },
  { n: "10", label: "Journal", id: "journal" },
  { n: "11", label: "Philosophy", id: "philosophy" },
];

const contactInfo = {
  number: "12",
  kicker: "Let's build",
  title: "Contact",
  prompt: "Tell me what you're building.",
  intro: "// start the conversation",
  fields: [
    { name: "name", label: "Name", placeholder: "Your full name" },
    { name: "email", label: "Email", placeholder: "you@company.com" },
    { name: "subject", label: "Subject", placeholder: "Role · Project · Research collaboration" },
    { name: "message", label: "Message", placeholder: "What's the context, the question, the outcome?" },
  ],
  cta: "Send Message",
  status: "Open to Opportunities",
  practice: "HR Analytics · People Analytics · Workforce Strategy · Consulting · Business Intelligence",
  availability: "Currently based in Bengaluru. Available for full-time roles, research collaborations and consulting engagements.",
  channels: [
    { label: "LinkedIn", value: "/in/manikanta894", href: "https://linkedin.com/in/manikanta894" },
    { label: "Email", value: "hello@manikantar.in", href: "mailto:hello@manikantar.in" },
    { label: "X / Twitter", value: "@ishaan___04", href: "https://x.com/ishaan___04" },
    { label: "Instagram", value: "@mani___894", href: "https://instagram.com/mani___894" },
  ],
  response: "average response time · < 48h",
};

// ==============================
// SEED FUNCTION
// ==============================
async function seed() {
  try {
    console.log("🌱 Seeding portfolio data...\n");

    // 1. Upsert profile
    const { error: profileErr } = await supabase.from("profile").upsert({
      name: meta.name,
      initials: meta.initials,
      role: meta.role,
      location: meta.location,
      status: meta.status,
      tagline: meta.tagline,
      identity: meta.identity,
      cohort: meta.cohort,
      focus: meta.focus,
      site_title: "Manikanta R — HR Analytics · AI Strategy · People Data",
      site_description: "Manikanta R · MBA candidate in HR & Business Analytics, Bengaluru. Four published papers across IJIRT and SSRN. Building the future of work through AI, analytics and human insight.",
      site_keywords: "Manikanta R, HR Analytics, Business Analytics, AI Strategy, People Analytics, MBA, Bengaluru",
      og_image: "https://manikantar.in/og-image.jpg",
      welcome_text: "Welcome to my Portfolio.",
      tagline: "Building the future of work through AI, analytics & human insight.",
      resume_url: "https://manikantar.in/resume.pdf",
      availability_status: "Available for collaborations",
      blurb: footer.blurb,
      copyright: footer.copyright,
      signature: footer.signature,
      hero_skills: ["HR Analytics", "Business Analytics", "AI Strategy", "Research", "Power BI", "People Analytics"],
      hero_meta: [
        { label: "Published Papers", value: "04", type: "text" },
        { label: "MBA", value: "MBA · '27", sub: "HR & Business Analytics", type: "cohort" },
        { label: "Availability", value: "Available", sub: "for collaborations", type: "status" },
      ],
      ctas: [
        { label: "Explore Journey", href: "#about", type: "primary" },
        { label: "Let's Connect", href: "#contact", type: "ghost" },
        { label: "Download Resume", href: "https://manikantar.in/resume.pdf", type: "ghost", download: true },
      ],
      about_epigraph: about.epigraph,
      about_footnote: about.footnote,
      about_tags: about.tags,
      beyond: beyond,
      philosophy: philosophy,
      dispatch: dispatch,
      contact_info: contactInfo,
      footer_nav: footer.navigate,
      marquee_items: marquee,
      chapter_nav: chapters,
    });
    if (profileErr) console.error("Profile error:", profileErr.message);
    else console.log("✅ Profile seeded");

    // 2. About Beats
    const beats = [
      { sort_order: 0, no: "I", era: "Childhood · Karnataka", title: "The Beginning", lede: "Curiosity came before language for the work.", body: "I didn't start with a plan. I started with a notebook full of questions about why businesses worked the way they did — and a slow, stubborn refusal to take answers at face value. Long before I knew what 'analytics' meant, I was already collecting patterns: which shops on the street were busy at which hour, which neighbours bartered, which conversations changed someone's mind.", pull: "I collected questions the way other kids collected stickers." },
      { sort_order: 1, no: "II", era: "2019 — 2024 · The retail floor & the first dataset", title: "The Turning Point", lede: "Where curiosity met evidence.", body: "The discipline came from necessity. On the retail floor, every inventory call and customer interaction quietly revealed how data shapes business outcomes — and how often the dashboard disagreed with the operator who actually knew the truth. I started reading research papers between shifts. The first Power BI report I built was ugly and life-changing: it made an argument I couldn't make with words. Analytics stopped being a subject. It became a language.", pull: "The first chart that proved me wrong became the most honest mentor I ever had." },
      { sort_order: 2, no: "III", era: "2025 — Now · Bengaluru", title: "Today", lede: "At the seam between people, process and prediction.", body: "Today I'm an MBA candidate in HR & Business Analytics at Nagarjuna Degree College, Bengaluru — four published research papers across IJIRT and SSRN, ten+ certifications across Deloitte, Goldman Sachs, Google AI and Microsoft, and a working practice that lives at the seam between people, process and prediction. I build for the operator first and the deck second. Signal over noise. Numbers with context. Models that survive a Monday morning." },
      { sort_order: 3, no: "IV", era: "2026 → 2036 · The horizon", title: "The Future", lede: "A decade-long bet on human-centered AI.", body: "Over the next decade I want to help write the playbook for human-centered AI inside organizations — research that operators can use on Monday, not just cite in October. Systems that respect the team you'll have in three years, not only the one you have today. If the last decade taught machines to learn, the next one will be about teaching organizations to listen.", pull: "Build for the team you'll have in three years." },
    ];
    for (const beat of beats) {
      const { error } = await supabase.from("about_beats").upsert(beat, { onConflict: "sort_order" });
      if (error) console.error("Beat error:", error.message);
    }
    console.log("✅ About beats seeded");

    // 3. About Milestones
    const milestones = ["Curiosity", "Learning", "Research", "Analytics", "Innovation", "Impact"];
    for (let i = 0; i < milestones.length; i++) {
      const { error } = await supabase.from("about_milestones").upsert({ sort_order: i, label: milestones[i] }, { onConflict: "sort_order" });
      if (error) console.error("Milestone error:", error.message);
    }
    console.log("✅ About milestones seeded");

    // 4. About Metrics
    const metrics = [
      { sort_order: 0, label: "Research Papers", value: 4, suffix: "", target_anchor: "research" },
      { sort_order: 1, label: "Certifications", value: 10, suffix: "+", target_anchor: "credentials" },
      { sort_order: 2, label: "Projects", value: 12, suffix: "+", target_anchor: "work" },
      { sort_order: 3, label: "Publications", value: 2, suffix: "", target_anchor: "research" },
    ];
    for (const m of metrics) {
      const { error } = await supabase.from("about_metrics").upsert(m, { onConflict: "sort_order" });
      if (error) console.error("Metric error:", error.message);
    }
    console.log("✅ About metrics seeded");

    // 5. Awards
    const awardsEntries = [
      { sort_order: 0, year: "2024", highlight: true, kind: "Award", title: "1st Place — EDP Business Planning Competition", org: "Entrepreneurship Development Programme", category: "Strategy · Entrepreneurship", location: "Bengaluru, IN", verified: true, body: "Winning team for an end-to-end business plan — strategy, financials and go-to-market.", story: "Three weeks. Five strangers. One business idea that had to survive a faculty jury. We won by treating the financials as a story, not a spreadsheet — and by rehearsing the Q&A more than the pitch itself.", why: "It was the first time I saw a room shift opinion because of how we framed a single unit-economics chart. Strategy is choreography.", skills: ["Business Strategy", "Financial Modeling", "Pitch Design", "Team Leadership"], related: { research: [], projects: ["Sony Ericsson — Revival Strategy"], experience: [] } },
      { sort_order: 1, year: "2026", highlight: true, kind: "Conference", title: "Selected Presenter — MEC 2026 International Academic Conference", org: "Peer-reviewed international track", category: "AI · HR · Ethics", location: "International (Hybrid)", verified: true, body: "Presenting work on algorithmic HRM and ethical AI design in workforce systems.", story: "Submitted a paper expecting a polite rejection. The acceptance landed at 2am — a peer-reviewed slot to argue that algorithmic HR systems need ethical guardrails before accuracy benchmarks.", why: "A signal that the questions I've been chasing in the margins are part of a real, international conversation.", skills: ["Academic Writing", "Algorithmic HRM", "Ethical AI", "Public Speaking"], related: { research: ["From Algorithms to Judgment", "Green Algorithmic HRM"], projects: [], experience: [] } },
      { sort_order: 2, year: "2025", highlight: false, kind: "Presentation", title: "'Green Algorithmic HRM' — National Academic Seminar", org: "National Academic Seminar", category: "Sustainability · HR", location: "Karnataka, IN", verified: true, body: "Framework for embedding sustainability into algorithmic people-decision systems.", story: "A 20-minute slot to introduce a phrase nobody in the room had heard before. The Q&A ran 35 minutes. The framework now sits in two follow-up papers.", why: "Proof that new vocabulary, well-defined, can move a conversation faster than new data.", skills: ["Research Communication", "Sustainability", "Framework Design"], related: { research: ["Green Algorithmic HRM"], projects: [], experience: [] } },
      { sort_order: 3, year: "2024", highlight: false, kind: "Competition", title: "NFLQ — National Finance & Leadership Quiz", org: "National stage participant", category: "Finance · Leadership", location: "National, IN", verified: true, body: "Multi-round quiz on finance, leadership and contemporary business strategy.", story: "Three rounds, four cities of competitors, one bus journey of revision. We didn't take the trophy — we took an unreasonable amount of confidence in capital-markets trivia.", why: "Reminded me that range — across finance, strategy, leadership — matters as much as depth.", skills: ["Capital Markets", "Quick Recall", "Team Strategy"], related: { research: [], projects: [], experience: [] } },
      { sort_order: 4, year: "2024", highlight: false, kind: "Program", title: "SEBI Investor Awareness Program — Graduate", org: "Securities & Exchange Board of India", category: "Finance · Regulation", location: "India", verified: true, body: "Certified completion of SEBI's investor literacy and capital markets program.", story: "A regulator-issued curriculum on market integrity, retail-investor protection and the mechanics of fair markets. Quiet, dense, and clarifying.", why: "Anchored my financial literacy in regulation, not just instruments.", skills: ["Capital Markets", "Investor Protection", "Regulatory Literacy"], related: { research: [], projects: [], experience: [] } },
      { sort_order: 5, year: "2024", highlight: false, kind: "Seminar", title: "National Seminar Participation — Multi-institution Academic Events", org: "Cross-institution academic circuit", category: "HR · AI · Analytics", location: "Multi-city, IN", verified: true, body: "Active participation across multiple academic seminars on HR, AI and analytics.", story: "A season of seminars — sometimes presenting, often listening. The hallway conversations between sessions became the real syllabus.", why: "Built the muscle of being in the room before being on the stage.", skills: ["Academic Networking", "Critical Listening", "Research Discourse"], related: { research: [], projects: [], experience: [] } },
    ];
    for (const a of awardsEntries) {
      const { error } = await supabase.from("awards").upsert(a, { onConflict: "sort_order" });
      if (error) console.error("Award error:", error.message);
    }
    console.log("✅ Awards seeded");

    // 6. Capability Domains
    const domains = [
      { id: "Analytics", label: "Analytics", accent: "#E0533D", angle: -90, sort_order: 0 },
      { id: "Artificial Intelligence", label: "AI & ML", accent: "#7C5CFF", angle: -45, sort_order: 1 },
      { id: "People & HR", label: "People & HR", accent: "#3DA9FC", angle: 0, sort_order: 2 },
      { id: "Business", label: "Business", accent: "#F2B33D", angle: 45, sort_order: 3 },
      { id: "Leadership", label: "Leadership", accent: "#E0533D", angle: 90, sort_order: 4 },
      { id: "Research", label: "Research", accent: "#7C5CFF", angle: 135, sort_order: 5 },
      { id: "Technology", label: "Technology", accent: "#3DA9FC", angle: 180, sort_order: 6 },
      { id: "Visualization", label: "Visualization", accent: "#F2B33D", angle: 225, sort_order: 7 },
    ];
    for (const d of domains) {
      const { error } = await supabase.from("capability_domains").upsert(d);
      if (error) console.error("Domain error:", error.message);
    }
    console.log("✅ Capability domains seeded");

    // 7. Ecosystem Stats
    const ecosystemStats = [
      { sort_order: 0, label: "Capabilities", value: 33, hint: "tracked" },
      { sort_order: 1, label: "Domains", value: 8, hint: "interconnected" },
      { sort_order: 2, label: "Research Papers", value: 10, hint: "IJIRT · SSRN" },
      { sort_order: 3, label: "Certifications", value: 14, hint: "verified" },
      { sort_order: 4, label: "Projects", value: 12, hint: "in portfolio" },
      { sort_order: 5, label: "Years of Practice", value: 5, hint: "and counting" },
      { sort_order: 6, label: "Learning Hours", value: 420, hint: "logged" },
      { sort_order: 7, label: "Tools in Rotation", value: 26, hint: "actively used" },
    ];
    for (const s of ecosystemStats) {
      const { error } = await supabase.from("ecosystem_stats").upsert(s, { onConflict: "sort_order" });
      if (error) console.error("Ecosystem stat error:", error.message);
    }
    console.log("✅ Ecosystem stats seeded");

    // 8. Research themes
    const researchThemes = [
      { year: "2022", theme: "Consumer Behaviour", section: "research", sort_order: 0 },
      { year: "2023", theme: "Retail Analytics", section: "research", sort_order: 1 },
      { year: "2024", theme: "HR Analytics", section: "research", sort_order: 2 },
      { year: "2024", theme: "Business Analytics", section: "research", sort_order: 3 },
      { year: "2025", theme: "AI Strategy", section: "research", sort_order: 4 },
      { year: "2026", theme: "Future of Work", section: "research", sort_order: 5 },
    ];
    for (const t of researchThemes) {
      const { error } = await supabase.from("research_themes").upsert(t, { onConflict: "sort_order" });
      if (error) console.error("Research theme error:", error.message);
    }
    console.log("✅ Research themes seeded");

    // 9. Journal articles
    const journalArticles = [
      { title: "Why People Analytics is About to Eat HR", excerpt: "A field note from inside an MBA in HR & Business Analytics. The old playbook — surveys, exit interviews, gut feel — is being quietly replaced by continuous data signal.", category: "AI in HR", date: "Dec 02, 2025", reading_time: "8 min read", url: "https://blog.manikantar.in", featured: true, sort_order: 0 },
      { title: "Power BI is the Editorial Interface of the Modern Org", excerpt: "Dashboards aren't reports — they're editorial decisions about what the company should look at this week.", category: "Analytics", date: "Nov 24, 2025", reading_time: "6 min", url: "https://blog.manikantar.in", featured: true, sort_order: 1 },
      { title: "What I learned from 3 years on the retail floor", excerpt: "The most useful HR framework I've ever used wasn't from a textbook. It was a daily inventory variance review.", category: "Future of Work", date: "Nov 11, 2025", reading_time: "7 min", url: "https://blog.manikantar.in", featured: true, sort_order: 2 },
      { title: "Algorithmic HRM — A Field Guide", excerpt: "If you're a CHRO in 2026, you are also a model owner. Here's the vocabulary you cannot afford to skip.", category: "AI in HR", date: "Oct 30, 2025", reading_time: "11 min", url: "https://blog.manikantar.in", featured: true, sort_order: 3 },
      { title: "The MBA I'm Building, Not the One I'm Enrolled In", excerpt: "An honest log of the parallel curriculum — papers, certifications, projects — running alongside the formal degree.", category: "MBA Journey", date: "Oct 14, 2025", reading_time: "5 min", url: "https://blog.manikantar.in", featured: true, sort_order: 4 },
      { title: "Leadership is a Distribution, Not a Title", excerpt: "Notes on why the next generation of managers will be measured on the agency they create, not the headcount they hold.", category: "Leadership", date: "Sep 28, 2025", reading_time: "6 min", url: "https://blog.manikantar.in", featured: true, sort_order: 5 },
    ];
    for (const a of journalArticles) {
      const { error } = await supabase.from("journal_articles").upsert(a, { onConflict: "sort_order" });
      if (error) console.error("Journal error:", error.message);
    }
    console.log("✅ Journal articles seeded");

    // 10. LinkedIn Feed
    const { error: liErr } = await supabase.from("linkedin_feed").upsert({
      id: "00000000-0000-0000-0000-000000000001",
      profile_name: "Manikanta R",
      profile_headline: "MBA Candidate · HR & Business Analytics · Researcher in Algorithmic HRM",
      profile_company: "Nagarjuna Degree College — MBA Program",
      profile_location: "Bengaluru, India",
      profile_url: "https://www.linkedin.com/in/manikanta894/",
      profile_verified: true,
      followers: 302,
      connections: 282,
      impressions: 22488,
      members_reached: 12163,
      engagements: 986,
      top_post_reach: 14000,
      featured: {
        urn: "urn:li:share:7423180229197656064",
        url: "https://www.linkedin.com/feed/update/urn:li:share:7423180229197656064/",
        title: "The post that became my most read piece on LinkedIn",
        excerpt: "Notes on how AI is quietly rewriting the people-decisions stack — and why analytics leaders need to engage with it before policy does.",
        publishedAt: "2024-10-12T09:00:00.000Z",
        cover: null,
        metrics: { impressions: 14000, likes: 412, comments: 64, reposts: 28, engagements: 504 },
      },
      editors_pick: {
        urn: "urn:li:share:7461442770088538112",
        url: "https://www.linkedin.com/feed/update/urn:li:share:7461442770088538112/",
        title: "Editor's pick — Algorithmic HRM, in plain English",
        excerpt: "A short field note on how I think about algorithmic fairness when the algorithm is the manager.",
        publishedAt: "2025-02-04T09:00:00.000Z",
        cover: null,
        metrics: { impressions: 4800, likes: 168, comments: 22, reposts: 9, engagements: 199 },
      },
      latest: [],
    });
    if (liErr) console.error("LinkedIn feed error:", liErr.message);
    else console.log("✅ LinkedIn feed seeded");

    // 11. Capabilities
    const capabilities = [
      { id: "business-analytics", name: "Business Analytics", domain: "Analytics", stage: "Applying", overview: "Translating ambiguous business questions into decision-grade analysis — pricing, growth, retention, ops.", tools: ["Excel", "Power BI", "SQL"], projects: ["Asian Paints Forecast", "Sony Ericsson Revival"], papers: ["IJIRT · Analytics in HR"], certifications: ["McKinsey Forward", "BCG Strategy"], related: ["people-analytics", "decision-science"] },
      { id: "hr-analytics", name: "HR Analytics", domain: "Analytics", stage: "Researching", overview: "Measuring the workforce — engagement, attrition, talent flow — with statistical rigor.", tools: ["SPSS", "Excel", "Power BI"], papers: ["IJIRT · HR Analytics", "SSRN · Workforce Data"], experience: ["MBA Research Assistant"], related: ["people-analytics", "research-methodology"] },
      { id: "people-analytics", name: "People Analytics", domain: "Analytics", stage: "Researching", overview: "Behavioral signal at scale — listening, sensing and modeling the human side of organizations.", tools: ["Python", "Power BI"], papers: ["SSRN · People Data"], related: ["hr-analytics", "organizational-behavior"] },
      { id: "decision-science", name: "Decision Science", domain: "Analytics", stage: "Applying", overview: "Frameworks for decisions under uncertainty — MECE, expected value, bias mitigation.", certifications: ["McKinsey Forward"], related: ["business-strategy"] },
      { id: "ai-strategy", name: "AI Strategy", domain: "Artificial Intelligence", stage: "Applying", overview: "Where AI belongs in the business — and where it doesn't. Sequencing pilots, governance, ROI.", projects: ["AI Adoption Playbook"], certifications: ["Microsoft AI", "Google AI Essentials"], related: ["machine-learning", "prompt-engineering"] },
      { id: "machine-learning", name: "Machine Learning", domain: "Artificial Intelligence", stage: "Practicing", overview: "Supervised/unsupervised models for HR + business contexts — classification, clustering, forecasting.", tools: ["Python", "scikit-learn"], related: ["ai-strategy", "python"] },
      { id: "generative-ai", name: "Generative AI", domain: "Artificial Intelligence", stage: "Applying", overview: "LLM-native workflows — research, drafting, analysis assistants embedded into knowledge work.", tools: ["GPT", "Claude", "Gemini"], articles: ["Journal · AI in HR"], related: ["prompt-engineering"] },
      { id: "prompt-engineering", name: "Prompt Engineering", domain: "Artificial Intelligence", stage: "Teaching", overview: "Designing reliable prompts and agent loops for production-grade knowledge work.", related: ["generative-ai"] },
      { id: "talent-management", name: "Talent Management", domain: "People & HR", stage: "Applying", overview: "Sourcing, growing and retaining talent — from hire to high-performance.", experience: ["MBA · HR Lead"], related: ["organizational-behavior", "leadership"] },
      { id: "organizational-behavior", name: "Organizational Behavior", domain: "People & HR", stage: "Researching", overview: "How structure, culture and incentives shape behavior — and what data reveals about it.", papers: ["IJIRT · OB Study"], related: ["hr-analytics", "leadership"] },
      { id: "employee-experience", name: "Employee Experience", domain: "People & HR", stage: "Applying", overview: "Designing the full lifecycle from a human point of view, measured continuously.", related: ["people-analytics"] },
      { id: "digital-hr", name: "Digital HR", domain: "People & HR", stage: "Applying", overview: "Bringing AI, analytics and modern tooling into the HR function.", tools: ["SAP SuccessFactors", "Workday"], related: ["ai-strategy", "hr-analytics"] },
      { id: "business-strategy", name: "Business Strategy", domain: "Business", stage: "Applying", overview: "From signal to bet — market, positioning, moves and trade-offs.", certifications: ["BCG Strategy", "McKinsey Forward"], projects: ["Sony Ericsson Revival"], related: ["decision-science"] },
      { id: "digital-transformation", name: "Digital Transformation", domain: "Business", stage: "Practicing", overview: "Re-platforming the operating model — process, data and AI woven together.", related: ["ai-strategy", "digital-hr"] },
      { id: "consulting", name: "Consulting Craft", domain: "Business", stage: "Applying", overview: "Storylines, pyramid principle, exec-ready decks and clean recommendations.", certifications: ["McKinsey Forward", "BCG Strategy"], related: ["communication"] },
      { id: "project-management", name: "Project Management", domain: "Business", stage: "Practicing", overview: "Scoping, sequencing and shipping — keeping cross-functional work on rails.", related: ["leadership"] },
      { id: "leadership", name: "Leadership", domain: "Leadership", stage: "Practicing", overview: "Setting direction, building trust, raising the level of the people around me.", experience: ["MBA · HR Lead"], related: ["communication"] },
      { id: "communication", name: "Communication", domain: "Leadership", stage: "Teaching", overview: "Writing, presenting and explaining — turning complexity into clarity.", articles: ["Journal · Notes on writing"], related: ["presentation"] },
      { id: "presentation", name: "Presentation", domain: "Leadership", stage: "Applying", overview: "Designing decks and talks that hold a room and survive scrutiny.", related: ["communication"] },
      { id: "critical-thinking", name: "Critical Thinking", domain: "Leadership", stage: "Applying", overview: "Asking the second question — pressure-testing assumptions before action.", related: ["decision-science"] },
      { id: "research-methodology", name: "Research Methodology", domain: "Research", stage: "Researching", overview: "Designing studies, instruments and analyses with publishable rigor.", papers: ["IJIRT · Methodology", "SSRN · People Data"], related: ["statistical-analysis"] },
      { id: "statistical-analysis", name: "Statistical Analysis", domain: "Research", stage: "Applying", overview: "Hypothesis testing, regressions and modeling — the engine of credible claims.", tools: ["SPSS", "Python", "Excel"], related: ["research-methodology"] },
      { id: "academic-writing", name: "Academic Writing", domain: "Research", stage: "Applying", overview: "Peer-review-ready prose: clean abstracts, sharp methods, defensible findings.", papers: ["IJIRT · HR Analytics"], related: ["research-methodology"] },
      { id: "python", name: "Python", domain: "Technology", stage: "Practicing", overview: "Data work, automation and ML — pandas, scikit-learn, light scripting.", related: ["machine-learning", "statistical-analysis"] },
      { id: "sql", name: "SQL", domain: "Technology", stage: "Applying", overview: "Joins, windows, CTEs — getting at the truth in any warehouse.", related: ["business-analytics"] },
      { id: "excel", name: "Excel (Advanced)", domain: "Technology", stage: "Teaching", overview: "Modeling, what-if, dashboards — still the fastest analytical surface there is.", related: ["business-analytics"] },
      { id: "sap", name: "SAP", domain: "Technology", stage: "Practicing", overview: "ERP fluency for HR + finance integration touchpoints.", related: ["digital-hr"] },
      { id: "power-bi", name: "Power BI", domain: "Visualization", stage: "Teaching", overview: "From data model to executive dashboard — measured, signed off, used.", projects: ["Asian Paints Forecast"], certifications: ["Microsoft PL-300"], related: ["data-storytelling"] },
      { id: "tableau", name: "Tableau", domain: "Visualization", stage: "Applying", overview: "Exploratory + explanatory viz — calculated fields, parameters, story points.", related: ["data-storytelling"] },
      { id: "data-storytelling", name: "Data Storytelling", domain: "Visualization", stage: "Teaching", overview: "The chart is not the point — the decision is. Narrative-first analytics.", articles: ["Journal · Charts that decide"], related: ["communication", "power-bi"] },
      { id: "design-thinking", name: "Design Thinking", domain: "Visualization", stage: "Applying", overview: "Empathy → prototype → test. Especially for internal tooling and HR products.", related: ["employee-experience"] },
    ];
    for (const c of capabilities) {
      const { error } = await supabase.from("capabilities").upsert(c);
      if (error) console.error("Capability error:", error.message);
    }
    console.log("✅ Capabilities seeded");

    console.log("\n🎉 Seeding complete!");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();