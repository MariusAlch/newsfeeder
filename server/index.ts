/// <reference path="../custom.d.ts" />
import "core-js";

import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import compression from "compression";
import connectMongo from "connect-mongo";
import cors from "cors";
import { CronJob } from "cron";
import express from "express";
import expressSession from "express-session";
import helmet from "helmet";
import http from "http";
import mongoose from "mongoose";
import morgan from "morgan";
import next from "next";
import SocketIO from "socket.io";
import { AgentModel } from "./models/agent.model";
import { applyPassport } from "./passport";
import { agentsRouter } from "./routers/agents.router";
import { postsRouter } from "./routers/posts.router";
import { usersRouter } from "./routers/users.router";
import { socketService } from "./services/socket.service";
import { config } from "./util/config";
import { downgradePlansJob } from "./util/downgrade-plans-job";
import { errorHandler } from "./util/error-hander";
import { logger } from "./util/logger";
import { seed } from "./util/seed";
import { stripeHookHandler } from "./util/stripe-hook-handler";

if (process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: "https://2c4b56212189488a9c187d25d739a19c@sentry.io/1516501" });
}

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const handle = nextApp.getRequestHandler();

let io: SocketIO.Server = null;

export function getSocketServer() {
  return io;
}

Promise.all([nextApp.prepare(), mongoose.connect(config.mongoUri, { useNewUrlParser: true })]).then(async () => {
  const app = express();
  const server = new http.Server(app);
  io = SocketIO(server);
  socketService.init();

  app.use(Sentry.Handlers.requestHandler());
  app.use(helmet({}));
  app.use(cors({ origin: "*" }));
  app.use(compression());
  app.use(morgan(process.env.NODE_ENV === "production" ? "common" : "dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const MongoStore = connectMongo(expressSession);
  app.use(
    expressSession({
      secret: config.appSecret,
      store: new MongoStore({ mongooseConnection: mongoose.connection, touchAfter: 24 * 3600 }),
      resave: false,
      saveUninitialized: false,
    }),
  );

  applyPassport(app);

  app.use(express.static("landing"));
  app.get("/", (_, res) => {
    res.sendFile("./landing/index.html", { root: process.cwd() });
  });
  app.get("/terms", (_, res) => {
    res.sendFile("./terms.html", { root: process.cwd() });
  });

  app.use((req, res, nextFn) => {
    const { id } = req.query;
    if (!req.path.endsWith("newsfeeder.js") || !id) {
      return nextFn();
    }

    res.sendfile("static/WidgetScript.js");
  });

  app.get("/api/status", (_, res) => {
    res.send("OK");
  });

  app.use("/api/agents", agentsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/posts", postsRouter);

  app.use("/api/stripe-hook", stripeHookHandler);

  app.get("*", (req, res) => {
    return handle(req, res);
  });

  app.use(Sentry.Handlers.errorHandler({ shouldHandleError: err => err.statusCode !== 400 }));
  app.use(errorHandler);

  server.listen(config.port, () => {
    logger.info(`server is listening on port ${config.port}`);
  });

  const resp = await AgentModel.find({});
  if (resp.length === 0) {
    await seed();
  }

  // tslint:disable:no-unused-expression
  new CronJob("*/10 * * * *", downgradePlansJob).start();
});

// TODO: contacts
