import * as exchangeService from "./exchange.service.js";
import { successResponse } from "../../common/response/successResponse.js";

export async function createExchange(req, res) {
  const result = await exchangeService.createExchange(
    req.user.id,
    req.params.shopListingId,
    req.body,
  );

  return successResponse(res, result, "교환 제안 생성 성공", 201);
}

export async function getSentExchanges(req, res) {
  const result = await exchangeService.getSentExchanges(req.user.id, req.query);

  return successResponse(res, result, "보낸 교환 제안 목록 조회 성공");
}

export async function getReceivedExchanges(req, res) {
  const result = await exchangeService.getReceivedExchanges(
    req.user.id,
    req.query,
  );

  return successResponse(res, result, "받은 교환 제안 목록 조회 성공");
}

export async function acceptExchange(req, res) {
  const result = await exchangeService.acceptExchange(
    req.user.id,
    req.params.exchangeId,
  );

  return successResponse(res, result, "교환 제안 승인 성공");
}

export async function rejectExchange(req, res) {
  const result = await exchangeService.rejectExchange(
    req.user.id,
    req.params.exchangeId,
  );

  return successResponse(res, result, "교환 제안 거절 성공");
}

export async function cancelExchange(req, res) {
  const result = await exchangeService.cancelExchange(
    req.user.id,
    req.params.exchangeId,
  );

  return successResponse(res, result, "교환 제안 취소 성공");
}
