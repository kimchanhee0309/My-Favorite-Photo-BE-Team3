import * as authService from "./auth.service.js";
import { successResponse } from "../../common/response/successResponse.js";

export async function signup(req, res) {
  const result = await authService.signup(req.body);

  return successResponse(res, result, "회원가입 성공", 201);
}

export async function login(req, res) {
  const { user, token } = await authService.login(req.body);

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return successResponse(res, user, "로그인 성공", 200);
}

export async function getMe(req, res) {
  const user = await authService.getMe(req.user.id);

  return successResponse(res, user, "내 정보 조회 성공", 200);
}

export async function logout(req, res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
  });

  return successResponse(res, null, "로그아웃 성공", 200);
}

export function googleLogin(req, res) {
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
  
  res.redirect(url);
}

export async function googleCallback(req, res) {
  const { code, error } = req.query;
  
  if (error || !code) {
    return res.redirect("http://localhost:3000/login?error=google_cancelled");
  }

  const { token } = await authService.googleCallback(code);

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect("http://localhost:3000/"); 
}