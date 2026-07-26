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

export const getShopListingsSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().positive().max(50).optional(),
    cursor: z.string().optional(),
    search: z.string().trim().optional(),
    grade: cardGradeSchema.optional(),
    genre: cardGenreSchema.optional(),
    status: listingStatusSchema.optional(),
    saleType: z.enum(["SALE", "EXCHANGE"]).optional(),
    sort: z.enum(["latest", "oldest", "price_asc", "price_desc"]).optional(),
  }),
});

export const createShopListingSchema = z.object({
  body: z.object({
    ownershipId: z.string().uuid(),
    quantity: z.coerce.number().int().positive(),
    pricePerUnit: z.coerce.number().int().positive(),
    wishGrade: cardGradeSchema.optional(),
    wishGenre: cardGenreSchema.optional(),
    wishDescription: z.string().trim().max(1000).optional(),
  }),
});

export const getShopListingSchema = z.object({
  params: z.object({
    shopListingId: z.string().uuid(),
  }),
});

export const updateShopListingSchema = z.object({
  params: z.object({
    shopListingId: z.string().uuid(),
  }),
  body: z.object({
    pricePerUnit: z.coerce.number().int().positive().optional(),
    wishGrade: cardGradeSchema.optional(),
    wishGenre: cardGenreSchema.optional(),
    wishDescription: z.string().trim().max(1000).optional(),
  }),
});

export const deleteShopListingSchema = z.object({
  params: z.object({
    shopListingId: z.string().uuid(),
  }),
});

export const purchaseShopListingSchema = z.object({
  params: z.object({
    shopListingId: z.string().uuid(),
  }),
  body: z.object({
    quantity: z.coerce.number().int().positive(),
  }),
});

export const getShopListingExchangesSchema = z.object({
  params: z.object({
    shopListingId: z.string().uuid(),
  }),
});
