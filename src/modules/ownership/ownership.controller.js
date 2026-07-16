import * as ownershipService from "./ownership.service.js";
import { successResponse } from "../../common/response/successResponse.js";

export async function getMyOwnerships(req, res) {
  const result = await ownershipService.getMyOwnerships(req.user.id, req.query);

  return successResponse(res, result, "내 보유 카드 목록 조회 성공");
}

export async function getOwnership(req, res) {
  const result = await ownershipService.getOwnership(
    req.user.id,
    req.params.ownershipId,
  );

  return successResponse(res, result, "내 보유 카드 상세 조회 성공");
}
