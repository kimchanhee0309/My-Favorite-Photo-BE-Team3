import { z } from "zod";

const cardGenreSchema = z.enum([
  "LANDSCAPE",
  "PORTRAIT",
  "TRAVEL",
  "ANIMAL",
  "OBJECT",
  "ETC",
]);

const cardGradeSchema = z.enum(["COMMON", "RARE", "SUPER_RARE", "LEGENDARY"]);

export const ownershipIdParamSchema = z.object({
  ownershipId: z.string().uuid(),
});

export const getMyOwnershipsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  search: z.string().trim().optional(),
  grade: cardGradeSchema.optional(),
  genre: cardGenreSchema.optional(),
});
