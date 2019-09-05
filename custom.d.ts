import { InstanceType } from "typegoose";
import { Agent } from "./server/models/agent.model";

declare global {
  namespace Express {
    interface Request {
      user: InstanceType<Agent>;
    }
  }
}
