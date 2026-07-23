export function successResponse(
  res,
  data = null,
  message = "요청에 성공했습니다.",
  statusCode = 200,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
