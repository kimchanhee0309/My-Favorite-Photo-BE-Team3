import * as shopListingService from "./shopListing.service.js";
import { successResponse } from "../../common/response/successResponse.js";

export async function getShopListings(req, res) {
  const result = await shopListingService.getShopListings(req.query);

  return successResponse(res, result, "판매글 목록 조회 성공");
}

export async function getShopListingsAllforCount(req, res) {
  const result = await shopListingService.getShopListingsAllforCount();

  return successResponse(
    res,
    result,
    "마켓플레이스 페이지 옵션 개수 조회 성공",
  );
}

export async function getMyShopListings(req, res) {
  const result = await shopListingService.getMyShopListings(
    req.user.id,
    req.query,
  );

  return successResponse(res, result, "나의 판매글 목록 조회 성공");
}

export async function getMyShopListingsAllforCount(req, res) {
  const result = await shopListingService.getMyShopListingsAllforCount(
    req.user.id,
  );

  return successResponse(
    res,
    result,
    "나의 판매 포토카드 페이지 옵션 개수 조회 성공",
  );
}

export async function createShopListing(req, res) {
  const result = await shopListingService.createShopListing(
    req.user.id,
    req.body,
  );

  return successResponse(res, result, "판매글 등록 성공", 201);
}

export async function getShopListing(req, res) {
  const result = await shopListingService.getShopListing(
    req.params.shopListingId,
  );

  return successResponse(res, result, "판매글 상세 조회 성공");
}

export async function updateShopListing(req, res) {
  const result = await shopListingService.updateShopListing(
    req.user.id,
    req.params.shopListingId,
    req.body,
  );

  return successResponse(res, result, "판매글 수정 성공");
}

export async function deleteShopListing(req, res) {
  const result = await shopListingService.deleteShopListing(
    req.user.id,
    req.params.shopListingId,
  );

  return successResponse(res, result, "판매글 판매 내리기 성공");
}

export async function purchaseShopListing(req, res) {
  const result = await shopListingService.purchaseShopListing(
    req.user.id,
    req.params.shopListingId,
    req.body.quantity,
  );

  return successResponse(res, result, "포토카드 구매 성공");
}

export async function getShopListingExchanges(req, res) {
  const result = await shopListingService.getShopListingExchanges(
    req.user.id,
    req.params.shopListingId,
  );

  return successResponse(res, result, "교환 제안 목록 조회 성공");
}
