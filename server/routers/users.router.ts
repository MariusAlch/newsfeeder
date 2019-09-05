import { Router } from "express";
import { InstanceType } from "typegoose";
import { AgentModel } from "../models/agent.model";
import { CompanyModel } from "../models/company.model";
import { User, UserFields, UserModel } from "../models/user.model";
import { usersService } from "../services/users.service";
import { asyncHandler } from "../util/async-handler";
import { logger } from "../util/logger";

export const usersRouter = Router();

usersRouter.get(
  "/",
  asyncHandler(async (_, res) => {
    const users = await UserModel.find({});
    res.json(users);
  }),
);

usersRouter.get(
  "/feed",
  asyncHandler(async (req, res) => {
    logger.info("Getting user feed");
    const { companyId, name } = req.query;

    res.json(await usersService.getUserWidgetInfo(companyId, name));
  }),
);

usersRouter.get(
  "/widget-info",
  asyncHandler(async (req, res) => {
    const { companyId, name } = req.query;
    logger.info("Getting user widget info", { companyId, name });

    res.json(await usersService.getUserWidgetInfo(companyId, name));
  }),
);

usersRouter.get(
  "/posts",
  asyncHandler(async (req, res) => {
    const { companyId, page } = req.query;
    logger.info("Getting company posts", { companyId, page });

    res.json(await usersService.getCompanyPosts(companyId, page));
  }),
);
