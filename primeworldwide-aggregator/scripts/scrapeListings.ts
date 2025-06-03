/**
 * scripts/scrapeListings.ts
 *
 * Fetches property listings from each URL in SCRAPE_URLS,
 * parses them with Cheerio (or Puppeteer if needed), normalizes &
 * de-duplicates, then upserts into the database via Prisma.
 *
 * Updated to include multiple Barbados-specific sites:
 *  - cariblist.com
 *  - terracaribbean.com
 *  - realtor.com (Barbados section)
 *  - realtorslimited.com
 *  - altmanbarbados.com
 *  - barbados-sothebysrealty.com
 *  - chestertonbarbados.com
 *  - beavabarbados.com
 *
 * NOTE: Each site requires its own parsing logic. Below are stubs
 * for CaribList, TerraCaribbean, Realtor.com, and placeholders for
 * major agency sites. Implement selectors as needed.
 */

import axios from "axios";
import cheerio from "cheerio";
import dotenv from "dotenv";
import prisma from "../lib/db";

dotenv.config();

interface RawProperty {
  title: string;
  price: string;
  address: string;
  parish: string;
  bedrooms: number | null;
  bathrooms: number | null;
  lotSize: string | null;
  agentName: string | null;
  agentEmail: string | null;
  images: string[];
  sourceURL: string;
}

/** Scraper for CaribList.com */
async function scrapeCaribList(url: string): Promise<RawProperty[]> {
  const result: RawProperty[] = [];
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Example selectors—adjust to actual CaribList DOM
  $(".property-card").each((_, el) => {
    const title = $(el).find(".property-title").text().trim();
    const price = $(el).find(".property-price").text().trim();
    const address = $(el).find(".property-address").text().trim();
    const parish = $(el).find(".property-parish").text().trim();
    const bedroomsText = $(el).find(".property-beds").text().trim();
    const bathroomsText = $(el).find(".property-baths").text().trim();
    const lotSize = $(el).find(".property-lotsize").text().trim() || null;
    const agentName = $(el).find(".property-agent-name").text().trim() || null;
    const agentEmail = $(el).find(".property-agent-email").text().trim() || null;
    const images: string[] = [];
    $(el)
      .find(".property-gallery img")
      .each((_, imgEl) => {
        const src = $(imgEl).attr("src");
        if (src) images.push(src);
      });
    const sourceURL = $(el).find("a.property-link").attr("href") || url;

    result.push({
      title,
      price,
      address,
      parish,
      bedrooms: bedroomsText ? parseInt(bedroomsText) : null,
      bathrooms: bathroomsText ? parseInt(bathroomsText) : null,
      lotSize,
      agentName,
      agentEmail,
      images,
      sourceURL,
    });
  });

  return result;
}

/** Scraper for TerraCaribbean.com */
async function scrapeTerraCaribbean(url: string): Promise<RawProperty[]> {
  const result: RawProperty[] = [];
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Example selectors—adjust to actual TerraCaribbean DOM
  $(".property-listing").each((_, el) => {
    const title = $(el).find(".listing-title").text().trim();
    const price = $(el).find(".listing-price").text().trim();
    const address = $(el).find(".listing-address").text().trim();
    const parish = $(el).find(".listing-parish").text().trim();
    const bedroomsText = $(el).find(".listing-beds").text().trim();
    const bathroomsText = $(el).find(".listing-baths").text().trim();
    const lotSize = $(el).find(".listing-lotsize").text().trim() || null;
    const agentName = $(el).find(".agent-name").text().trim() || null;
    const agentEmail = $(el).find(".agent-email").text().trim() || null;
    const images: string[] = [];
    $(el)
      .find(".listing-gallery img")
      .each((_, imgEl) => {
        const src = $(imgEl).attr("data-src") || $(imgEl).attr("src");
        if (src) images.push(src);
      });
    const sourceURL = $(el).find("a.listing-link").attr("href") || url;

    result.push({
      title,
      price,
      address,
      parish,
      bedrooms: bedroomsText ? parseInt(bedroomsText) : null,
      bathrooms: bathroomsText ? parseInt(bathroomsText) : null,
      lotSize,
      agentName,
      agentEmail,
      images,
      sourceURL,
    });
  });

  return result;
}

/** Scraper for Realtor.com (Barbados section) */
async function scrapeRealtorBarbados(url: string): Promise<RawProperty[]> {
  const result: RawProperty[] = [];
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Example selectors—adjust to actual Realtor.com DOM
  $(".component_property-card").each((_, el) => {
    const title = $(el).find(".listing-street-address").text().trim();
    const price = $(el).find(".listing-price").text().trim();
    const address = $(el).find(".listing-address").text().trim();
    const parish = $(el).find(".listing-region").text().trim(); // e.g., “Barbados”
    const bedsText = $(el).find(".listing-beds").text().trim();
    const bathsText = $(el).find(".listing-baths").text().trim();
    const lotSize = $(el).find(".listing-lot-size").text().trim() || null;
    const agentName = $(el).find(".listing-profile-name").text().trim() || null;
    const agentEmail = null; // Realtor.com often doesn’t expose direct agent email
    const images: string[] = [];
    $(el)
      .find(".listing-photo img")
      .each((_, imgEl) => {
        const src = $(imgEl).attr("src");
        if (src) images.push(src);
      });
    const sourceURL = $(el).find("a[href*='realtor.com']").attr("href") || url;

    result.push({
      title: title || "Listing on Realtor.com",
      price,
      address,
      parish,
      bedrooms: bedsText ? parseInt(bedsText) : null,
      bathrooms: bathsText ? parseInt(bathsText) : null,
      lotSize,
      agentName,
      agentEmail,
      images,
      sourceURL,
    });
  });

  return result;
}

/** Placeholders for major agency sites:
 *  - Realtors Limited (realtorslimited.com)
 *  - Altman (altmanbarbados.com)
 *  - Sotheby's (barbados-sothebysrealty.com)
 *  - Chesterton Barbados (chestertonbarbados.com)
 *  - BEAVA Portal (beavabarbados.com)
 *
 * In each case, you must inspect the actual DOM and write selectors.
 * For now, these functions return an empty array and log a warning.
 */
async function scrapeGenericAgency(url: string): Promise<RawProperty[]> {
  console.warn(`⚠️ No custom scraper implemented for ${url}. Returning empty list.`);
  return [];
}

async function main() {
  if (!process.env.SCRAPE_URLS) {
    console.error("❌ SCRAPE_URLS is not defined in environment variables.");
    process.exit(1);
  }

  const urls = process.env.SCRAPE_URLS.split(",").map((u) => u.trim());
  let totalInserted = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const url of urls) {
    let rawProperties: RawProperty[] = [];

    try {
      if (url.includes("cariblist.com")) {
        rawProperties = await scrapeCaribList(url);
      } else if (url.includes("terracaribbean.com")) {
        rawProperties = await scrapeTerraCaribbean(url);
      } else if (url.includes("realtor.com")) {
        rawProperties = await scrapeRealtorBarbados(url);
      } else if (
        url.includes("realtorslimited.com") ||
        url.includes("altmanbarbados.com") ||
        url.includes("barbados-sothebysrealty.com") ||
        url.includes("chestertonbarbados.com") ||
        url.includes("beavabarbados.com")
      ) {
        rawProperties = await scrapeGenericAgency(url);
      } else {
        console.warn(`⚠️ Unknown domain, skipping: ${url}`);
        continue;
      }
    } catch (err) {
      console.error(`❌ Failed to scrape ${url}:`, err);
      continue;
    }

    for (const prop of rawProperties) {
      try {
        const existing = await prisma.property.findUnique({
          where: { sourceURL: prop.sourceURL },
        });

        if (existing) {
          // Update existing
          await prisma.property.update({
            where: { id: existing.id },
            data: {
              title: prop.title,
              price: prop.price,
              address: prop.address,
              parish: prop.parish,
              bedrooms: prop.bedrooms,
              bathrooms: prop.bathrooms,
              lotSize: prop.lotSize,
              agentName: prop.agentName,
              agentEmail: prop.agentEmail,
              images: prop.images,
              scrapedAt: new Date(),
            },
          });
          totalUpdated++;
        } else {
          // Insert new
          await prisma.property.create({
            data: {
              title: prop.title,
              price: prop.price,
              address: prop.address,
              parish: prop.parish,
              bedrooms: prop.bedrooms,
              bathrooms: prop.bathrooms,
              lotSize: prop.lotSize,
              agentName: prop.agentName,
              agentEmail: prop.agentEmail,
              images: prop.images,
              sourceURL: prop.sourceURL,
              scrapedAt: new Date(),
            },
          });
          totalInserted++;
        }
      } catch (dbErr) {
        console.error(`❌ Database error for ${prop.sourceURL}:`, dbErr);
        totalSkipped++;
      }
    }
  }

  console.log(
    `✅ Weekly scraping complete. Inserted: ${totalInserted}, Updated: ${totalUpdated}, Skipped: ${totalSkipped}`
  );
  process.exit(0);
}

if (require.main === module) {
  main();
}