import { email, z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("올바른 이메일 형식이 아닙니다."),
    nickname: z.string().trim().min(2, "닉네임은 2자 이상 입력해 주세요."),
    password: z.string().min(8, "8자 이상 입력해 주세요."),
    passwordConfirm: z.string().min(8, "8자 이상 입력해 주세요."),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("올바른 이메일 형식이 아닙니다."),
    password: z.string().min(1, "비밀번호를 입력해 주세요."),
  }),
});