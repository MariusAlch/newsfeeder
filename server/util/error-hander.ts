import express from "express";
import { ClientError } from "./error";
import { logger } from "./logger";

export const errorHandler = (err, _1: express.Request, res: express.Response, _2: express.NextFunction) => {
  const isClientError = err instanceof ClientError;
  const statusCode = isClientError ? 400 : 500;
  const message = err && err.message ? err.message : "Something unexpected happened...";

  if (!isClientError) {
    logger.error("Internal error", err);
  } else {
    logger.error("Client error", err);
  }

  res.status(statusCode).json({
    message,
  });
};
