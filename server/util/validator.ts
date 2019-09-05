import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./async-handler";
import { ClientError } from "./error";

export const validator = (cb: (req: Request) => Promise<unknown>) =>
  asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
    try {
      await cb(req);
    } catch (e) {
      throw new ClientError(e.message);
    }

    next();
  });
