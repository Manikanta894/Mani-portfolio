// One-time script: creates your admin login.
// Run: node scripts/createAdmin.js you@email.com yourPassword123
require("dotenv").config();
const bcrypt = require("bcryptjs");
const supabase = require("../src/config/supabase");

async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error("Usage: node scripts/createAdmin.js <email> <password>");
    process.exit(1);
  }
  const password_hash = await bcrypt.hash(password, 10);
  const { error } = await supabase.from("admin_users").insert({ email, password_hash });
  if (error) {
    console.error("Failed:", error.message);
    process.exit(1);
  }
  console.log(`Admin user created: ${email}`);
}

main();
