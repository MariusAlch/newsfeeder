import moment from "moment";
import { InstanceType } from "typegoose";
import { AgentModel } from "../models/agent.model";
import { CompanyModel } from "../models/company.model";
import { Feedback, FeedbackFields, FeedbackModel } from "../models/feedback.model";
import { Post, PostModel } from "../models/post.model";
import { User, UserFields, UserModel } from "../models/user.model";
import { logger } from "../util/logger";

class UsersService {
  async updateOrCreateFeedback(
    user: InstanceType<User>,
    postId: string,
    feedbackValues: { value?: number; text?: string },
  ) {
    const post = await PostModel.findById(postId).populate("feedbacks");

    const feedback = post.feedbacks.find(
      (fb: InstanceType<Feedback>) => fb.user.toString() === user.id,
    ) as InstanceType<Feedback>;

    if (!!feedback) {
      Object.assign(feedback, feedbackValues);
      return await feedback.save();
    }

    logger.info("Creating new feedback");
    const feedbackFields: FeedbackFields = {
      user,
      post,
      ...feedbackValues,
    };
    const newFeedback = await new FeedbackModel(feedbackFields).save();
    post.feedbacks.push(newFeedback);
    await post.save();
  }

  async getOrCreateUser(companyId: string, name: string) {
    const company =
      companyId === "demo" || companyId.length !== 24
        ? await CompanyModel.findOne({ agents: (await AgentModel.findOne({ email: "demo@demo.com" }))._id })
        : await CompanyModel.findById(companyId);

    await company
      .populate("users")
      .populate("posts")
      .execPopulate();

    const user = company.users.find((u: InstanceType<User>) => u.name === name) as InstanceType<User>;

    company.depopulate("users");
    company.depopulate("posts");

    if (!!user) {
      return { company, user };
    }

    const userFields: UserFields = {
      name,
    };
    const newUser = await new UserModel(userFields).save();
    company.users.push(newUser);
    await company.save();

    return { company, user: newUser };
  }

  async getUserWidgetInfo(companyId: string, name: string) {
    const { company, user } = await this.getOrCreateUser(companyId, name);

    const feedbacks = await FeedbackModel.find({ user: user._id });

    return { feedbacks, company, user };
  }

  async getCompanyPosts(companyId: string, page: number) {
    const pageLength = 5;

    const company =
      companyId === "demo" || companyId.length !== 24
        ? await CompanyModel.findOne({ agents: (await AgentModel.findOne({ email: "demo@demo.com" }))._id })
        : await CompanyModel.findById(companyId);

    await company.populate("posts").execPopulate();

    const posts = (company.posts as Array<InstanceType<Post>>)
      .filter(post => moment(post.scheduledDate).isBefore(moment()))
      .sort((a, b) => moment(b.scheduledDate).valueOf() - moment(a.scheduledDate).valueOf())
      .filter((_, i) => {
        const lowerBound = page * pageLength;
        const upperBound = (page + 1) * pageLength;
        return i >= lowerBound && i < upperBound;
      });

    return posts;
  }
}

export const usersService = new UsersService();
