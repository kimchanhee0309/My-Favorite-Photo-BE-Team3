import { AppError } from "../errors/AppError.js";
import { ERROR_CODE } from "../errors/errorCode.js";
import { verifyAccessToken } from "../../lib/jwt.js";

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  const token = authorization?.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : req.cookies?.accessToken;

  if (!token) {
    return next(
      new AppError("로그인이 필요합니다.", 401, ERROR_CODE.UNAUTHORIZED),
    );
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.id,
      email: payload.email,
      nickname: payload.nickname,
    };

    next();
  } catch (error) {
    return next(
      new AppError("유효하지 않은 토큰입니다.", 401, ERROR_CODE.UNAUTHORIZED),
    );
  }
};
