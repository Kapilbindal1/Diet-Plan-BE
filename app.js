require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
require("./passport");
const isLoggedIn = require("./middleware/auth");

const app = express();

app.use(
  session({
    secret: "keyboard not cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.status(200).send('<button><a href="/auth" >Login With Google</a>');
});

app.get(
  "/auth",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/callback",
  passport.authenticate("google", { failureRedirect: "/login"}),
  (req, res) => {
    res.redirect('/auth/callback/success');
  }
);


app.get('/profile', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
})


app.get("/auth/callback/success", (req, res) => {
  if (!req.user) {
    res.redirect("/auth/callback/failure");
  }
  console.log(req);
  res.send("Welcome " );
});

// app.get("/auth/callback/failure", (req, res) => {
//   res.send("Error");
// });

// Logic goes here

module.exports = app;
