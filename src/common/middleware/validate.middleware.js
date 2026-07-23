import { ZodError } from "zod";

import { AppError } from "../errors/AppError.js";
import { ERROR_CODE } from "../errors/errorCode.js";

const formatZodError = (error) => {
  return error.issues
    .map((issue) => {
      const path = issue.path.join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join(", ");
};

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (validatedData.body) {
        req.body = validatedData.body;
      }

      /* if (validatedData.query) {
        req.query = validatedData.query;
      } */

      if (validatedData.params) {
        req.params = validatedData.params;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(formatZodError(error), 400, ERROR_CODE.VALIDATION_ERROR),
        );
      }

      next(error);
    }
  };
};
