import SGMail from "@sendgrid/mail";
import { config } from "../util/config";

SGMail.setApiKey(config.sendGridApiKey);

class EmailService {
  sendEmailVerification(email: string, agentId: string) {
    return SGMail.send({
      from: "hello@newsfeeder.io",
      to: email,
      templateId: "d-2a05f96f65f240ba974e6e03d0a24821",
      dynamicTemplateData: {
        verificationUrl: `${config.appUrl}/api/agents/verify/${agentId}`,
      },
    });
  }
}

export const emailService = new EmailService();
