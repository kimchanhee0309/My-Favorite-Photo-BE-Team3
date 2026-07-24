import * as authService from "./auth.service.js";
import { successResponse } from "../../common/response/successResponse.js";

export async function signup(req, res) {
  const result = await authService.signup(req.body);

  return successResponse(res, result, "회원가입 성공", 201);
}