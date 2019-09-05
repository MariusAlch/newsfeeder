import moment from "moment";
import { PostFields, PostModel } from "../models/post.model";
import { agentsService } from "../services/agents.service";
import { logger } from "./logger";

export async function seed() {
  logger.info("Seeding the db");

  const agent = await agentsService.registerAgent("demo@demo.com", "demo@demo.com");
  const company = await agent.getCompany();

  const postFields: PostFields = {
    title: "Seed post Title",
    feedbacks: [],
    scheduledDate: moment.utc(0).toDate(),
    content: "Seed post content ".repeat(10),
  };
  const post = new PostModel(postFields);
  await post.save();
  company.posts.push(post);

  await company.save();
}
