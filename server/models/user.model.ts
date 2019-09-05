import { instanceMethod, InstanceType, prop, Typegoose } from "typegoose";
import { CompanyModel } from "./company.model";

export interface UserFields {
  name: string;
}

export class User extends Typegoose implements UserFields {
  @prop({ required: true, index: true })
  name: string;

  @instanceMethod
  async getCompany(this: InstanceType<User>) {
    return await CompanyModel.findOne({ users: this.id });
  }
}

export const UserModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } });
