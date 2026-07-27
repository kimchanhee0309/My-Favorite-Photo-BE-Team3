import * as userService from "./user.service.js";
import { successResponse } from "../../common/response/successResponse.js";

export async function updateMe(req, res) {
  const result = await userService.updateMe(req.user.id, req.body);

  return successResponse(res, result, "유저 정보 수정 성공", 200);
}