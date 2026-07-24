import * as authService from "./auth.service.js";
import { successResponse } from "../../common/response/successResponse.js";

export async function signup(req, res) {
  const result = await authService.signup(req.body);

  return successResponse(res, result, "회원가입 성공", 201);
}

export async function login(req, res) {
  const { user, token } = await authService.login(req.body);

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return successResponse(res, user, "로그인 성공", 200);
}