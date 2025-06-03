/**
 * pages/api/contact.ts
 *
 * Accepts POST { propertyId, name, email, message },
 * saves to the Inquiry table, and sends an email to the agent.
 * If propertyId is null, sends to site admin (EMAIL_FROM).
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/db";
import { sendEmail } from "../../lib/email";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.setHeader("Allow", ["POST"]).status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { propertyId, name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields (name, email, message)." });
  }

  try {
    let agentEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    if (propertyId) {
      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property) {
        return res.status(404).json({ error: "Property not found." });
      }
      if (property.agentEmail) {
        agentEmail = property.agentEmail;
      }
    }

    // Save inquiry in DB
    await prisma.inquiry.create({
      data: {
        propertyId: propertyId || 0, // use 0 or null; adjust model if needed
        name,
        email,
        message,
        submittedAt: new Date(),
      },
    });

    // Send email
    const subject = propertyId
      ? `New Inquiry for Property ID ${propertyId}`
      : "General Inquiry from Prime Worldwide Properties";
    const html = `
      <p>You have a new inquiry:</p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Message:</strong> ${message}</li>
      </ul>
      ${
        propertyId
          ? `<p>Property ID: ${propertyId}</p>`
          : `<p>— General inquiry (no specific property)</p>`
      }
    `;
    await sendEmail(agentEmail, subject, html);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ /api/contact error:", err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}