import * as photocardService from "./photocard.service.js";
import { successResponse } from "../../common/response/successResponse.js";

export async function createPhotocard(req, res) {
  const result = await photocardService.createPhotocard(req.user.id, req.body);

  return successResponse(res, result, "포토카드 생성 성공", 201);
}

export async function getMyPhotocards(req, res) {
  const result = await photocardService.getMyPhotocards(req.user.id, req.query);

  return successResponse(res, result, "내가 생성한 포토카드 목록 조회 성공");
}

export async function getPhotocard(req, res) {
  const result = await photocardService.getPhotocard(req.params.photocardId);

  return successResponse(res, result, "포토카드 상세 조회 성공");
}
