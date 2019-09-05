import STRIPE from "stripe";
import { InstanceType } from "typegoose";
import { Agent } from "../models/agent.model";
import { Company, CompanyModel } from "../models/company.model";
import { logger } from "../util/logger";

class PaymentService {
  stripe = new STRIPE(process.env.NODE_ENV === "production" ? "" : "");

  async getActiveSubscription(company: InstanceType<Company>) {
    if (!company.stripeCustomerId) {
      return null;
    }

    const customer = await this.stripe.customers.retrieve(company.stripeCustomerId);
    const subscription = customer.subscriptions.data[0];
    if (!subscription) {
      return null;
    }

    return subscription;
  }

  async downgradeSubscription(stripeCustomerId: string) {
    logger.info("Downgrading subscription", { stripeCustomerId });
    const company = await CompanyModel.findOne({ stripeCustomerId });
    if (!company) {
      throw new Error("No company found with such stripeCustomerId");
    }

    company.planType = "start";
    await company.save();
  }

  async cancelSubscription(company: InstanceType<Company>) {
    if (!company.stripeCustomerId) {
      throw new Error("Company doesn't have stripe customer id");
    }

    const customer = await this.stripe.customers.retrieve(company.stripeCustomerId);

    // "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid";
    const activeSubscriptions = customer.subscriptions.data.filter(_ =>
      ["trialing", "active", "past_due", "unpaid"].includes(_.status),
    );

    if (activeSubscriptions.length === 0) {
      throw new Error("Company doesn't have active subscription");
    }

    await this.stripe.subscriptions.update(activeSubscriptions[0].id, { cancel_at_period_end: true });

    company.planType = "start";
    await company.save();
  }

  async createSubscription(company: InstanceType<Company>, agent: InstanceType<Agent>, token: STRIPE.tokens.IToken) {
    let customer: STRIPE.customers.ICustomer;

    if (!company.stripeCustomerId) {
      customer = await this.stripe.customers.create({ email: agent.email, source: token.id });
      company.stripeCustomerId = customer.id;
      await company.save();
    } else {
      customer = await this.stripe.customers.retrieve(company.stripeCustomerId);
    }

    const plans = await this.stripe.plans.list();
    const plan = plans.data.find(_ => _.nickname === "growth");

    if (!plan) {
      throw Error("Plan not found");
    }

    const subscription = customer.subscriptions.data[0];
    if (!!subscription) {
      await this.stripe.subscriptions.update(subscription.id, { cancel_at_period_end: false });
      company.planType = "growth";
      await company.save();
      return;
    }

    await this.stripe.subscriptions.create({
      customer: company.stripeCustomerId,
      items: [{ plan: plan.id }],
      trial_from_plan: true,
    });

    company.planType = "growth";
    await company.save();
  }

  async upgradeSubscription(company: InstanceType<Company>) {
    const subscription = await this.getActiveSubscription(company);
    if (!subscription) {
      return false;
    }

    await this.stripe.subscriptions.update(subscription.id, { cancel_at_period_end: false });
    company.planType = "growth";
    await company.save();

    return true;
  }
}

export const paymentService = new PaymentService();
