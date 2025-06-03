/**
 * pages/api/properties.ts
 *
 * GET handler to return paginated, filtered property listings.
 * Query parameters: page, limit, parish, minPrice, maxPrice, bedrooms, bathrooms.
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.setHeader("Allow", ["GET"]).status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    page = "1",
    limit = "10",
    parish,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
  } = req.query;

  const pageNum = parseInt(Array.isArray(page) ? page[0] : page, 10) || 1;
  const limitNum = parseInt(Array.isArray(limit) ? limit[0] : limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const filters: any = {};

  if (parish) {
    filters.parish = { equals: (Array.isArray(parish) ? parish[0] : parish) };
  }
  if (bedrooms) {
    filters.bedrooms = { gte: parseInt(Array.isArray(bedrooms) ? bedrooms[0] : bedrooms, 10) };
  }
  if (bathrooms) {
    filters.bathrooms = { gte: parseInt(Array.isArray(bathrooms) ? bathrooms[0] : bathrooms, 10) };
  }
  if (minPrice || maxPrice) {
    const min = minPrice ? parseInt(Array.isArray(minPrice) ? minPrice[0] : minPrice, 10) : 0;
    const max = maxPrice ? parseInt(Array.isArray(maxPrice) ? maxPrice[0] : maxPrice, 10) : undefined;
    filters.price = max
      ? { gte: min, lte: max }
      : { gte: min };
  }

  try {
    const [totalCount, properties] = await Promise.all([
      prisma.property.count({ where: filters }),
      prisma.property.findMany({
        where: filters,
        skip,
        take: limitNum,
        orderBy: { scrapedAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    return res.status(200).json({
      data: properties,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (err) {
    console.error("❌ /api/properties error:", err);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}