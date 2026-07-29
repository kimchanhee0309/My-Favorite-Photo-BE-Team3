import { z } from "zod";

export const updateUserSchema = z.object({
  body: z.object({
    nickname: z.string().trim().min(2, "닉네임은 2자 이상 입력해 주세요."),
  }),
});