import express from "express";
import { paymentService } from "../services/payment.service";
import { asyncHandler } from "./async-handler";

export const stripeHookHandler = asyncHandler(async (req: express.Request, res: express.Response) => {
  if (req.body.type !== "customer.subscription.deleted") {
    return res.json("No hook handler");
  }

  await paymentService.downgradeSubscription(req.body.data.object.customer);

  res.json("OK");
});
