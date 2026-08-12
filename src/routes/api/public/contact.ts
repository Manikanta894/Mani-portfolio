import { createFileRoute } from "@tanstack/react-router";
import nodemailer from "nodemailer";
import { z } from "zod";

const SMTP_SCHEMA = z.object({
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
  TO_EMAIL: z.string().email().optional(),
});

const parsed = SMTP_SCHEMA.parse({
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  TO_EMAIL: process.env.CONTACT_EMAIL,
});

const SMTP_HOST = parsed.SMTP_HOST || "smtp.zoho.in";
const SMTP_PORT = parsed.SMTP_PORT || 465;
const SMTP_USER = parsed.SMTP_USER || "";
const SMTP_PASS = parsed.SMTP_PASS || "";
const TO_EMAIL = parsed.TO_EMAIL || "contact@manikantar.in";

function getTransport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    logger: (info) => console.log("Zoho SMTP:", info.action, info[info.event || "from"]),
  });
}

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { name, email, message, subject } = body || {};

          if (!name || !email || !message) {
            return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
          }

          const transport = getTransport();
          if (!transport._options || !transport._options.auth) {
            console.error("SMTP auth not configured", { SMTP_HOST, SMTP_USER, SMTP_PASS });
            return Response.json({ success: false, error: "SMTP not configured" }, { status: 500 });
          }

          const mailOptions = {
            from: `"${name}" <${SMTP_USER}>`,
            to: TO_EMAIL,
            replyTo: email,
            subject: subject ? `Portfolio: ${subject}` : "New message from your portfolio",
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            html: `<p><strong>From:</strong> ${name} (${email})</p>${
              subject
                ? `<p><strong>Subject:</strong> ${subject}</p>`
                : ""
            }<p>${message.replace(/\n/g, "<br>")}</p>`,
          };

          const info = await transport.sendMail(mailOptions);
          console.log("Email sent:", info.messageId);

          return Response.json({ success: true });
        } catch (error: any) {
          console.error("Contact form error:", error.message, error.code, error.errno);
          return Response.json({ success: false, error: error.message || "Email sending failed" }, { status: 500 });
        }
      },
    },
  },
});
