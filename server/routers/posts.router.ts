import { Router } from "express";
import Grid from "gridfs-stream";
import moment from "moment";
import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";
import { InstanceType } from "typegoose";
import { Post, PostFields, PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";
import { agentsService } from "../services/agents.service";
import { usersService } from "../services/users.service";
import { asyncHandler } from "../util/async-handler";
import { logger } from "../util/logger";
import { upload } from "../util/upload";

interface File {
  _id: string;
  length: number;
  chunkSize: number;
  uploadDate: string;
  filename: string;
  md5: string;
  contentType: string;
}

function sanitizeContent(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: [
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "p",
      "a",
      "ul",
      "ol",
      "nl",
      "li",
      "b",
      "i",
      "strong",
      "em",
      "strike",
      "code",
      "hr",
      "br",
      "div",
      "table",
      "thead",
      "caption",
      "tbody",
      "tr",
      "th",
      "td",
      "pre",
      "iframe",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "name", "target"],
      img: ["src", "width", "height"],
      iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
    },
  });
}

export const postsRouter = Router();

postsRouter.post(
  "/rating",
  asyncHandler(async (req, res) => {
    const { value, name, postId } = req.body;
    logger.info("Rating a post", { value, name, postId });

    const user = await UserModel.findOne({ name });
    await usersService.updateOrCreateFeedback(user, postId, { value });
    const company = await user.getCompany();

    return res.json(await usersService.getUserWidgetInfo(company.id, name));
  }),
);

postsRouter.post(
  "/comment",
  asyncHandler(async (req, res) => {
    const { text, name, postId } = req.body;
    logger.info("Commenting a post", { text, name, postId });

    const user = await UserModel.findOne({ name });
    await usersService.updateOrCreateFeedback(user, postId, { text });

    return res.json("OK");
  }),
);

postsRouter.post(
  "/upload",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    res.json(`/api/posts/image/${req.file.filename}`);
  }),
);

postsRouter.get(
  "/image/:filename",
  asyncHandler(async (req, res) => {
    const gfs = Grid(mongoose.connection.db, mongoose.mongo);
    const file: File = await gfs.files.findOne({ filename: req.param("filename") });

    res.set("content-type", file.contentType);
    res.set("accept-ranges", "bytes");

    const downloadStream = gfs.createReadStream(file.filename);

    downloadStream.on("data", chunk => {
      res.write(chunk);
    });

    downloadStream.on("error", () => {
      res.sendStatus(404);
    });

    downloadStream.on("end", () => {
      res.end();
    });
  }),
);
postsRouter.post(
  "/delete",
  asyncHandler(async (req, res) => {
    const { postId } = req.body;

    await PostModel.deleteOne({ _id: postId });
    const company = await req.user.getCompany();
    await company.updateOne({ _id: company.id }, { $pull: { posts: postId } });

    res.json("OK");
  }),
);

postsRouter.post(
  "/create",
  // update
  asyncHandler(async (req, res, next) => {
    const { title, content, postId, scheduledDate } = req.body;

    if (!postId) {
      return next();
    }

    const post = (await req.user.getCompany().populate("posts")).posts.find(
      p => (p as InstanceType<Post>).id.toString() === postId.toString(),
    ) as InstanceType<Post>;
    if (!post) {
      return next();
    }

    post.title = title;
    post.scheduledDate = moment(scheduledDate).toDate();
    post.content = sanitizeContent(content);
    await post.save();

    res.json("OK");
  }),
  // create
  asyncHandler(async (req, res) => {
    const { title, content, scheduledDate } = req.body;

    const company = await req.user.getCompany();
    const postFields: PostFields = {
      title,
      feedbacks: [],
      scheduledDate: moment(scheduledDate).toDate(),
      content: sanitizeContent(content),
    };

    const post = await new PostModel(postFields).save();
    company.posts.push(post);
    await company.save();

    res.json("OK");
  }),
);

postsRouter.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { page } = req.query;
    const company = await req.user.getCompany();

    res.json(await agentsService.getSearchPosts(company, page));
  }),
);
postsRouter.get(
  "/post",
  asyncHandler(async (req, res) => {
    const { postId } = req.query;
    const post = await PostModel.findById(postId).populate({ path: "feedbacks", populate: { path: "user" } });

    res.json(post);
  }),
);
