import { z } from "zod";

const cardGradeSchema = z.enum(["COMMON", "RARE", "SUPER_RARE", "LEGENDARY"]);
const cardGenreSchema = z.enum([
  "LANDSCAPE",
  "PORTRAIT",
  "TRAVEL",
  "ANIMAL",
  "OBJECT",
  "ETC",
]);

const listingStatusSchema = z.enum(["ON_SALE", "SOLD_OUT", "CANCELLED"]);

export const shopListingIdParamSchema = z.object({
  shopListingId: z.string().uuid(),
});

export const getShopListingQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  search: z.string().trim().optional(),
  grade: cardGradeSchema.optional(),
  genre: cardGenreSchema.optional(),
  status: listingStatusSchema.optional(),
  sort: z.enum(["latest", "oldest", "price_asc", "price_desc"]).optional(),
});

export const createShopListingBodySchema = z.object({
  ownershipId: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
  pricePerUnit: z.coerce.number().int().positive(),
  wishGrade: cardGradeSchema.optional(),
  wishGenre: cardGenreSchema.optional(),
  wishDescription: z.string().trim().max(1000).optional(),
});

export const updateShopListingBodySchema = z.object({
  priePerUnit: z.coerce.number().int().positive().optional(),
  wishGrade: cardGradeSchema.optional(),
  wishGenre: cardGenreSchema.optional(),
  wishDescription: z.string().trim().max(1000).optional(),
});

export const purchaseShopListingBodySchema = z.object({
  quantity: z.coerce.number().int().positive(),
});
