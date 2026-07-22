import { z } from "zod";

const exchangeStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
]);

export const createExchangeSchema = z.object({
  params: z.object({
    shopListingId: z.string().uuid(),
  }),
  body: z.object({
    photocardId: z.string().uuid(),
    offeredQuantity: z.coerce.number().int().positive().default(1),
    message: z.string().trim().max(1000).optional(),
  }),
});

export const getExchangesSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().positive().max(50).optional(),
    cursor: z.string().optional(),
    status: exchangeStatusSchema.optional(),
  }),
});

export const updateExchangeStatusSchema = z.object({
  params: z.object({
    exchangeId: z.string().uuid(),
  }),
});
