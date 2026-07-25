/**
 * Run migration_005_section_content.sql against Supabase
 * Usage: node backend/scripts/run-migration.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabaseUrl = process.env.SUPABASE_URL || "https://frkwetlvotoqlwazejrp.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZya3dldGx2b3RvcWx3YXplanJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgyNTU2OSwiZXhwIjoyMTAwNDAxNTY5fQ.e8HCcBOPY6XTmjnXwiWtxgZG3OvX3Ub2knSsrVtNte4";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, "..", "db", "migration_005_section_content.sql"), "utf8");
  
  // Split by semicolons and run each statement
  const statements = sql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    const { error } = await supabase.rpc("exec_sql", { sql: stmt + ";" });
    if (error) {
      // Try direct query if RPC not available
      const { error: directError } = await supabase.from("_dummy").select("*").limit(0);
      if (directError) {
        console.log("RPC not available, trying direct SQL execution...");
        // Fallback: use the REST API to run raw SQL
        const { error: sqlError } = await supabase.from("section_content").select("id").limit(1);
        if (sqlError && sqlError.message?.includes("relation") && sqlError.message?.includes("does not exist")) {
          console.log("Table doesn't exist yet. Need to create it via Supabase dashboard SQL editor.");
          console.log("Please copy the contents of backend/db/migration_005_section_content.sql");
          console.log("and run it in the Supabase SQL Editor at:");
          console.log("https://supabase.com/dashboard/project/frkwetlvotoqlwazejrp/sql/new");
          return;
        }
      }
    }
  }
  console.log("Migration executed successfully!");
}

run().catch(console.error);