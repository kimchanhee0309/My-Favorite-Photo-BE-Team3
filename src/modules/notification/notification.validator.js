import { z } from "zod";

export const getNotificationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(50).default(20),
    isRead: z
      .enum(["true", "false"])
      .optional()
      .transform((val) => (val === undefined ? undefined : val === "true")),
  }),
});

export const readNotificationSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "유효하지 않은 알림 ID 형식입니다." }),
  }),
});
