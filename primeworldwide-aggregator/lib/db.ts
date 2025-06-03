/**
 * lib/db.ts
 *
 * Initializes and exports a single PrismaClient instance.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;