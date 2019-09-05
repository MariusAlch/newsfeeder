import { arrayProp, prop, Ref, Typegoose } from "typegoose";
import { PlanType } from "../../shared/data.model";
import { Agent } from "./agent.model";
import { Post } from "./post.model";
import { User } from "./user.model";

export interface WidgetFields {
  color: string;
  position: string;
}

export class Widget extends Typegoose implements WidgetFields {
  @prop({ required: true })
  color: string;
  @prop({ required: true, default: "right" })
  position: string;
}

export interface CompanyFields {
  agents: any[];
  posts: any[];
  users: any[];
  widget: WidgetFields;
  planType: string;
  stripeCustomerId?: string;
}

export class Company extends Typegoose implements CompanyFields {
  @prop({ required: true })
  widget: Widget;

  @prop({ required: true })
  planType: string;

  @prop({ required: false })
  stripeCustomerId: string;

  @arrayProp({ itemsRef: { name: "Agent" } })
  agents: Array<Ref<Agent>>;

  @arrayProp({ itemsRef: { name: "Post" } })
  posts: Array<Ref<Post>>;

  @arrayProp({ itemsRef: { name: "User" } })
  users: Array<Ref<User>>;
}

export const CompanyModel = new Company().getModelForClass(Company, { schemaOptions: { timestamps: true } });
