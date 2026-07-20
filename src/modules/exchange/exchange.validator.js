// 삭제 후 작업 해주세용
import { z } from "zod";

export const shopListingIdParamSchema = z.object({
  shopListingId: z.string().uuid(),
});

export const exchangeIdParamSchema = z.object({
  exchangeId: z.string().uuid(),
});

export const createExchangeBodySchema = z.object({
  photocardId: z.string().uuid(),
  offeredQuantity: z.coerce.number().int().positive().default(1),
  message: z.string().trim().max(1000).optional(),
});

export const getExchangesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).optional(),
  cursor: z.string().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"]).optional(),
});
