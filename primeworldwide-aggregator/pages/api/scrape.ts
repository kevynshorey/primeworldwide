/**
 * pages/api/scrape.ts
 *
 * A simple API route to invoke the scraping script.
 * We schedule this route weekly via Vercel’s cron settings in vercel.json.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.setHeader("Allow", ["GET"]).status(405).end(`Method ${req.method} Not Allowed`);
  }

  const scriptPath = path.join(process.cwd(), "scripts", "scrapeListings.ts");
  exec(`npx ts-node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Scrape script error:", stderr);
      return res.status(500).json({ error: "Scraping failed." });
    }
    console.log(stdout);
    return res.status(200).json({ success: true, output: stdout });
  });
}