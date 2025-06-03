/**
 * lib/email.ts
 *
 * Sets up a Nodemailer transporter using environment variables.
 * Exports a sendEmail helper to forward "Contact Agent" inquiries.
 */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // set to true if using port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * sendEmail
 * @param to - recipient email
 * @param subject
 * @param html - HTML body
 */
export async function sendEmail(to: string, subject: string, html: string) {
  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    html,
  });
}