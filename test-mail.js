// Manual test-send script to verify the SMTP (Zoho) mail configuration.
// Run with:  node --env-file=.env test-mail.js
// (Optionally override recipient:  node --env-file=.env test-mail.js you@example.com)

import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.zoho.in";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || SMTP_USER;

const to = process.argv[2] || CONTACT_EMAIL;

console.log("SMTP config being used:");
console.log({ SMTP_HOST, SMTP_PORT, SMTP_USER, from: SMTP_USER, to });

if (!SMTP_USER || !SMTP_PASS) {
  console.error("ERROR: SMTP_USER or SMTP_PASS is missing. Configure them in .env first.");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const mailOptions = {
  from: `"Manikanta Portfolio Test" <${SMTP_USER}>`,
  to,
  replyTo: SMTP_USER,
  subject: "✅ SMTP test mail — Portfolio config verification",
  text: "This is a manual test email sent to verify the Zoho SMTP configuration for the Manikanta portfolio contact form.",
  html: `<p>This is a <strong>manual test email</strong> sent to verify the Zoho SMTP configuration.</p>
         <p>If you received this, your mail setup is working correctly. 🎉</p>`,
};

try {
  const info = await transport.sendMail(mailOptions);
  console.log("\n✅ Email sent successfully!");
  console.log("Message ID:", info.messageId);
  console.log("Response:", info.response);
  process.exit(0);
} catch (err) {
  console.error("\n❌ Failed to send email:");
  console.error("Message:", err.message);
  console.error("Code:", err.code);
  console.error("Errno:", err.errno);
  console.error("Command:", err.command);
  console.error("Response:", err.response);
  process.exit(1);
}
