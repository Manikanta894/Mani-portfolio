import { createFileRoute } from "@tanstack/react-router";
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.zoho.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const TO_EMAIL = process.env.CONTACT_EMAIL || "contact@manikantar.in";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

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

          if (!SMTP_USER || !SMTP_PASS) {
            console.error("SMTP credentials not configured");
            return Response.json({ success: false, error: "Server configuration error" }, { status: 500 });
          }

          const mailOptions = {
            from: `"Portfolio Contact" <${SMTP_USER}>`,
            to: TO_EMAIL,
            replyTo: email,
            subject: subject ? `Portfolio: ${subject}` : "New message from your portfolio",
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            html: `<p><strong>From:</strong> ${name} (${email})</p>${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}<p>${message.replace(/\n/g, "<br>")}</p>`,
          };

          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent:", info.messageId);

          return Response.json({ success: true });
        } catch (error) {
          console.error("Contact form error:", error);
          return Response.json({ success: false, error: String(error) }, { status: 500 });
        }
      },
    },
  },
});
