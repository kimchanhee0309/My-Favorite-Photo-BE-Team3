import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";
import { COOLDOWN_MS, MAX_POINT, MIN_POINT } from "./constant.js";
import * as pointRepository from "./point.repository.js";

export async function getUserPointInfo(userId) {
  const user = await pointRepository.findPointById(userId);

  if (!user) {
    throw new AppError(
      "해당 유저를 찾을 수 없습니다.",
      404,
      ERROR_CODE.NOT_FOUND,
    );
  }

  return user;
}

export async function claimRandomBox(userId) {
  const now = new Date();
  const cooldownThreshold = new Date(now.getTime() - COOLDOWN_MS);

  const acquiredPoint = Math.floor(
    Math.random() * (MAX_POINT - MIN_POINT + 1) + MIN_POINT,
  );

  const result = await pointRepository.updateUserPointsAndBoxTime(
    userId,
    acquiredPoint,
    cooldownThreshold,
    now,
  );

  if (result.count === 0) {
    const user = await pointRepository.findPointById(userId);

    if (!user) {
      throw new AppError(
        "해당 유저를 찾을 수 없습니다.",
        404,
        ERROR_CODE.NOT_FOUND,
      );
    }

    throw new AppError(
      "아직 1시간이 지나지 않았습니다.",
      400,
      ERROR_CODE.BAD_REQUEST,
    );
  }

  const updatedUser = await pointRepository.findPointById(userId);

  return {
    acquiredPoint,
    totalPoints: updatedUser.points,
    lastBoxClaimedAt: updatedUser.lastBoxClaimedAt,
  };
}
