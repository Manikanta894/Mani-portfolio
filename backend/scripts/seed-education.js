/**
 * Seed missing data: education, experience, projects, publications, certifications, research_papers
 *
 * Usage: node backend/scripts/seed-education.js
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

async function seed() {
  try {
    console.log("🌱 Seeding missing portfolio data...\n");

    // 1. EDUCATION
    const education = [
      {
        sort_order: 0,
        era: "2024 — Present",
        institution: "Nagarjuna Degree College",
        degree: "Master of Business Administration (MBA)",
        field: "HR & Business Analytics",
        status: "Current",
        start_date: "2024",
        end_date: "2027",
        grade: "Pursuing",
        location: "Bengaluru, India",
        description: "Specializing in Human Resources and Business Analytics with a focus on AI-driven workforce strategies, people analytics, and data-informed decision making.",
        highlights: [
          "MBA Research Assistant — supporting faculty research in HR analytics and organizational behavior",
          "Active participant in national academic seminars on AI, HR, and analytics",
          "Built predictive models for employee attrition and engagement as part of coursework"
        ],
        skills: ["HR Analytics", "People Analytics", "Statistical Analysis", "Organizational Behavior", "Research Methodology", "AI Strategy"],
      },
      {
        sort_order: 1,
        era: "2020 — 2024",
        institution: "Bangalore University",
        degree: "Bachelor of Business Management (BBM)",
        field: "Business Administration",
        status: "Completed",
        start_date: "2020",
        end_date: "2024",
        grade: "Graduated",
        location: "Bengaluru, India",
        description: "Foundation in business management with emphasis on data analysis, business strategy, and organizational frameworks.",
        highlights: [
          "Developed analytical frameworks for retail inventory optimization",
          "Completed projects in business strategy and financial modeling",
          "Active in inter-collegiate business competitions"
        ],
        skills: ["Business Strategy", "Financial Modeling", "Data Analysis", "Business Communication"],
      },
    ];
    const { error: edErr } = await supabase.from("education").insert(education);
    if (edErr) console.error("Education error:", edErr.message);
    console.log("✅ Education seeded");

    // 2. EXPERIENCE
    const experience = [
      {
        sort_order: 0,
        company: "Nagarjuna Degree College",
        role: "MBA Research Assistant",
        type: "Academic",
        location: "Bengaluru, India",
        start_date: "2024",
        end_date: "Present",
        current: true,
        description: "Supporting faculty research in HR analytics, organizational behavior, and algorithmic HRM.",
        highlights: [
          "Assisting in data collection and analysis for peer-reviewed research papers",
          "Co-authoring research on AI-driven HR frameworks",
          "Presenting findings at national academic seminars"
        ],
        skills: ["Research", "Data Analysis", "SPSS", "Academic Writing"],
      },
      {
        sort_order: 1,
        company: "Retail Sector",
        role: "Operations Associate",
        type: "Full-time",
        location: "Karnataka, India",
        start_date: "2019",
        end_date: "2024",
        current: false,
        description: "Gained practical experience in retail operations, inventory management, and customer analytics on the retail floor.",
        highlights: [
          "Managed daily inventory variance reviews and operational reporting",
          "Developed first Power BI dashboard for tracking sales performance",
          "Gained firsthand insight into how data shapes business outcomes"
        ],
        skills: ["Operations", "Inventory Management", "Power BI", "Customer Analytics"],
      },
    ];
    const { error: exErr } = await supabase.from("experience").insert(experience);
    if (exErr) console.error("Experience error:", exErr.message);
    console.log("✅ Experience seeded");

    // 3. PROJECTS
    const projects = [
      {
        sort_order: 0,
        title: "AI Adoption Playbook for Mid-Sized Organizations",
        tagline: "A strategic framework for sequencing AI pilots in enterprises",
        category: "AI Strategy",
        role: "Lead Researcher",
        status: "In Progress",
        year: "2025",
        description: "Developing a practical playbook for mid-sized organizations to adopt AI responsibly — covering pilot sequencing, governance, and ROI measurement.",
        highlights: [
          "Designed a 4-phase AI maturity model for HR functions",
          "Interviewed practitioners across 3 industries"
        ],
        tech: ["Claude", "Python", "Research Methodology"],
        featured: true,
      },
      {
        sort_order: 1,
        title: "Sony Ericsson — Revival Strategy",
        tagline: "A strategic case study on brand revival in competitive markets",
        category: "Business Strategy",
        role: "Strategy Analyst",
        status: "Completed",
        year: "2024",
        description: "A comprehensive strategic analysis of Sony Ericsson's market position with recommendations for brand revival.",
        highlights: [
          "Built financial models projecting 3-year growth scenarios",
          "1st Place — EDP Business Planning Competition"
        ],
        tech: ["Excel", "Power BI", "Strategic Frameworks"],
        featured: true,
      },
      {
        sort_order: 2,
        title: "Asian Paints — Demand Forecast Dashboard",
        tagline: "Power BI dashboard for sales forecasting and inventory planning",
        category: "Analytics",
        role: "Data Analyst",
        status: "Completed",
        year: "2024",
        description: "Built an interactive Power BI dashboard for forecasting demand and optimizing inventory for a paint manufacturing context.",
        highlights: [
          "Reduced forecast variance by 15% using moving average models",
          "Designed executive summary views for leadership reviews"
        ],
        tech: ["Power BI", "Excel", "SQL"],
        featured: true,
      },
    ];
    const { error: prErr } = await supabase.from("projects").insert(projects);
    if (prErr) console.error("Projects error:", prErr.message);
    console.log("✅ Projects seeded");

    // 4. PUBLICATIONS
    const publications = [
      {
        sort_order: 0,
        title: "From Algorithms to Judgment — Ethical AI in Workforce Systems",
        publisher: "SSRN",
        date: "2025",
        url: "https://papers.ssrn.com/",
        type: "Preprint",
        description: "A framework for embedding ethical guardrails into algorithmic HR decision systems.",
      },
      {
        sort_order: 1,
        title: "Green Algorithmic HRM — A Sustainability Framework",
        publisher: "National Academic Seminar",
        date: "2025",
        url: "",
        type: "Conference Paper",
        description: "Framework for embedding sustainability into algorithmic people-decision systems.",
      },
      {
        sort_order: 2,
        title: "HR Analytics — Transforming Workforce Decisions with Data",
        publisher: "IJIRT",
        date: "2024",
        url: "",
        type: "Journal Article",
        description: "Exploration of how HR analytics is transforming traditional workforce management.",
      },
    ];
    const { error: pubErr } = await supabase.from("publications").insert(publications);
    if (pubErr) console.error("Publications error:", pubErr.message);
    console.log("✅ Publications seeded");

    // 5. CERTIFICATIONS
    const certifications = [
      { sort_order: 0, title: "Microsoft Certified — Power BI Data Analyst (PL-300)", issuer: "Microsoft", date: "2024", url: "", credential_id: "", category: "Data & Analytics", verified: true },
      { sort_order: 1, title: "Google AI Essentials", issuer: "Google", date: "2024", url: "", credential_id: "", category: "AI & ML", verified: true },
      { sort_order: 2, title: "Microsoft — AI Fundamentals", issuer: "Microsoft", date: "2024", url: "", credential_id: "", category: "AI & ML", verified: true },
      { sort_order: 3, title: "McKinsey Forward Program", issuer: "McKinsey & Company", date: "2024", url: "", credential_id: "", category: "Business & Consulting", verified: true },
      { sort_order: 4, title: "BCG — Strategy Consulting Virtual Experience", issuer: "Boston Consulting Group", date: "2024", url: "", credential_id: "", category: "Business & Consulting", verified: true },
      { sort_order: 5, title: "Goldman Sachs — Engineering & Analytics Virtual Program", issuer: "Goldman Sachs", date: "2024", url: "", credential_id: "", category: "Data & Analytics", verified: true },
      { sort_order: 6, title: "Deloitte — Technology & Analytics", issuer: "Deloitte", date: "2024", url: "", credential_id: "", category: "Data & Analytics", verified: true },
      { sort_order: 7, title: "SEBI Investor Awareness Program", issuer: "SEBI", date: "2024", url: "", credential_id: "", category: "Finance", verified: true },
    ];
    const { error: certErr } = await supabase.from("certifications").insert(certifications);
    if (certErr) console.error("Certifications error:", certErr.message);
    console.log("✅ Certifications seeded");

    // 6. RESEARCH PAPERS
    const researchPapers = [
      {
        sort_order: 0, title: "From Algorithms to Judgment — Ethical AI Design in HR Systems", authors: "Manikanta R", journal: "SSRN",
        year: "2025", url: "https://papers.ssrn.com/", abstract: "A framework for embedding ethical guardrails into algorithmic HR decision systems.",
        keywords: ["Algorithmic HRM", "Ethical AI", "HR Analytics"], category: "AI in HR", featured: true,
      },
      {
        sort_order: 1, title: "Green Algorithmic HRM — Embedding Sustainability into People Analytics", authors: "Manikanta R", journal: "National Academic Seminar Proceedings",
        year: "2025", url: "", abstract: "Framework for embedding sustainability into algorithmic people-decision systems.",
        keywords: ["Green HRM", "Algorithmic HRM", "Sustainability"], category: "HR Analytics", featured: true,
      },
      {
        sort_order: 2, title: "HR Analytics — A Data-Driven Approach to Workforce Management", authors: "Manikanta R", journal: "IJIRT",
        year: "2024", url: "", abstract: "Examining how HR analytics is transforming workforce decisions through data-driven insights.",
        keywords: ["HR Analytics", "People Analytics", "Data-Driven"], category: "HR Analytics", featured: true,
      },
      {
        sort_order: 3, title: "Consumer Behaviour in the Digital Age — A Study of Online Buying Patterns", authors: "Manikanta R", journal: "IJIRT",
        year: "2022", url: "", abstract: "Analysis of changing consumer behavior patterns in e-commerce environments.",
        keywords: ["Consumer Behaviour", "E-commerce", "Digital"], category: "Consumer Behaviour", featured: false,
      },
    ];
    const { error: rpErr } = await supabase.from("research_papers").insert(researchPapers);
    if (rpErr) console.error("Research papers error:", rpErr.message);
    console.log("✅ Research papers seeded");

    // 7. SKILLS
    const skills = [
      { sort_order: 0, name: "HR Analytics", category: "Analytics", level: "Advanced" },
      { sort_order: 1, name: "Business Analytics", category: "Analytics", level: "Advanced" },
      { sort_order: 2, name: "People Analytics", category: "Analytics", level: "Intermediate" },
      { sort_order: 3, name: "Power BI", category: "Tools", level: "Expert" },
      { sort_order: 4, name: "Excel (Advanced)", category: "Tools", level: "Expert" },
      { sort_order: 5, name: "SQL", category: "Tools", level: "Intermediate" },
      { sort_order: 6, name: "Python", category: "Tools", level: "Intermediate" },
      { sort_order: 7, name: "SPSS", category: "Tools", level: "Intermediate" },
      { sort_order: 8, name: "AI Strategy", category: "Strategy", level: "Advanced" },
      { sort_order: 9, name: "Research Methodology", category: "Research", level: "Advanced" },
      { sort_order: 10, name: "Business Strategy", category: "Strategy", level: "Intermediate" },
      { sort_order: 11, name: "Machine Learning", category: "Technology", level: "Intermediate" },
    ];
    const { error: skErr } = await supabase.from("skills").insert(skills);
    if (skErr) console.error("Skills error:", skErr.message);
    console.log("✅ Skills seeded");

    console.log("\n🎉 All missing data seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();