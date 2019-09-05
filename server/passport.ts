import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { AgentModel } from "./models/agent.model";
import { cryptographyService } from "./services/cryptography.service";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  AgentModel.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      AgentModel.findOne({ email }, (err, agent) => {
        if (err) {
          return done(err);
        }
        if (!agent) {
          return done(null, false);
        }
        const passwordCorrect = cryptographyService.compareHash(password, agent.passhash);
        if (!passwordCorrect) {
          return done(null, false);
        }
        return done(null, agent);
      });
    },
  ),
);

export function applyPassport(router: express.Router) {
  router.use(passport.initialize());
  router.use(passport.session());
}
