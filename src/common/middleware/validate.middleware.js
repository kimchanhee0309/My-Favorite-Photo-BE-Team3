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

const validate = (target, schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req[target]);
      req[target] = validatedData;
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

export const validateBody = (schema) => validate("body", schema);
export const validateQuery = (schema) => validate("query", schema);
export const validateParams = (schema) => validate("params", schema);
