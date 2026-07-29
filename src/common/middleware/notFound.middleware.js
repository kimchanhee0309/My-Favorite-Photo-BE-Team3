import { AppError } from "../errors/AppError.js";
import { ERROR_CODE } from "../errors/errorCode.js";

export const notFoundMiddleware = (req, res, next) => {
  next(
    new AppError(
      `요청한 경로를 찾을 수 없습니다: ${req.method} ${req.originalUrl}`,
      404,
      ERROR_CODE.NOT_FOUND,
    ),
  );
};
