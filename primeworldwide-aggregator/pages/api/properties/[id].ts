/**
 * pages/api/properties/[id].ts
 *
 * GET handler to return a single property by its database ID.
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET") {
    return res.setHeader("Allow", ["GET"]).status(405).end(`Method ${method} Not Allowed`);
  }

  const propId = parseInt(Array.isArray(id) ? id[0] : id, 10);

  if (isNaN(propId)) {
    return res.status(400).json({ error: "Invalid property ID." });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: propId },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found." });
    }

    return res.status(200).json({ data: property });
  } catch (err) {
    console.error("❌ /api/properties/[id] error:", err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}