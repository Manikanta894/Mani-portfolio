const { createClient } = require("../node_modules/@supabase/supabase-js");
const supabase = createClient(
  "https://frkwetlvotoqlwazejrp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZya3dldGx2b3RvcWx3YXplanJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgyNTU2OSwiZXhwIjoyMTAwNDAxNTY5fQ.e8HCcBOPY6XTmjnXwiWtxgZG3OvX3Ub2knSsrVtNte4",
  { auth: { persistSession: false, autoRefreshToken: false } }
);

async function main() {
  const { data: edu } = await supabase.from("education").select("degree").order("sort_order");
  console.log("Education rows:", edu?.length);
  edu?.forEach(e => console.log(" -", e.degree?.substring(0, 70)));
}
main();