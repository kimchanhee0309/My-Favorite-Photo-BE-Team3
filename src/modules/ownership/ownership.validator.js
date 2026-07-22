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

export const getMyOwnershipsSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().positive().max(50).optional(),
    cursor: z.string().optional(),
    search: z.string().trim().optional(),
    grade: cardGradeSchema.optional(),
    genre: cardGenreSchema.optional(),
  }),
});

export const getOwnershipSchema = z.object({
  params: z.object({
    ownershipId: z.string().uuid(),
  }),
});
