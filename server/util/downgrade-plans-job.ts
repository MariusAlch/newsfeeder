import { InstanceType } from "typegoose";
import { Company, CompanyModel } from "../models/company.model";
import { paymentService } from "../services/payment.service";
import { logger } from "./logger";

export async function downgradePlansJob() {
  logger.info("Starting downgrade plans");
  const upgradedCompanies: Array<InstanceType<Company>> = await CompanyModel.where("planType")
    .equals("growth")
    .where("email")
    .ne("demo@demo.com")
    .exec();

  for (const company of upgradedCompanies) {
    const sub = await paymentService.getActiveSubscription(company);
    if (sub.status === "active" || sub.status === "trialing") {
      break;
    }

    logger.info("Downgrading plan", { companyId: company.id });
    company.planType = "start";
    await company.save();
  }
}
