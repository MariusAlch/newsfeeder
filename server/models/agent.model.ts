import { instanceMethod, InstanceType, prop, Typegoose } from "typegoose";
import { CompanyModel } from "./company.model";

export interface AgentFields {
  email: string;
  passhash: string;
  verified?: boolean;
}

export class Agent extends Typegoose implements AgentFields {
  @prop({ required: true, index: true })
  email: string;

  @prop({ required: true })
  passhash: string;

  @prop({ default: false })
  verified: boolean;

  @instanceMethod
  public getCompany(this: InstanceType<Agent>) {
    return CompanyModel.findOne({ agents: this.id });
  }
}
export const AgentModel = new Agent().getModelForClass(Agent, { schemaOptions: { timestamps: true } });
