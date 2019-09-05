import { arrayProp, prop, Ref, Typegoose } from "typegoose";
import { Feedback } from "./feedback.model";

export interface PostFields {
  title: string;
  content: string;
  scheduledDate: Date;
  feedbacks: any[];
}

export class Post extends Typegoose implements PostFields {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  content: string;

  @prop({ required: true })
  scheduledDate: Date;

  @arrayProp({ itemsRef: { name: "Feedback" }, default: [] })
  feedbacks: Array<Ref<Feedback>>;
}

export const PostModel = new Post().getModelForClass(Post, { schemaOptions: { timestamps: true } });
