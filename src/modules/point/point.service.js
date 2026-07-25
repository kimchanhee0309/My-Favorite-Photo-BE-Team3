import { AppError } from "../../common/errors/AppError.js";
import { ERROR_CODE } from "../../common/errors/errorCode.js";
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
  const user = await pointRepository.findPointById(userId);

  if (!user) {
    throw new AppError(
      "해당 유저를 찾을 수 없습니다.",
      404,
      ERROR_CODE.NOT_FOUND,
    );
  }

  if (user.lastBoxClaimedAt) {
    const now = new Date();
    const timeGap = now - new Date(user.lastBoxClaimedAt);
    const COOLDOWN_MS = 60 * 60 * 1000;

    if (timeGap < COOLDOWN_MS) {
      throw new AppError(
        "아직 1시간이 지나지 않았습니다.",
        400,
        ERROR_CODE.BAD_REQUEST,
      );
    }
  }

  const minPoint = 100;
  const maxPoint = 3000;
  const acquiredPoint = Math.floor(
    Math.random() * (maxPoint - minPoint + 1) + minPoint,
  );

  const updatedUser = await pointRepository.updateUserPointsAndBoxTime(
    userId,
    acquiredPoint,
  );

  return {
    acquiredPoint,
    totalPoints: updatedUser.points,
    lastBoxClaimedAt: updatedUser.lastBoxClaimedAt,
  };
}
