import { NextFunction, Request, Response } from "express";

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
  return handler(req, res, next).catch(err => next(err));
};
