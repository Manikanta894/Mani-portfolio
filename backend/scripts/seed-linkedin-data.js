/**
 * Seed LinkedIn-matched data into Supabase
 * Usage: node backend/scripts/seed-linkedin-data.js
 */
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://frkwetlvotoqlwazejrp.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZya3dldGx2b3RvcWx3YXplanJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgyNTU2OSwiZXhwIjoyMTAwNDAxNTY5fQ.e8HCcBOPY6XTmjnXwiWtxgZG3OvX3Ub2knSsrVtNte4";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function seed() {
  // === EDUCATION ===
  const education = [
    { sort_order: 0, degree: "Master of Business Administration (MBA), Business Analytics & Finance", school: "Nagarjuna Degree College", span: "Aug 2025 \u2013 Dec 2027", state: "Current", points: [
      "Pursuing an MBA with specialization in Business Analytics and Finance, focusing on applying analytical tools to real business problems. Actively engaged in research-oriented projects, case studies, and data-driven decision-making to build a strong foundation for analytics and future academic research.",
      "Activities: Research-based academic projects; Case study analysis and business simulations; Data analysis practice using Excel, SQL, and Power BI; Participation in seminars and academic discussions"
    ]},
    { sort_order: 1, degree: "Bachelor of Business Administration (BBA), Business Administration and Management, General", school: "Government First Grade College, Govt. Middle School Annex, Near NES Office, Yelahanka, Bangalore - 560064", span: "Sep 2023 \u2013 Sep 2025", state: "Completed", grade: "A", points: [
      "Completed undergraduate studies in Business Administration with exposure to core management domains. Developed analytical thinking through case studies and projects, secured 1st place in EDP for innovative business planning, and balanced academics alongside professional work experience.",
      "Activities: Entrepreneurship Development Program (EDP); Case studies and business plan presentations; Academic seminars and group projects; Peer mentoring and academic support"
    ]},
    { sort_order: 2, degree: "Pre-University Course, Statistics, Accounts, Business, and Economics", school: "Govt Pre-university College", span: "Mar 2022 \u2013 Apr 2023", state: "Completed", grade: "B+", points: [
      "Studied commerce subjects including Accountancy, Economics, Business Studies, and Statistics, building a strong foundation in quantitative reasoning, business concepts, and analytical thinking.",
      "Activities: Commerce-related seminars and discussions; Group assignments and academic events; Peer assistance in accounts and economics"
    ]},
    { sort_order: 3, degree: "Secondary School Leaving Certificate, General", school: "Sri Vinayaka Vidya Kendra", span: "Mar 2019 \u2013 May 2020", state: "Completed", grade: "A", points: [
      "Completed secondary education with strong academic performance. Recognized for discipline, teamwork, and all-round participation, laying the foundation for leadership and responsibility.",
      "Activities: Participation in school events and cultural programs; Volunteering and team-based activities"
    ]},
  ];
  for (const e of education) {
    const { error } = await supabase.from("education").upsert(e, { onConflict: "sort_order" });
    if (error) console.error("Edu error:", error.message); else console.log("✅ Education:", e.degree.substring(0, 50));
  }

  // === EXPERIENCE ===
  const experience = [
    { sort_order: 0, role: "Senior Customer Service Advisor", company: "Fizzy Goblet", city: "Bangalore Urban, Karnataka, India", span: "Mar 2024 \u2013 Present (2 yrs 5 mos)", context: "On-site", achievements: [
      "Managed store-level operations, ensuring compliance with SOPs and effective inventory control in a premium retail environment.",
      "Promoted from Stock Associate to Senior Customer Service Advisor due to exceptional performance and product expertise.",
      "Prepared comprehensive sales and stock reports to facilitate data-driven decision-making.",
      "Collaborated with logistics to guarantee accurate order fulfillment and timely deliveries."
    ]},
    { sort_order: 1, role: "Store In-Charge \u2013 FMCG", company: "RCM", city: "Bengaluru, Karnataka, India", span: "Jun 2022 \u2013 Jan 2024 (1 yr 8 mos)", context: "Part-time", achievements: [
      "Led day-to-day store operations including inventory management, billing, POS handling, and stock audits.",
      "Implemented WhatsApp Business as a digital sales channel, contributing to improved customer reach and order volume.",
      "Maintained accurate sales, billing, and stock reports for management review and audit purposes.",
      "Coordinated online order processing and last-mile delivery to ensure timely and accurate fulfillment.",
      "Supervised and guided junior staff while ensuring compliance with operational SOPs."
    ]},
  ];
  for (const e of experience) {
    const { error } = await supabase.from("experience").upsert(e, { onConflict: "sort_order" });
    if (error) console.error("Exp error:", error.message); else console.log("✅ Experience:", e.role);
  }

  // === RESEARCH PAPERS ===
  const papers = [
    { sort_order: 0, year: 2026, title: "The Rapid Rise of Quick Commerce and Its Impact on Worker Pressure and Operational Efficiency in Bengaluru", journal: "SSRN (Elsevier)", status: "Published", abstract: "This research examines the rapid expansion of quick commerce (q-commerce) in Bengaluru and its impact on operational efficiency, workforce pressure, and employee well-being. The study analyzes delivery timelines, dark store operations, employee burnout, and hyperlocal logistics systems used by platforms such as Zepto, Blinkit, and Swiggy Instamart. The findings highlight the need for balancing ultra-fast delivery performance with sustainable workforce management and long-term operational sustainability in India\u2019s evolving gig economy.", url: "https://ssrn.com/", featured: true, doi: "", ssrn_url: "", pdf_url: "" },
    { sort_order: 1, year: 2026, title: "One Vote Matters: A Case Study on Political Awareness and Youth Voting Behaviour in Tamil Nadu", journal: "SSRN Electronic Journal | Elsevier", status: "Published", abstract: "This research study examines political awareness and youth voting behaviour in Tamil Nadu, focusing on factors influencing electoral participation among young voters. The paper explores the role of social media, education, political engagement, and awareness campaigns in shaping democratic participation and voting decisions. The study highlights the importance of youth involvement in strengthening democratic systems and provides insights into evolving political attitudes among the younger generation.", url: "https://ssrn.com/", featured: true, doi: "", ssrn_url: "", pdf_url: "" },
    { sort_order: 2, year: 2026, title: "From Representation to Influence: A Descriptive Study on Women\u2019s Participation in Strategic Decision-Making and Organizational Effectiveness", journal: "Advanced International Journal for Research", status: "Published", abstract: "This research paper examines the role of women in strategic decision-making processes and their contribution to organizational effectiveness. The study explores leadership participation, gender diversity, workplace inclusion, and the impact of women\u2019s involvement in managerial and strategic roles. The paper highlights how inclusive leadership practices can improve organizational performance, innovation, and long-term sustainability in modern workplaces.", url: "", featured: true, doi: "", ssrn_url: "", pdf_url: "" },
    { sort_order: 3, year: 2026, title: "From Algorithms to Judgment: How AI Assisted HR Decisions Are Reshaping Trust, Fairness, and Human Agency at Work", journal: "IJIRT", status: "Published", abstract: "This research paper examines how Artificial Intelligence-assisted HR systems are transforming organizational decision-making processes and influencing employee trust, fairness, and human agency in modern workplaces. The study explores the interaction between algorithmic recommendations and human judgment across recruitment, performance evaluation, and workforce management practices. It highlights critical issues such as algorithmic bias, transparency, managerial autonomy, and ethical AI governance while proposing human-centered frameworks for responsible AI adoption in Human Resource Management.", url: "", featured: true, doi: "", ssrn_url: "", pdf_url: "" },
  ];
  for (const p of papers) {
    const { error } = await supabase.from("research_papers").upsert(p, { onConflict: "sort_order" });
    if (error) console.error("Paper error:", error.message); else console.log("✅ Paper:", p.title.substring(0, 60));
  }

  // === AWARDS / HONORS ===
  const awards = [
    { sort_order: 0, year: "2026", kind: "Conference", title: "International Conference Paper Presenter \u2013 MEC 2026", org: "Acharya Institute of Technology", category: "Research", location: "Bengaluru", story: "Presented a research paper titled \"AI-Driven Employee Monitoring and Its Impact on Employee Well-being, Trust, and Performance in the Post-Pandemic Work Environment\" at the International Conference on Management and Entrepreneurial Challenges in a Dynamic Business Environment (MEC-2026).", why: "Selected to present at an international conference.", skills: ["Research", "Presentation", "Academic Writing"] },
    { sort_order: 1, year: "2026", kind: "Seminar", title: "National Seminar Research Paper Presentation", org: "Badruka College of Commerce and Arts", category: "Research", location: "Hyderabad", story: "Presented a research paper titled \"Green Algorithmic Human Resource Management: Leveraging Artificial Intelligence for Sustainable Workforce and Climate-Conscious Organizations\" at the Two-Day National Seminar on \"Redefining Business Strategies in the Era of Sustainability and Artificial Intelligence.\"", why: "Selected to present at a national seminar.", skills: ["Research", "Sustainability", "AI"] },
    { sort_order: 2, year: "2026", kind: "Award", title: "National Financial Literacy Quiz (NFLQ) 2026 \u2013 Participation Certificate", org: "NISM", category: "Finance", location: "India", story: "Awarded a Participation Certificate for competing in the National Financial Literacy Quiz (NFLQ) 2026 \u2013 Online Round, organized by NISM and supported by SEBI.", why: "Demonstrated financial literacy knowledge.", skills: ["Financial Literacy"] },
    { sort_order: 3, year: "2026", kind: "Certification", title: "SEBI Investor Awareness Test", org: "NISM", category: "Finance", location: "India", story: "Successfully completed the SEBI Investor Awareness Test conducted by NISM in association with SEBI, covering investor awareness, financial literacy, and securities market concepts.", why: "Demonstrated investor awareness and market knowledge.", skills: ["Investor Awareness", "Capital Markets"] },
  ];
  for (const a of awards) {
    const { error } = await supabase.from("awards").upsert(a, { onConflict: "sort_order" });
    if (error) console.error("Award error:", error.message); else console.log("✅ Award:", a.title.substring(0, 60));
  }

  // === CERTIFICATIONS ===
  const certs = [
    { sort_order: 0, title: "AI Skills Fest 2026", issuer: "Microsoft", year: "2026", date: "Jun 2026", description: "Earners demonstrate foundational and applied AI knowledge, including how to use AI tools to enhance productivity, create content, and solve real-world problems.", verified: true },
    { sort_order: 1, title: "Certificate of Achievement TRIQ", issuer: "Unstop", year: "2026", date: "Jun 2026", verified: true },
    { sort_order: 2, title: "Exploring SAP Analytics Cloud", issuer: "SAP", year: "2026", date: "Jun 2026", description: "Completed the beginner-level certification in SAP Analytics Cloud offered by SAP Learning. Gained foundational knowledge in SAP Analytics Cloud navigation, data modeling, analytics, planning, dashboards, and business intelligence concepts.", verified: true },
    { sort_order: 3, title: "Product Management Fundamentals", issuer: "University System of Maryland", year: "2026", date: "May 2026", description: "Successfully completed \"Product Management Fundamentals\" by the University of Maryland through edX. Gained knowledge in product lifecycle management, customer-centric innovation, market analysis, product strategy, and business problem-solving.", verified: true },
    { sort_order: 4, title: "Six Sigma and the Organization (Advanced)", issuer: "Kennesaw State University", year: "2026", date: "May 2026", description: "Successfully completed the advanced-level course offered through Coursera, focused on process improvement methodologies, quality management principles, organizational efficiency, and Lean Six Sigma concepts.", verified: true },
    { sort_order: 5, title: "Introduction to AI", issuer: "Google", year: "2026", date: "Apr 2026", description: "Successfully completed \"Introduction to AI\" authorized by Google through Coursera, covering foundational AI, Generative AI, and Machine Learning concepts. Score: 100%.", verified: true },
    { sort_order: 6, title: "Human Resources (HR) Leadership and HR Management Strategies", issuer: "Stellenbosch University", year: "2026", date: "Apr 2026", description: "Successfully completed the verified edX course focused on HR leadership principles, workforce management strategies, organizational behavior, and employee development.", verified: true },
    { sort_order: 7, title: "Six Sigma Principles", issuer: "Kennesaw State University", year: "2026", date: "Apr 2026", description: "Successfully completed \"Six Sigma Principles\" through Coursera, focused on Lean Six Sigma methodologies, process improvement, and root cause analysis. Score: 90.28%.", verified: true },
    { sort_order: 8, title: "Deloitte Australia - Data Analytics Virtual Internship", issuer: "Forage", year: "2026", date: "Jan 2026", description: "Completed the Data Analytics Job Simulation offered by Deloitte Australia through Forage, involving interactive dashboards using Tableau and data classification/business analysis using Excel.", verified: true },
    { sort_order: 9, title: "Goldman Sachs - Risk Job Simulation", issuer: "Forage", year: "2025", date: "Dec 2025", verified: true },
  ];
  for (const c of certs) {
    const { error } = await supabase.from("certifications").upsert(c, { onConflict: "sort_order" });
    if (error) console.error("Cert error:", error.message); else console.log("✅ Cert:", c.title);
  }

  console.log("\n🎉 All LinkedIn-matched data seeded!");
}

seed().catch(console.error);