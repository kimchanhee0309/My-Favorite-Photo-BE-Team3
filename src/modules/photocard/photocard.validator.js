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

export const photocardIdParamSchema = z.object({
  photocardId: z.string().uuid(),
});

export const createPhotocardBodySchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1),
  imageUrl: z.string().trim().url().max(500),
  genre: cardGenreSchema,
  grade: cardGradeSchema,
  minPrice: z.coerce.number().int().positive(),
  totalQuantity: z.coerce.number().int().min(1).max(10),
});

export const getMyPhotocardsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  grade: cardGradeSchema.optional(),
  genre: cardGenreSchema.optional(),
  search: z.string().trim().min(1).max(100).optional(),
  orderBy: z.enum(["latest", "oldest", "price_asc", "price_desc"]).optional(),
});
