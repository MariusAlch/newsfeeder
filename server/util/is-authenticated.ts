import express from "express";

export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!!req.user) {
    return next();
  }

  res.status(401).send();
};
