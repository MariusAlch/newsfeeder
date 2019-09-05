import { prop, Ref, Typegoose } from "typegoose";
import { Post } from "../../shared/data.model";
import { User } from "./user.model";

export interface FeedbackFields {
  text?: string;
  value?: number;
  user: any;
  post: any;
}

export class Feedback extends Typegoose implements FeedbackFields {
  @prop({ required: false })
  value: number;

  @prop({ required: false })
  text: string;

  @prop({ ref: "User", required: true })
  user: Ref<User>;

  @prop({ ref: "Post", required: true })
  post: Ref<Post>;
}

export const FeedbackModel = new Feedback().getModelForClass(Feedback, { schemaOptions: { timestamps: true } });
