import { ERROR_CODE } from "../errors/errorCode.js";

export const errorMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const code = error.code || ERROR_CODE.INTERNAL_SERVER_ERROR;

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || "서버 오류가 발생했습니다.",
    code,
  });
};
