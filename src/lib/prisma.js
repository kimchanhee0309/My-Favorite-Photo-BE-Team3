import { PrismaClient } from "@prisma/client";

const isProduction = process.env.NODE_ENV === "production";

export const prisma = new PrismaClient({
  log: isProduction ? ["error"] : ["query", "error", "warn"],
});

// 사용법
// import { prisma } from '../../lib/prisma.js'
