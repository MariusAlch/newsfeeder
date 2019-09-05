import moment from "moment";
import { InstanceType } from "typegoose";
import { AgentFields, AgentModel } from "../models/agent.model";
import { Company, CompanyFields, CompanyModel } from "../models/company.model";
import { Post, PostFields, PostModel } from "../models/post.model";
import { ClientError } from "../util/error";
import { cryptographyService } from "./cryptography.service";
import { emailService } from "./email.service";

class AgentsService {
  async registerAgent(email: string, password: string) {
    const lowerCaseEmail = (email as string).toLowerCase();
    const duplicateAgent = await AgentModel.findOne({ email: lowerCaseEmail });

    if (!!duplicateAgent) {
      throw new ClientError("Email already exists");
    }

    const passhash = cryptographyService.createHash(password);
    const agentFields: AgentFields = {
      email: lowerCaseEmail,
      passhash,
      verified: false,
    };

    const companyFields: CompanyFields = {
      agents: [],
      posts: [],
      users: [],
      widget: { color: "#3d4bdc", position: "left" },
      planType: "start",
    };
    const company = new CompanyModel(companyFields);

    const post = await this.getInitialPost().save();
    company.posts.push(post);

    const agent = await new AgentModel(agentFields).save();
    company.agents.push(agent);

    await company.save();

    emailService.sendEmailVerification(agent.email, agent.id);

    return agent;
  }

  getInitialPost() {
    const fields: PostFields = {
      title: "Two steps away from the start!⚡⚡⚡",
      content: `<p>Our team is happy and humbled to see you here.</p><p>You are 2 steps away from a beautifully designed newsfeed powered with fancy widgets and email notifications.</p><p><br /></p><p><strong>Step 1 - Create a Post: </strong></p><p>Write down your first post! To do it go to <a href=\"https://www.newsfeeder.io/post-editor\" target=\"_blank\">Create Post</a>.</p><p><br /></p><p><strong>Step 2 - Create a Widget:</strong></p><p>Set up a fancy widget without any coding. Go to <a href=\"https://www.newsfeeder.io/settings/widget\" target=\"_blank\">Settings &gt; Widget</a>. Play around with different combinations of style and positions</p>`,
      scheduledDate: moment().toDate(),
      feedbacks: [],
    };
    const post = new PostModel(fields);
    return post;
  }

  async getSearchPosts(company: InstanceType<Company>, page: number) {
    const pageLength = 5;

    await company
      .populate({
        path: "posts",
        populate: { path: "feedbacks" },
      })
      .execPopulate();

    const posts = (company.posts as Array<InstanceType<Post>>)
      .sort((a, b) => moment(b.scheduledDate).valueOf() - moment(a.scheduledDate).valueOf())
      .filter((_, i) => {
        const lowerBound = page * pageLength;
        const upperBound = (page + 1) * pageLength;
        return i >= lowerBound && i < upperBound;
      });

    return posts;
  }
}

export const agentsService = new AgentsService();
