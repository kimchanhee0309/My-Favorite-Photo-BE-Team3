import { successResponse } from "../../common/response/successResponse.js";
import * as pointService from "./point.service.js";

export async function getPointsMe(req, res) {
  const userId = req.user.id;

  const user = await pointService.getUserPointInfo(userId);

  return successResponse(res, user, "포인트 조회 성공");
}

export async function claimRandomBox(req, res) {
  const userId = req.user.id;

  const point = await pointService.claimRandomBox(userId);

  return successResponse(res, point, "포인트 획득 성공");
}
