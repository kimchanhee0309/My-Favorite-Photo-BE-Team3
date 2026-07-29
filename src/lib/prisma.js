import { PrismaClient } from "@prisma/client";

const isProduction = process.env.NODE_ENV === "production";

const prisma = new PrismaClient({
  log: isProduction ? ["error"] : ["query", "error", "warn"],
});

export default prisma;
// 사용법
// import { prisma } from '../../lib/prisma.js'
