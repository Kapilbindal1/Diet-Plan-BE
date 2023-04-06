require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const passport = require("passport");
const expressSession = require("express-session");
require("./passport");

const app = express();

app.use(
  expressSession({
    secret: "keyboard not cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      name: "google-auth-session",
      keys: ["key1", "key2"],
    },
  })
);

app.get("/", (req, res) => {
  res.status(200).send('<button><a href="/auth" >Login With Google</a>');
});

app.get(
  "/auth",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/callback/success",
    failureRedirect: "/auth/callback/failure",
  })
);

app.get("/auth/callback/success", (req, res) => {
  if (!req.user) {
    res.redirect("/auth/callback/failure");
  }
  console.log(req);
  res.send("Welcome " );
});

app.get("/auth/callback/failure", (req, res) => {
  res.send("Error");
});

// Logic goes here

module.exports = app;
