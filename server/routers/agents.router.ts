import { Router } from "express";
import passport from "passport";
import * as yup from "yup";
import { AgentModel } from "../models/agent.model";
import { Widget } from "../models/company.model";
import { agentsService } from "../services/agents.service";
import { emailService } from "../services/email.service";
import { paymentService } from "../services/payment.service";
import { asyncHandler } from "../util/async-handler";
import { config } from "../util/config";
import { ClientError } from "../util/error";
import { isAuthenticated } from "../util/is-authenticated";
import { validator } from "../util/validator";

export const agentsRouter = Router();

agentsRouter.post(
  "/register",
  validator(req =>
    yup
      .object()
      .shape({
        email: yup
          .string()
          .required()
          .strict(true),
        password: yup
          .string()
          .required()
          .strict(true),
      })
      .validate(req.body),
  ),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const agent = await agentsService.registerAgent(email, password);

    req.logIn(agent, err => {
      if (err) {
        throw new ClientError(err);
      }
      res.send("OK");
    });
  }),
);

agentsRouter.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: "Wrong credentials" });
      }
      req.logIn(user, error => {
        if (error) {
          return next(error);
        }
        res.json("OK");
      });
    })(req, res, next);
  }),
);

agentsRouter.post(
  "/logout",
  asyncHandler(async (req, res) => {
    req.logout();
    res.json("OK");
  }),
);

agentsRouter.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.json({ agent: req.user, company: undefined });
    }
    const company = await req.user.getCompany();

    res.json({ agent: req.user, company });
  }),
);

agentsRouter.post(
  "/customize-widget",
  asyncHandler(async (req, res) => {
    const { color, position } = req.body;

    const company = await req.user.getCompany();

    const widget = new Widget();
    widget.color = color;
    widget.position = position;
    company.widget = widget;
    await company.save();

    res.json("OK");
  }),
);

agentsRouter.get(
  "/me",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    res.json(req.user);
  }),
);

agentsRouter.post(
  "/purchase-subscription",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    const company = await req.user.getCompany();
    await paymentService.createSubscription(company, req.user, token);

    res.json("OK");
  }),
);

agentsRouter.post(
  "/cancel-subscription",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const company = await req.user.getCompany();
    await paymentService.cancelSubscription(company);

    res.json("OK");
  }),
);

agentsRouter.post(
  "/upgrade-subscription",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const company = await req.user.getCompany();
    const success = await paymentService.upgradeSubscription(company);

    res.json({ action: success ? "none" : "payment" });
  }),
);

agentsRouter.get(
  "/subscription",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const company = await req.user.getCompany();
    const subscription = await paymentService.getActiveSubscription(company);

    res.json(subscription);
  }),
);

agentsRouter.get(
  "/verify/:agentId",
  asyncHandler(async (req, res) => {
    const { agentId } = req.params;
    const user = await AgentModel.findById(agentId);

    if (!user) {
      res.redirect(`${config.appUrl}`);
    }

    user.verified = true;
    await user.save();

    res.redirect("/announcements");
  }),
);

agentsRouter.post(
  "/verify/resend",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    if (req.user.verified) {
      throw new ClientError("Agent already verified");
    }
    await emailService.sendEmailVerification(req.user.email, req.user.id);

    res.json("OK");
  }),
);
