/**
 * Update all LinkedIn-matched data into existing Supabase tables.
 * Uses exact column names matching the existing schemas.
 * 
 * Usage: cd backend && node scripts/update-all-data.js
 */
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://frkwetlvotoqlwazejrp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZya3dldGx2b3RvcWx3YXplanJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgyNTU2OSwiZXhwIjoyMTAwNDAxNTY5fQ.e8HCcBOPY6XTmjnXwiWtxgZG3OvX3Ub2knSsrVtNte4",
  { auth: { persistSession: false, autoRefreshToken: false }, realtime: { transport: null } }
);

async function main() {
  // 1. EDUCATION
  // Existing columns: id, sort_order, degree, field, institution, grade, status, start_date, end_date, description, highlights, skills, logo, location, era
  const educationData = [
    { sort_order: 0, degree: "Master of Business Administration (MBA), Business Analytics & Finance", field: "Business Analytics & Finance", institution: "Nagarjuna Degree College", grade: "Pursuing", status: "Current", start_date: "Aug 2025", end_date: "Dec 2027", description: "Pursuing an MBA with specialization in Business Analytics and Finance, focusing on applying analytical tools to real business problems. Actively engaged in research-oriented projects, case studies, and data-driven decision-making to build a strong foundation for analytics and future academic research.", highlights: ["Research-based academic projects; Case study analysis and business simulations", "Data analysis practice using Excel, SQL, and Power BI", "Participation in seminars and academic discussions"] },
    { sort_order: 1, degree: "Bachelor of Business Administration (BBA), Business Administration and Management, General", field: "Business Administration and Management", institution: "Government First Grade College, Govt. Middle School Annex, Near NES Office, Yelahanka, Bangalore - 560064", grade: "A", status: "Completed", start_date: "Sep 2023", end_date: "Sep 2025", description: "Completed undergraduate studies in Business Administration with exposure to core management domains. Developed analytical thinking through case studies and projects, secured 1st place in EDP for innovative business planning, and balanced academics alongside professional work experience.", highlights: ["Entrepreneurship Development Program (EDP)", "Case studies and business plan presentations", "Academic seminars and group projects; Peer mentoring and academic support"] },
    { sort_order: 2, degree: "Pre-University Course, Statistics, Accounts, Business, and Economics", field: "Commerce", institution: "Govt Pre-university College", grade: "B+", status: "Completed", start_date: "Mar 2022", end_date: "Apr 2023", description: "Studied commerce subjects including Accountancy, Economics, Business Studies, and Statistics, building a strong foundation in quantitative reasoning, business concepts, and analytical thinking.", highlights: ["Commerce-related seminars and discussions", "Group assignments and academic events", "Peer assistance in accounts and economics"] },
    { sort_order: 3, degree: "Secondary School Leaving Certificate, General", field: "General", institution: "Sri Vinayaka Vidya Kendra", grade: "A", status: "Completed", start_date: "Mar 2019", end_date: "May 2020", description: "Completed secondary education with strong academic performance. Recognized for discipline, teamwork, and all-round participation, laying the foundation for leadership and responsibility.", highlights: ["Participation in school events and cultural programs", "Volunteering and team-based activities"] },
  ];
  // Delete old records first, then insert
  await supabase.from("education").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  for (const e of educationData) {
    const { error } = await supabase.from("education").insert(e);
    if (error) console.error("Edu insert error:", error.message); else console.log("✅ Education:", e.degree.substring(0, 60));
  }

  // 2. EXPERIENCE — existing columns: id, sort_order, company, role, type, location, start_date, end_date, current, description, highlights, skills, logo, duration
  const experienceData = [
    { sort_order: 0, role: "Senior Customer Service Advisor", company: "Fizzy Goblet", type: "Full-time", location: "Bangalore Urban, Karnataka, India", start_date: "Mar 2024", end_date: "Present", current: true, duration: "2 yrs 5 mos", description: "Managed store-level operations, ensuring compliance with SOPs and effective inventory control in a premium retail environment. Promoted from Stock Associate to Senior Customer Service Advisor due to exceptional performance and product expertise.", highlights: ["Prepared comprehensive sales and stock reports to facilitate data-driven decision-making", "Collaborated with logistics to guarantee accurate order fulfillment and timely deliveries"] },
    { sort_order: 1, role: "Store In-Charge – FMCG", company: "RCM", type: "Part-time", location: "Bengaluru, Karnataka, India", start_date: "Jun 2022", end_date: "Jan 2024", current: false, duration: "1 yr 8 mos", description: "Led day-to-day store operations including inventory management, billing, POS handling, and stock audits. Implemented WhatsApp Business as a digital sales channel, contributing to improved customer reach and order volume.", highlights: ["Maintained accurate sales, billing, and stock reports for management review and audit purposes", "Coordinated online order processing and last-mile delivery to ensure timely and accurate fulfillment", "Supervised and guided junior staff while ensuring compliance with operational SOPs"] },
  ];
  await supabase.from("experience").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  for (const e of experienceData) {
    const { error } = await supabase.from("experience").insert(e);
    if (error) console.error("Exp insert error:", error.message); else console.log("✅ Experience:", e.role);
  }

  // 3. RESEARCH PAPERS — existing columns: id, sort_order, title, authors, journal, year, doi, url, abstract, keywords, category, featured, citation, publisher, pages, volume, issue, pdf_url, ssrn_url
  const papersData = [
    { sort_order: 0, title: "The Rapid Rise of Quick Commerce and Its Impact on Worker Pressure and Operational Efficiency in Bengaluru", authors: "Manikanta R", journal: "SSRN (Elsevier)", year: 2026, url: "https://ssrn.com/abstract=", abstract: "This research examines the rapid expansion of quick commerce (q-commerce) in Bengaluru and its impact on operational efficiency, workforce pressure, and employee well-being. The study analyzes delivery timelines, dark store operations, employee burnout, and hyperlocal logistics systems used by platforms such as Zepto, Blinkit, and Swiggy Instamart. The findings highlight the need for balancing ultra-fast delivery performance with sustainable workforce management and long-term operational sustainability in India's evolving gig economy.", featured: true, keywords: ["Quick Commerce", "Operational Efficiency", "Workforce Pressure", "Bengaluru"] },
    { sort_order: 1, title: "One Vote Matters: A Case Study on Political Awareness and Youth Voting Behaviour in Tamil Nadu", authors: "Manikanta R", journal: "SSRN Electronic Journal | Elsevier", year: 2026, url: "https://ssrn.com/abstract=", abstract: "This research study examines political awareness and youth voting behaviour in Tamil Nadu, focusing on factors influencing electoral participation among young voters. The paper explores the role of social media, education, political engagement, and awareness campaigns in shaping democratic participation and voting decisions. The study highlights the importance of youth involvement in strengthening democratic systems and provides insights into evolving political attitudes among the younger generation.", featured: true, keywords: ["Political Awareness", "Youth Voting", "Tamil Nadu", "Democracy"] },
    { sort_order: 2, title: "From Representation to Influence: A Descriptive Study on Women's Participation in Strategic Decision-Making and Organizational Effectiveness", authors: "Manikanta R", journal: "Advanced International Journal for Research", year: 2026, abstract: "This research paper examines the role of women in strategic decision-making processes and their contribution to organizational effectiveness. The study explores leadership participation, gender diversity, workplace inclusion, and the impact of women's involvement in managerial and strategic roles. The paper highlights how inclusive leadership practices can improve organizational performance, innovation, and long-term sustainability in modern workplaces.", featured: true, keywords: ["Women in Leadership", "Strategic Decision-Making", "Gender Diversity", "Organizational Effectiveness"] },
    { sort_order: 3, title: "From Algorithms to Judgment: How AI Assisted HR Decisions Are Reshaping Trust, Fairness, and Human Agency at Work", authors: "Manikanta R", journal: "IJIRT", year: 2026, abstract: "This research paper examines how Artificial Intelligence-assisted HR systems are transforming organizational decision-making processes and influencing employee trust, fairness, and human agency in modern workplaces. The study explores the interaction between algorithmic recommendations and human judgment across recruitment, performance evaluation, and workforce management practices. It highlights critical issues such as algorithmic bias, transparency, managerial autonomy, and ethical AI governance while proposing human-centered frameworks for responsible AI adoption in Human Resource Management.", featured: true, keywords: ["Algorithmic HRM", "Ethical AI", "Trust", "Fairness", "Human Agency"] },
  ];
  await supabase.from("research_papers").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  for (const p of papersData) {
    const { error } = await supabase.from("research_papers").insert(p);
    if (error) console.error("Paper insert error:", error.message); else console.log("✅ Paper:", p.title.substring(0, 60));
  }

  // 4. AWARDS — existing columns: id, sort_order, year, highlight, kind, title, org, category, location, verified, body, story, why, skills, related
  const awardsData = [
    { sort_order: 0, year: "2026", kind: "Conference", title: "International Conference Paper Presenter \u2013 MEC 2026", org: "Acharya Institute of Technology", category: "Research", location: "Bengaluru", verified: true, story: "Presented a research paper titled 'AI-Driven Employee Monitoring and Its Impact on Employee Well-being, Trust, and Performance in the Post-Pandemic Work Environment' at the International Conference on Management and Entrepreneurial Challenges in a Dynamic Business Environment (MEC-2026).", why: "Selected to present at an international conference.", skills: ["Research", "Presentation", "Academic Writing"] },
    { sort_order: 1, year: "2026", kind: "Seminar", title: "National Seminar Research Paper Presentation", org: "Badruka College of Commerce and Arts", category: "Research", location: "Hyderabad", verified: true, story: "Presented a research paper titled 'Green Algorithmic Human Resource Management: Leveraging Artificial Intelligence for Sustainable Workforce and Climate-Conscious Organizations' at the Two-Day National Seminar on 'Redefining Business Strategies in the Era of Sustainability and Artificial Intelligence.'", why: "Selected to present at a national seminar.", skills: ["Research", "Sustainability", "AI"] },
    { sort_order: 2, year: "2026", kind: "Award", title: "National Financial Literacy Quiz (NFLQ) 2026 \u2013 Participation Certificate", org: "NISM", category: "Finance", location: "India", story: "Awarded a Participation Certificate for competing in the National Financial Literacy Quiz (NFLQ) 2026 \u2013 Online Round, organized by NISM and supported by SEBI.", why: "Demonstrated financial literacy knowledge.", skills: ["Financial Literacy"] },
    { sort_order: 3, year: "2026", kind: "Certification", title: "SEBI Investor Awareness Test", org: "NISM", category: "Finance", location: "India", story: "Successfully completed the SEBI Investor Awareness Test conducted by NISM in association with SEBI, covering investor awareness, financial literacy, and securities market concepts.", why: "Demonstrated investor awareness and market knowledge.", skills: ["Investor Awareness", "Capital Markets"] },
  ];
  await supabase.from("awards").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  for (const a of awardsData) {
    const { error } = await supabase.from("awards").insert(a);
    if (error) console.error("Award insert error:", error.message); else console.log("✅ Award:", a.title.substring(0, 60));
  }

  // 5. CERTIFICATIONS — existing columns: id, sort_order, title, issuer, date, expiry, url, credential_id, skills, logo, category, verified
  const certsData = [
    { sort_order: 0, title: "AI Skills Fest 2026", issuer: "Microsoft", date: "Jun 2026", verified: true, category: "AI", description: "Earners demonstrate foundational and applied AI knowledge, including how to use AI tools to enhance productivity, create content, and solve real-world problems." },
    { sort_order: 1, title: "Certificate of Achievement TRIQ", issuer: "Unstop", date: "Jun 2026", verified: true, category: "Achievement" },
    { sort_order: 2, title: "Exploring SAP Analytics Cloud", issuer: "SAP", date: "Jun 2026", verified: true, category: "Data & Analytics", description: "Completed the beginner-level certification in SAP Analytics Cloud offered by SAP Learning. Gained foundational knowledge in SAP Analytics Cloud navigation, data modeling, analytics, planning, dashboards, and business intelligence concepts." },
    { sort_order: 3, title: "Product Management Fundamentals", issuer: "University System of Maryland", date: "May 2026", verified: true, category: "Product Management", description: "Successfully completed 'Product Management Fundamentals' by the University of Maryland through edX. Gained knowledge in product lifecycle management, customer-centric innovation, market analysis, product strategy, and business problem-solving." },
    { sort_order: 4, title: "Six Sigma and the Organization (Advanced)", issuer: "Kennesaw State University", date: "May 2026", verified: true, category: "Process Improvement", description: "Successfully completed the advanced-level course offered through Coursera, focused on process improvement methodologies, quality management principles, organizational efficiency, and Lean Six Sigma concepts." },
    { sort_order: 5, title: "Introduction to AI", issuer: "Google", date: "Apr 2026", verified: true, category: "AI", description: "Successfully completed 'Introduction to AI' authorized by Google through Coursera, covering foundational AI, Generative AI, and Machine Learning concepts. Score: 100%." },
    { sort_order: 6, title: "Human Resources (HR) Leadership and HR Management Strategies", issuer: "Stellenbosch University", date: "Apr 2026", verified: true, category: "HR", description: "Successfully completed the verified edX course focused on HR leadership principles, workforce management strategies, organizational behavior, and employee development." },
    { sort_order: 7, title: "Six Sigma Principles", issuer: "Kennesaw State University", date: "Apr 2026", verified: true, category: "Process Improvement", description: "Successfully completed 'Six Sigma Principles' through Coursera, focused on Lean Six Sigma methodologies, process improvement, and root cause analysis. Score: 90.28%." },
    { sort_order: 8, title: "Deloitte Australia - Data Analytics Virtual Internship", issuer: "Forage", date: "Jan 2026", verified: true, category: "Data & Analytics", description: "Completed the Data Analytics Job Simulation offered by Deloitte Australia through Forage, involving interactive dashboards using Tableau and data classification/business analysis using Excel." },
    { sort_order: 9, title: "Goldman Sachs - Risk Job Simulation", issuer: "Forage", date: "Dec 2025", verified: true, category: "Finance" },
  ];
  await supabase.from("certifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  for (const c of certsData) {
    const { error } = await supabase.from("certifications").insert(c);
    if (error) console.error("Cert insert error:", error.message); else console.log("✅ Cert:", c.title);
  }

  console.log("\n🎉 All data updated!");
}

main().catch(console.error);