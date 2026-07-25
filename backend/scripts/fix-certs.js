const { createClient } = require("d:/Portfolio/Mani-portfolio-FINAL/node_modules/@supabase/supabase-js");
const supabase = createClient(
  "https://frkwetlvotoqlwazejrp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZya3dldGx2b3RvcWx3YXplanJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgyNTU2OSwiZXhwIjoyMTAwNDAxNTY5fQ.e8HCcBOPY6XTmjnXwiWtxgZG3OvX3Ub2knSsrVtNte4",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

async function main() {
  await supabase.from("certifications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  
  const certs = [
    { sort_order: 0, title: "AI Skills Fest 2026", issuer: "Microsoft", date: "Jun 2026", verified: true, category: "AI" },
    { sort_order: 1, title: "Certificate of Achievement TRIQ", issuer: "Unstop", date: "Jun 2026", verified: true, category: "Achievement" },
    { sort_order: 2, title: "Exploring SAP Analytics Cloud", issuer: "SAP", date: "Jun 2026", verified: true, category: "Data & Analytics" },
    { sort_order: 3, title: "Product Management Fundamentals", issuer: "University System of Maryland", date: "May 2026", verified: true, category: "Product Management" },
    { sort_order: 4, title: "Six Sigma and the Organization (Advanced)", issuer: "Kennesaw State University", date: "May 2026", verified: true, category: "Process Improvement" },
    { sort_order: 5, title: "Introduction to AI", issuer: "Google", date: "Apr 2026", verified: true, category: "AI" },
    { sort_order: 6, title: "Human Resources (HR) Leadership and HR Management Strategies", issuer: "Stellenbosch University", date: "Apr 2026", verified: true, category: "HR" },
    { sort_order: 7, title: "Six Sigma Principles", issuer: "Kennesaw State University", date: "Apr 2026", verified: true, category: "Process Improvement" },
    { sort_order: 8, title: "Deloitte Australia - Data Analytics Virtual Internship", issuer: "Forage", date: "Jan 2026", verified: true, category: "Data & Analytics" },
    { sort_order: 9, title: "Goldman Sachs - Risk Job Simulation", issuer: "Forage", date: "Dec 2025", verified: true, category: "Finance" },
  ];
  for (const c of certs) {
    const { error } = await supabase.from("certifications").insert(c);
    if (error) console.error("Cert error:", error.message); else console.log("✅ Cert:", c.title);
  }
  console.log("\nDone!");
}
main().catch(console.error);